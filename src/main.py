# The purpose of this file is that I should be able to pass in code and requirements to run, it should execute them in a virtual environment with the dependencies, and should then return the result
# I can do this from within the single Docker image using Linux Containers I believe
# On creation of the container, the requirements will be installed, the code will be executed, the result will be returned to the API and will then be returned back to the adapter
# The adapter has the option to return a given type depending on what the user specifies

# Ok, so now that we have LXC installed lets use it to spin up a container, install the requirements, run the code, cat the result and return it to the script that executed it

import os
import subprocess
import sys

# First of all we need some sort of Python container we can easily spin up. Maybe we can download a Python image, maybe we will have to make one ourselves and clone it if it does not yet exist

# First of all we should check if the container actually exists
# If it does not exist, we will create a new container with all of the dependencies installed

def execute_code(requirements: list, code: str) -> str:
    pass

def main():
    # This runs an executable and returns the output and whether there was an error
    out = subprocess.run([sys.executable, "-c", "print(3)"], capture_output=True, text=True, timeout=2)
    if out.returncode == 0:
        print(out.stdout.strip())
    else:
        print(out.stderr.strip())

if __name__ == "__main__":
    main()