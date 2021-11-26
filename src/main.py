# The purpose of this file is that I should be able to pass in code and requirements to run, it should execute them in a virtual environment with the dependencies, and should then return the result
# I can do this from within the single Docker image using Linux Containers I believe
# On creation of the container, the requirements will be installed, the code will be executed, the result will be returned to the API and will then be returned back to the adapter
# The adapter has the option to return a given type depending on what the user specifies

# Ok, so now that we have LXC installed lets use it to spin up a container, install the requirements, run the code, cat the result and return it to the script that executed it

import os
import subprocess
import sys

# First of all we need some sort of Python container we can easily spin up. Maybe we can download a Python image, maybe we will have to make one ourselves and clone it if it does not yet exist

def execute_code(requirements: list, code: str) -> str:
    pass

def main():
    out = subprocess.run([sys.executable, "-c", "print('hello')"], capture_output=True, text=True, timeout=2)
    print(out.stdout)
    print(out.stderr)
    print(out.returncode)

if __name__ == "__main__":
    main()