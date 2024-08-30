from app.celery_config import celery_app
from app.execute_code import execute_python_code, execute_c_code, execute_cpp_code, execute_java_code

@celery_app.task(name="app.tasks.execute_code_task")
def execute_code_task(code, language):
    # Mapping language types to their respective execution functions
    language_dict = {
        "python": execute_python_code,
        "c": execute_c_code,
        "cpp": execute_cpp_code,
        "java": execute_java_code,
    }
    
    execute_code_function = language_dict.get(language)
    if not execute_code_function:
        raise ValueError(f"Unsupported language: {language}")
    
    # Execute the code and return the result
    result = execute_code_function(code)
    return result
