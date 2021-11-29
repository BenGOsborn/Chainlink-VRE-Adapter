# Pull and start the node
# NOTE: If your machine runs out of RAM during the setup, run the setup on another machine, then once the setup is done rerun it on the low RAM machine
docker pull smartcontract/chainlink:1.0.0
docker run -p 6688:6688 -v ${PWD}:/chainlink -it --env-file=.env smartcontract/chainlink:1.0.0 local n