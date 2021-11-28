# Install the supported Python images **** THIS WILL NEED REFACTORING IN THE MAIN CODE
docker build -t bengosborn/install . -f install.Dockerfile
x = (docker run bengosborn/install)
echo $x

# Start the service 