# So apparently IT WORKS - maybe I need to give it admin perms on my other one (run as sudo)

docker pull smartcontract/chainlink:1.0.0
docker run -p 6688:6688 -v ${PWD}:/chainlink -it --env-file=.env smartcontract/chainlink:1.0.0 local n