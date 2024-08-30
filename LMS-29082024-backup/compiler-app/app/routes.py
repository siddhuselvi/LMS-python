from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from celery.result import AsyncResult
from app.tasks import execute_code_task
from app.cache_manager import cache_result
import hashlib

compiler_router = APIRouter()

class CodeRequest(BaseModel):
    code: str
    p_type: str

class GetResultRequest(BaseModel):
    task_id: str
    p_type: str
    code: str

@compiler_router.post("/program-compiler/")
async def program_compiler(request: CodeRequest):
    if request.p_type not in ["python", "c", "cpp", "java"]:
        raise HTTPException(status_code=400, detail="Unsupported language")
    cache_key = f"{request.p_type}_{hashlib.sha256(request.code.encode()).hexdigest()}"
    # Attempt to retrieve result from cache
    data = cache_result.get(cache_key)
    if data:
        print(data, '=======resultcache')
        return {"status": "SUCCESS","result": data['result']}
    else:
        # If not in cache, start a Celery task to execute the code
        task = execute_code_task.apply_async(args=[request.code, request.p_type])
        # Store the task ID in the cache while the task is running
        cache_result.set(cache_key, {"status": "PENDING", "task_id": task.id}, timeout=60*60*12)
        return {"status": "CALLGETRESULT", "task_id": task.id}




@compiler_router.post("/program-compiler/get-result")
async def get_result(request: GetResultRequest):
    print('Request: ', request.task_id, request.p_type, request.code)
    cache_key = f"{request.p_type}_{hashlib.sha256(request.code.encode()).hexdigest()}"
    # Attempt to retrieve result from cache
    cache_data = cache_result.get(cache_key)
    print('****cache_data****')
    if cache_data:
        print('***Entering If condition****')

        if cache_data.get("status") == "PENDING":
            print('=======resultpending')
            # Check task status
            task_result = AsyncResult(request.task_id)

            print('task_result: ', task_result)
            print('test_result.state: ', task_result.state)

            if task_result.state == "SUCCESS":
                print('Entering Success function.....')
                data = task_result.result
                print('Result Data: ', data)
                cache_result.set(cache_key, {"status": "SUCCESS", "result": data['result']})
                return {"status": "SUCCESS","result": data['result']}
            elif task_result.state == "FAILURE":
                return {"status": "SUCCESS", "result": f"Task Result State Failure---{task_result}"}
            else:
                return {"status": task_result.state}
        elif cache_data.get("status") == "SUCCESS":
            return {"status": "SUCCESS","result": cache_data.get("result")}
        else:
            return {"status": task_result.state,"result": cache_data.get("result")}
    raise HTTPException(status_code=404, detail="Task not found")
