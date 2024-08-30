import subprocess
import os
import re
import shutil
import uuid
import hashlib
import builtins
from app import settings


# Assume `settings` module is imported and contains CODE_EXECUTION_TIMEOUT and ASSET_DIR

def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    if name in ['math', 'random', 'string']:
        return __import__(name, globals, locals, fromlist, level)
    raise ImportError(f'Importing {name} is not allowed')

def restricted_open(*args, **kwargs):
    raise IOError("File opening is not allowed.")

def validate_python_code(code):
    original_import = __import__
    original_open = open
    builtins.__import__ = safe_import
    builtins.open = restricted_open
    try:
        exec(code)
    except Exception as e:
        return {"issafe": False, "error": str(e)}
    finally:
        builtins.__import__ = original_import
        builtins.open = original_open
    return {"issafe": True}

FORBIDDEN_FUNCTIONS = [
    r'\bfopen\b', r'\bfclose\b', r'\bfread\b', r'\bfwrite\b', r'\bfscanf\b',
    r'\bfprintf\b', r'\bfgetc\b', r'\bfputc\b', r'\bfgets\b', r'\bfputs\b',
    r'\bremove\b', r'\brename\b', r'\bstd::ifstream\b', r'\bstd::ofstream\b', r'\bstd::fstream\b'
]

def contains_forbidden_functions(code):
    """Check if the code contains any forbidden functions."""
    for func in FORBIDDEN_FUNCTIONS:
        if re.search(func, code):
            return True
    return False

def execute_python_code(code):
    try:
        issafe = validate_python_code(code)
        if not issafe["issafe"]:
            return {'result': issafe['error']}

        run_result = subprocess.run(
            ['python3', '-c', code],
            capture_output=True,
            text=True,
            timeout=500
        )
        return {'result': run_result.stdout or run_result.stderr}
    except subprocess.TimeoutExpired:
        return {'result': 'Execution timed out'}
    except Exception as e:
        return {'result': str(e)}

def execute_java_code(code):
    # import ipdb;ipdb.set_trace()
    asset_path = settings.ASSET_DIR
    class_match = re.search(r'public\s+class\s+(\w+)', code)
    if not class_match:
        return 'No public class found'
    class_name = class_match.group(1)
    dir_path = os.path.join(asset_path, str(uuid.uuid4()))
    os.makedirs(dir_path, exist_ok=True)

    temp_java_path = os.path.join(dir_path, f'{class_name}.java')
    temp_exec_path = os.path.join(dir_path, class_name)

    with open(temp_java_path, 'w') as f:
        f.write(code)

    try:
        compile_result = subprocess.run(
            ['javac', temp_java_path],
            capture_output=True,
            cwd=dir_path,
            text=True
        )
        if compile_result.returncode != 0:
            return compile_result.stderr

        run_result = subprocess.run(
            ['java', '-Djava.security.manager', '-Djava.security.policy==java.policy', class_name],
            capture_output=True,
            cwd=dir_path,
            text=True,
            timeout=settings.CODE_EXECUTION_TIMEOUT
        )
        return {'result': run_result.stdout or run_result.stderr}
    except subprocess.TimeoutExpired:
        return {'result':'Execution timed out'}
    except Exception as e:
        return {'result': str(e)}
    finally:
        shutil.rmtree(dir_path)

def execute_c_code(code):
    file_uuid = uuid.uuid4()
    asset_path = settings.ASSET_DIR
    temp_c_path = os.path.join(asset_path, f'{file_uuid}.c')
    temp_exec_path = os.path.join(asset_path, f'{file_uuid}')

    if contains_forbidden_functions(code):
        return "Error: Code contains forbidden file operations."

    with open(temp_c_path, 'w') as f:
        f.write(code)

    try:
        compile_result = subprocess.run(
            ['gcc', temp_c_path, '-o', temp_exec_path],
            capture_output=True,
            text=True
        )
        if compile_result.returncode != 0:
            return compile_result.stderr

        run_result = subprocess.run(
            [temp_exec_path],
            capture_output=True,
            text=True,
            timeout=settings.CODE_EXECUTION_TIMEOUT
        )
        return {'result': run_result.stdout or run_result.stderr}
    except subprocess.TimeoutExpired:
        return {'result':'Execution timed out'}
    except Exception as e:
        return {'result':str(e)}
    finally:
        os.remove(temp_c_path)
        os.remove(temp_exec_path)

def execute_cpp_code(code):
    file_uuid = uuid.uuid4()
    asset_path = settings.ASSET_DIR
    file_path = os.path.join(asset_path, f'{file_uuid}.cpp')
    exec_path = os.path.join(asset_path, f'{file_uuid}')

    if contains_forbidden_functions(code):
        return "Error: Code contains forbidden file operations."

    try:
        with open(file_path, 'w') as f:
            f.write(code)

        compile_result = subprocess.run(
            ['g++', file_path, '-o', exec_path],
            capture_output=True,
            text=True
        )
        if compile_result.returncode != 0:
            return compile_result.stderr

        run_result = subprocess.run(
            [exec_path],
            capture_output=True,
            text=True,
            timeout=settings.CODE_EXECUTION_TIMEOUT
        )
        return {'result': run_result.stdout or run_result.stderr}
    except subprocess.TimeoutExpired:
        return {'result':'Execution timed out'}
    except Exception as e:
        return {'result':str(e)}
    finally:
        os.remove(file_path)
        os.remove(exec_path)
