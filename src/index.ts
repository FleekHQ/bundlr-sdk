import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Arweave = require("arweave");

// If you want to connect directly to a node
const arweaveClient = Arweave.init({
  host: "127.0.0.1",
  port: 1984,
  protocol: "http",
});

async function uploadTxs(client, transaction) {
  try {
    const uploader = await client.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
  } catch (err) {
    console.log("Upload Txs Error: ", err);
    throw new Error(err);
  }
}

async function generateWalletAndAddress() {
  const jwk = await arweaveClient.wallets.generate();
  const address = await arweaveClient.wallets.getAddress(jwk);
  return { jwk, address };
}

// ARLocal only
async function mintWalletAndFund(address) {
  // https://github.com/textury/arlocal/blob/main/__tests__/wallet.spec.ts#L47
  // /mint/<address>/<balance>
  try {
    console.log("mintWallet", address);
    const postWallet = await axios.post("http://127.0.0.1:1984/wallet", {
      address,
      balance: 1,
    });

    console.log("postwallet: ", postWallet.data);

    const mintWallet = await axios.get(`http://127.0.0.1:1984/mint/${address}/100`);
    console.log("mintWallet: ", mintWallet.data);

    const getBalance = await axios.get(`http://127.0.0.1:1984/wallet/${address}/balance`);
    console.log("balance: ", getBalance.data);

    return postWallet.data.address;
  } catch (err) {
    console.error(err.data);
    return { error: true };
  }
}

async function processTxs() {
  try {
    const { jwk: key, address } = await generateWalletAndAddress();

    await mintWalletAndFund(address);

    // const transaction = await arweaveClient.createTransaction(
    //   {
    //     data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>',
    //   },
    //   key
    // );

    // await arweaveClient.transactions.sign(transaction, key);

    // // await uploadTxs(arweaveClient, transaction);
    // const response = await arweaveClient.transactions.post(transaction);
  } catch (err) {
    process.exit(1);
  }
}
const main = () => processTxs();

main();
