# Demo React App to Deploy an Ethereum Contract

This is a demo react app that deploys a simple ethereum contract. Target is to [reproduce problems with metamask](https://github.com/MetaMask/metamask-extension/issues/6095).

# Initialisation of this Project

 - initialize a react app: `create-react-app react-metamask-test`
 - install dependencies: `npm install --save web3`
 - create a sample contract: `src/contracts/test.sol`
 - add `src/getWeb3.js`
 - edit `src/App.js` to deploy the contract

# Build

 - install npm dependencies: `npm install`
 - compile the contract to json: `solc --overwrite --combined-json abi,bin-runtime -o src/contracts/json src/contracts/test.sol`
 
# Run
 
 - run canache-cli: `ganache-cli -d --db ${HOME}/tmp/ganache/db -i 123456`
 - run in test environment: `BROWSER=none npm start`
 - head browser to `http://localhost:3000`

# cleanup

    - `rm -r node_modules build src/contracts/json`
