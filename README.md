# Chainlink VRE Adapter

## A Python virtual runtime environment that allows smart contracts to execute Python code via [Chainlink](https://docs.chain.link/chainlink-nodes).

### Description

This repository contains the files needed to start the Python code isolated execution API, as well as the scripts required to create your own Chainlink node that can fetch the off chain data from the API and return it to the contract on chain.

A demo of the API can be found [here](http://137.184.33.37/). It should be noted that the host machine has very limited RAM as this is only a test environment, and is likely to fail on rapid calls or while fulfilling a request. The addresses of the contracts deployed to the [Rinkeby](https://www.rinkeby.io) network can be found in `node/address.json`.

### Requirements

-   Docker==v20.10.11

### Instructions

#### Running the API

**Dev**

**Production**

#### Running the Chainlink node
