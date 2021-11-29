docker pull smartcontract/chainlink:0.10.9
docker run -p 6688:6688 -v ${PWD}:/chainlink -it --env-file=.env.template smartcontract/chainlink:0.10.9 local n