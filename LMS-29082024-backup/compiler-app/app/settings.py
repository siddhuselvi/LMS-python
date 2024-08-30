from pathlib import Path
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
ASSET_DIR = os.path.join(BASE_DIR, 'assets')

CODE_EXECUTION_TIMEOUT = 100