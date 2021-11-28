# Install the supported Python images
docker build -t bengosborn/install . -f install.Dockerfile
x=$(docker run bengosborn/install)
echo $x
bash -c "${x}"

# Start the service 
docker-compose up --build -d