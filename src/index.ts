import Bundlr from '@bundlr-network/client';
import BigNumber from 'bignumber.js';
import { readFileSync } from "fs";

const key = JSON.parse(readFileSync("wallet.json").toString());
// other currencies without one - set key as your private key string

// initialise a bundlr client
const network = "arweave";
const bundlrInstance = new Bundlr("https://node1.bundlr.network", network, key)

function parseInput (input) {
  const amount = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
  if (amount.isLessThan(1)) {
    throw Error("Value too small");
  }
  return amount
};

async function uploadFile(file) {
  let tx = await bundlrInstance.uploader.upload(file);
  console.log('tx: ', tx);
}

async function fundWallet(amount) {
  if (!amount) return
  const amountParsed = parseInput(amount)
  let response = await bundlrInstance.fund(amountParsed)
  console.log('Wallet funded: ', response)
}

async function main() {
    // currencies with a keyfile: load + parse your keyfile as below:

    // get your account address (associated with your private key)
    const address = bundlrInstance.address;

    // get your accounts balance
    const balance = await bundlrInstance.getLoadedBalance();

    // convert it into decimal units
    const decimalBalance = bundlrInstance.utils.unitConverter(balance)

    // you should have 0 balance (unless you've funded before), so lets add some funds:
    // Reminder: this is in atomic units (see https://docs.bundlr.network/docs/faq#what-are-baseatomic-units)
    const fundStatus = await bundlrInstance.fund(100_000_000)
    // this will take up to an hour to show up for arweave - other currencies are faster.

    // get the data you want to upload
    // from a file:
    const data = readFileSync("./data.txt")

    // create a Bundlr Transaction
    const tx = bundlrInstance.createTransaction(data)

    // want to know how much you'll need for an upload? simply:
    // get the number of bytes you want to upload
    const size = tx.size
    // query the bundlr node to see the price for that amount
    const cost = await bundlrInstance.getPrice(size);
    console.log('Cost of the tx: ', cost);
    // sign the transaction
    await tx.sign()
    // get the transaction's ID:
    const id = tx.id
    console.log('Transaction ID: ', id);
    // upload the transaction
    const result = await tx.upload()

    // once the upload succeeds, your data will be instantly accessible at `https://arweave.net/${id}`
}
main()