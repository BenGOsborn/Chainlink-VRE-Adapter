docker pull smartcontract/chainlink:latest
docker run -p 6688:6688 -v ./:/chainlink -it --env-file=.env.template smartcontract/chainlink:latest local n