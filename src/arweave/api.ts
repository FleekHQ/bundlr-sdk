import axios from "axios";
import Util from "util";
// eslint-disable-next-line @typescript-eslint/no-var-requires

const BALANCE = 999999999999;

export async function multipleUploadTxs(client, transaction) {
  try {
    const uploader = await client.transactions.getUploader(transaction);
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
  } catch (err) {
    console.log("Upload Txs Error: ", Util.inspect(err, { depth: null }));
    throw new Error(err);
  }
}

export async function generateWalletAndAddress(client) {
  const jwk = await client.wallets.generate();
  const address = await client.wallets.getAddress(jwk);
  return { jwk, address };
}

export async function getBalance(address) {
  try {
    const { data } = await axios.get(`http://127.0.0.1:1984/wallet/${address}/balance`);
    return data;
  } catch (err) {
    return err;
  }
}

// ARLocal only
export async function mintWalletAndFund(address, fundBalance = BALANCE) {
  // https://github.com/textury/arlocal/blob/main/__tests__/wallet.spec.ts#L47
  // /mint/<address>/<balance>
  try {
    // Creates a new wallet and funds it
    const postWallet = await axios.post("http://127.0.0.1:1984/wallet", {
      address,
      balance: 1,
    });
    await axios.get(`http://127.0.0.1:1984/mint/${address}/${fundBalance}`);
    return postWallet.data.address;
  } catch (err) {
    console.error(err.data);
    return { error: true };
  }
}

export async function newTransaction(client, data, key) {
  try {
    const tx = await client.createTransaction({ data, key });
    console.info("New transaction done!", tx);
    return tx;
  } catch (err) {
    console.log("Error while new tx: ", err);
    throw new Error(err);
  }
}

// TEST
// async function processTxs(client) {
//   try {
//     const { jwk: key, address } = await generateWalletAndAddress(client);
//     // const owner = address;
//     await mintWalletAndFund(address);
//     // fs.readFile() blabla ???
//     const data = '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>';
//     await newTransaction(client, data, key);
//     return true;
//   } catch (err) {
//     process.exit(1);
//   }
// }
