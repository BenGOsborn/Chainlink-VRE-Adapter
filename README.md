# Chainlink VRE Adapter

## WARNING: DO NOT RUN CODE THAT YOU DO NOT UNDERSTAND. BE CAREFUL WHEN GIVING THIS SCRIPT ACCESS TO YOUR PRIVATE KEY. I AM NOT RESPONSIBLE FOR ANY FUNDS YOU MAY LOSE.

## A Python virtual runtime environment that allows smart contracts to execute Python code via [Chainlink](https://docs.chain.link/chainlink-nodes).

### Description

This repository contains the files needed to start the Python code isolated execution API, as well as the scripts required to create your own Chainlink node that can fetch the off chain data from the API and return it to the contract on chain.

A demo of the API can be found [here](http://137.184.33.37/). It should be noted that the host machine has very limited RAM as this is only a test environment, and is likely to fail on rapid calls or while fulfilling a request. The addresses of the contracts deployed to the [Rinkeby](https://www.rinkeby.io) network can be found in `node/address.json`.

### Requirements

-   [Docker==v20.10.11](https://www.docker.com/)

### Instructions - Running the API

**Dev - [Node v10.19.0](https://nodejs.org/en/) required**

1. `cd src`
2. `npm install`
3. `npm run dev`

**Production**

1. `cd src`
2. `bash install.sh`
3. `docker-compose up --build -d`, then go to port 80 on your machine to access the API

### Instructions - Running the Chainlink node

1. `cd node`
2. Rename `.env.template` to `.env` and replace the variables defined by `CHANGEME` with their respective parameters. You will need access to an Ethereum JSON-RPC API which you can get using [Infura](https://infura.io/) (MAKE SURE YOU USE THE WEBSOCKET VERSION `wss://...`), and you will need a database URI which you can get from [Heroku](https://www.heroku.com/), creating a new app, and installing the `Heroku Postgres` add on
3. `bash start.sh` and then enter your credentials for the node, then open the link it provides you with to access the node

### Instructions - Using the Chainlink node - [Node v10.19.0](https://nodejs.org/en/) required

-   To interface with any of the custom jobs you will need to add a new bridge in your node called `py-vre` with the URL of your API
-   To deploy an oracle contract, add your private key `PRIVATE_KEY=` and Infura URL `INFURA_URL=` to `.env` in `node`
-   To add one of the jobs from `node/jobs` to the node, under the `jobs` tab of your node GUI select `New Job`, then copy and paste the job from one of the `.toml` files. Replace `CHANGEME` with the address of your deployed oracle contract
-   It should be noted that each job is suitable for a different return type (bool, bytes32, int256, uint256) - use the appropriate job for the appropriate type of data you wish for your contract to receive
