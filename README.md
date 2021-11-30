# Chainlink VRE Adapter

## A Python virtual runtime environment that allows smart contracts to execute Python code via [Chainlink](https://docs.chain.link/chainlink-nodes).

### Description

This repository contains the files needed to start the Python code isolated execution API, as well as the scripts required to create your own Chainlink node that can fetch the off chain data from the API and return it to the contract on chain.

A demo of the API can be found [here](http://137.184.33.37/). It should be noted that the host machine has very limited RAM as this is only a test environment, and is likely to fail on rapid calls or while fulfilling a request. The addresses of the contracts deployed to the [Rinkeby](https://www.rinkeby.io) network can be found in `node/address.json`.

### Requirements

-   Docker==v20.10.11

### Instructions - Running the API

**Dev - [Node v10.19.0](https://nodejs.org/en/) required**

1. `cd src`
2. `npm install`
3. `npm run dev`

**Production**

1. `cd src`
2. `bash install.sh`
3. `docker-compose up --build -d`

### Instructions - Running the Chainlink node

1. `cd node`
2. Rename `.env.template` to `.env` and replace the variables defined by `CHANGEME` with their respective parameters. You will need access to an Ethereum JSON-RPC API which you can get using [Infura](https://infura.io/), and you will need a database URI which you can get from [Heroku](https://www.heroku.com/), creating a new app, and installing the `Heroku Postgres` add on
3. `bash start.sh` and then enter your credentials for the node, then open the link it provides you with to access the node
