# Pull and start the node
# NOTE: If your machine runs out of RAM during the setup, run the setup on another machine, then once the setup is done rerun it on the low RAM machine

# Pull the image
# docker pull smartcontract/chainlink:1.0.0

# Read in the Node credentials
if [ ! -e ".api" ]; then
    read -p "Your API email: " email
    echo $email >> .api

    read -p "Your API password: " password
    echo $password >> .api
fi
if [ ! -e ".password" ]; then
    read -p "Your wallet password: " wpassword
    echo $wpassword >> .password
fi

# Start the node
# docker run -dp 6688:6688 -v ${PWD}:/chainlink -it --env-file=.env smartcontract/chainlink:1.0.0 local n -p .password -a .api