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
    inputs: str

class GetResultRequest(BaseModel):
    task_id: str
    p_type: str
    code: str
    inputs: str

@compiler_router.post("/program-compiler/")
async def program_compiler(request: CodeRequest):
    if request.p_type not in ["python", "c", "cpp", "java"]:
        raise HTTPException(status_code=400, detail="Unsupported language")
    
    # Start a Celery task to execute the code
    task = execute_code_task.apply_async(args=[request.code, request.p_type, request.inputs])

    # Return the task ID to the client for further polling
    return {"status": "CALLGETRESULT", "task_id": task.id}



@compiler_router.post("/program-compiler/get-result")
async def get_result(request: GetResultRequest):
    print('Request: ', request.task_id, request.p_type, request.code, request.inputs)
    
    # Check task status directly without cache
    task_result = AsyncResult(request.task_id)

    # If the task ID is invalid or not found
    if not task_result or task_result.state == "REVOKED":
        raise HTTPException(status_code=404, detail="Task not found")

    print('task_result: ', task_result)
    print('test_result.state: ', task_result.state)

    if task_result.state == "SUCCESS":
        print('Entering Success function.....')
        data = task_result.result
        print('Result Data: ', data)
        
        # Ensure `data` is a dictionary before accessing
        if isinstance(data, str):
            data = {"result": data}
            
        return {"status": "SUCCESS", "result": data['result']}
    elif task_result.state == "FAILURE":
        return {"status": "FAILURE", "result": f"Task Result State Failure---{task_result}"}
    elif task_result.state == "PENDING":
        return {"status": "PENDING"}
    else:
        return {"status": task_result.state}
