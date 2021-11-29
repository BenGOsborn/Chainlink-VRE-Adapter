# Pull and start the node
# NOTE: If your machine runs out of RAM during the setup, run the setup on another machine, then once the setup is done rerun it on the low RAM machine
docker pull smartcontract/chainlink:1.0.0
if [-d ".api"]; then
    read -p "Your API email: " email
    email > .api
    read -p "Your API password: " password
    password > .api
fi
if [-d ".password"]; then
    read -p "Your wallet password: " wpassword
    wpassword > .password
fi
docker run -dp 6688:6688 -v ${PWD}:/chainlink -it --env-file=.env smartcontract/chainlink:1.0.0 local n -p .password -a .api