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


def execute_python_code(code,inputs=""):

    try:
        

        addon="""
import builtins
# Define safe import and restricted open functions
def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    if name not in ['os',"globe","shutill",subprocess]:
        return original_import(name, globals, locals, fromlist, level)
    raise ImportError(f"Importing {name} is not allowed")

def restricted_open(*args, **kwargs):
    raise IOError("File opening is not allowed.")

# Save the original built-in functions
original_import = builtins.__import__
original_open = builtins.open

# Replace built-in functions with restricted versions
builtins.__import__ = safe_import
builtins.open = restricted_open

"""
        code=addon+"\n"+code
        #use subprocess to execute the code at terminal
        result = subprocess.run(
            ['python', '-c', code],
            capture_output=True,
            input=inputs,
            text=True,
            timeout=settings.CODE_EXECUTION_TIMEOUT #the program will raise timeout error if it exceeds settings.CODE_EXECUTION_TIMEOUTs of execution
        )
        return result.stdout or result.stderr
    except subprocess.TimeoutExpired:
        #time error is handled and the message is returned
        return {'error':'Execution timed out'}
    except Exception as e:
        return {'error': str(e)}




def execute_java_code(code,inputs=""):
    asset_path = settings.ASSET_DIR
    # Extract class name
    class_match = re.search(r'public\s+class\s+(\w+)', code)
    if not class_match:
        return 'No public class found'
    
    class_name = class_match.group(1)
    dir_path = os.path.abspath(os.path.join(asset_path,str(uuid.uuid4())))
    os.makedirs(dir_path)

    #using uuid to create temporary c file for execution
    temp_java_path = os.path.abspath(os.path.join(dir_path, f'{class_name}.java'))

    temp_exec_path = f'{class_name}'

    #writing the code into temporary file
    with open(temp_java_path, 'w') as f:
        f.write(code)
    try:
        #compiling the file using subprocess at terminal
        compile_result = subprocess.run(
            ['javac', temp_java_path],
            capture_output=True,
            cwd=dir_path,
            text=True
        )

        #if program has syntax error return the error message
        if compile_result.returncode != 0:
            print("syntax error occured")
            return compile_result.stderr
        #return the programs output
        run_result = subprocess.run(
            ['java', '-Djava.security.manager', '-Djava.security.policy==java.policy', temp_exec_path],
            capture_output=True,
            input=inputs,
            text=True,
            cwd=dir_path,
            timeout=settings.CODE_EXECUTION_TIMEOUT
        )
        return run_result.stdout or run_result.stderr
    except subprocess.TimeoutExpired:
        return 'Execution timed out'
    except Exception as e:
         return f'error:{str(e)}'
    finally:
        shutil.rmtree(dir_path)
     

   
def execute_c_code(code,inputs=""):
    file_uuid=uuid.uuid4()
    asset_path = settings.ASSET_DIR
    #using uuid to create temporary c file for execution
    temp_c_path = os.path.abspath(os.path.join(asset_path, f'{file_uuid}.c'))

    temp_exec_path = os.path.abspath(os.path.join(asset_path, f'{file_uuid}'))

    # Check for forbidden file operations
    if contains_forbidden_functions(code):
        return "Error: Code contains forbidden file operations."
    #writing the code into temporary file
    with open(temp_c_path, 'w') as f:
        f.write(code)
    try:
        #compiling the file using subprocess at terminal
        compile_result = subprocess.run(
            ['gcc', temp_c_path, '-o', temp_exec_path],
            capture_output=True,
            #inputs=inputs,
            text=True
        )

        #if program has syntax error return the error message
        if compile_result.returncode != 0:
            print("syntax error occured")
            return compile_result.stderr
        process = subprocess.Popen(
                [temp_exec_path],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
        )

            # Communicate with the process: send inputs and read outputs
        stdout, stderr = process.communicate(inputs)
        return stdout or stderr
    except subprocess.TimeoutExpired:
        return 'Execution timed out'
    except Exception as e:
         return f'error:{str(e)}'
    finally:
        if os.path.exists(temp_c_path):
            os.remove(temp_c_path)
        if os.path.exists(f"{temp_exec_path}"):
            os.remove(f"{temp_exec_path}")

def execute_cpp_code(code,inputs=""):
    file_uuid=uuid.uuid4()
    asset_path = settings.ASSET_DIR
    file_path = os.path.abspath(os.path.join(asset_path, f'{file_uuid}.cpp'))

    exec_path = os.path.abspath(os.path.join(asset_path, f'{file_uuid}'))

    # Check for forbidden file operations
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
        
        process = subprocess.Popen(
                [exec_path],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True)
        stdout, stderr = process.communicate(inputs)
        return stdout or stderr
    except subprocess.TimeoutExpired:
        return 'Execution timed out'
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists(f"{exec_path}"):
            os.remove(f"{exec_path}")

