import Bundlr from '@bundlr-network/client';
import BigNumber from 'bignumber.js';
import { readFileSync } from "fs";

const defaultConfig = {
  network: "arweave", // make optional
  nodeUri: "https://node1.bundlr.network", // replace with dev env
};
export class FleekBundlr {
  private client;
  public address;

  constructor(config = null) {
    // If you want to connect directly to a node
    const cfg = config ? config : defaultConfig;
    const key = JSON.parse(readFileSync("wallet.json").toString());
    console.log("cfg: ", cfg);
    const bundlrInstance = new Bundlr(cfg.nodeUri, cfg.network, key);
    this.client = bundlrInstance
    console.log("init client: ", this.client);
    this.address = bundlrInstance.address;
    console.log("address: ", this.address);
  }

  public getAddress() {
    if (!this.address) {
      console.log("Need to set an address first");
      return null;
    }

    // get your account address (associated with your private key)
    const address = bundlrInstance.address;
    return this.address;
  }

  private parseInput (input) {
    const amount = new BigNumber(input).multipliedBy(this.client.currencyConfig.base[1])
    if (amount.isLessThan(1)) {
      throw Error("Value too small");
    }
    return amount
  };

  public async fundWallet(amount) {
    // you should have 0 balance (unless you've funded before), so lets add some funds:
    // Reminder: this is in atomic units (see https://docs.bundlr.network/docs/faq#what-are-baseatomic-units)
    // const fundStatus = await bundlrInstance.fund(100_000_000)
    // this will take up to an hour to show up for arweave - other currencies are faster.
    if (!amount) {
      throw Error('Need to send amount for funding wallet!');
    }
    const amountParsed = this.parseInput(amount)
    let response = await this.client.fund(amountParsed)
    console.log('Wallet funded: ', response)
  }
  
  public async getBalance() {
    if (!this.address) {
      throw new Error("Need to get an address first");
    }
    // get your accounts balance
    const balance = await this.client.getLoadedBalance();
    // convert it into decimal units
    const decimalBalance = this.client.utils.unitConverter(balance);
    console.log('Balance: ', decimalBalance);
    return decimalBalance;
  }

  public async uploadFile(file) {
    let tx = await this.client.uploader.upload(file);
    console.log('tx: ', tx);
  }
  
  public async createTx(data) {
    if (!this.address) {
      throw new Error("Need to have an address first");
    }
    if (!data) {
      throw new Error("Need to have data input");
    }
  
    // create a Bundlr Transaction
    const tx = this.client.createTransaction(data)
    // want to know how much you'll need for an upload? simply:
    // get the number of bytes you want to upload
    const size = tx.size
    // query the bundlr node to see the price for that amount
    const cost = await this.client.getPrice(size);
    console.log('Cost of the tx: ', cost);
    // sign the transaction
    await tx.sign()
    // get the transaction's ID:
    const id = tx.id
    console.log('Transaction ID: ', id);
    // upload the transaction
    const result = await tx.upload()
    console.log('Result: ', result);
    // once the upload succeeds, your data will be instantly accessible at `https://arweave.net/${id}`
    return result;
  }

}
