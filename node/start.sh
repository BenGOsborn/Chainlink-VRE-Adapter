docker pull smartcontract/chainlink:1.0.0
docker run -p 6688:6688 -v ${PWD}:/chainlink -it --env-file=.env.template smartcontract/chainlink:1.0.0 local n