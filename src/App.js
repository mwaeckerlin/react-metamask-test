import React, { Component } from 'react';
import getWeb3 from "./getWeb3.js";
import { contracts } from "./contracts/json/combined.json";

class App extends Component {
  state = {
    web3: null,
    accounts: [],
    account: "",
    contract: null,
    gas: 0,
    gasprice: 0,
    a: "",
    b: "",
    c: "1",
  };
  test = contracts["src/contracts/test.sol:test"];
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.deploy = this.deploy.bind(this);
    getWeb3.then(res => {
      this.setState({web3: res});
      this.updateAccounts(() => {
        this.setState({contract: new res.eth.Contract(JSON.parse(this.test.abi))});
        this.handleChange(null);
      });
    });
  }
  updateAccounts(cb = null) {
    this.state.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log("ERROR in getAccounts:", error);
        return;
      }
      this.setState(prev => ({
        accounts: [],
        account: prev.account || accounts[0] || ""
      }));
      accounts.forEach(account => {
        this.state.web3.eth.getBalance(account).then(balance => {
          this.setState(prev => ({
            accounts: [
              ...prev.accounts,
              {
                account: account,
                balance: balance
              }
            ]
          }));
        });
      });
      if (cb) cb();
    });
  }
  getDeploy() {
    return this.state.contract.deploy({
      data: this.test.bin,
      arguments: [this.state.a, this.state.b, this.state.c]
    });
  }
  deploy() {
    this.getDeploy()
        .send({
          from: this.state.account,
          gas: this.state.gas,
          gasPrice: this.state.gasprice
        })
        .then(instance => {
          console.log("success:", instance.options.address);
          this.updateAccounts();
        })
        .catch(err => {
          console.log("ERROR in deploy:", err);
        });
  }
  handleChange(event) {
    if (event) this.setState({ [event.target.name]: event.target.value });
    this.getDeploy()
        .estimateGas()
        .then(gas => {
          console.log('gas', gas);
          this.setState({ gas: Math.round(1.2*gas) });
        });
    this.state.web3.eth.getGasPrice().then(gasprice => {
      console.log('gasprice', gasprice);
      this.setState({ gasprice: gasprice });
    });
  }
  render() {
    return (
      <div className="App">
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <label htmlFor="account">select account:</label>
          <select
            name="account"
            value={this.state.account}
            onChange={this.handleChange}
          >
            {this.state.accounts.map(account => (
              <option key={account.account} value={account.account}>
                {account.account}, {account.balance}
              </option>
            ))}
          </select><br/>
          <label htmlFor="a">A</label>
          <input
            id="a"
            name="a"
            type="text"
            placeholder="a"
            value={this.state.a}
            onChange={this.handleChange}
          /><br/>
          <label htmlFor="b">B</label>
          <textarea
            id="b"
            name="b"
            placeholder="b"
            value={this.state.b}
            onChange={this.handleChange}
          /><br/>
          <label htmlFor="c">C</label>
          <input
            id="c"
            name="c"
            type="number"
            placeholder="c"
            value={this.state.c}
            onChange={this.handleChange}
          /><br/>
          <button disabled={!this.state.web3} onClick={this.deploy}>
            create contract for {this.state.gasprice * this.state.gas}
          </button>
        </form>
      </div>
    );
  }
}

export default App;
