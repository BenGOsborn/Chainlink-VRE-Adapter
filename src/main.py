# The purpose of this file is that I should be able to pass in code and requirements to run, it should execute them in a virtual environment with the dependencies, and should then return the result
# I can do this from within the single Docker image using Linux Containers I believe
# On creation of the container, the requirements will be installed, the code will be executed, the result will be returned to the API and will then be returned back to the adapter
# The adapter has the option to return a given type depending on what the user specifies