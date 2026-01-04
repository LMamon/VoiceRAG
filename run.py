import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent

def run(cmd, cwd=None):
    return subprocess.Popen(cmd, cwd=cwd)

if __name__ == "__main__":
    print("Starting backend...")
    backend = run(
        [sys.executable, "-m", "uvicorn", "app.backend.app:app", "--reload", "--port", "8000"],
        cwd=ROOT
    )

    print("Starting frontend...")
    frontend = run(
        [sys.executable, "-m", "http.server", "8001"],
        cwd=ROOT / "app" / "frontend"
    )

    backend.wait()
    frontend.wait()