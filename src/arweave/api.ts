import axios from "axios";
import Util from "util";
import { gql, request } from "graphql-request";

const BALANCE = 999999999999;
const ARWEAVE_GRAPHQL_URL = "http://localhost:1984/graphql";

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
    console.log(`Funded ${address} with ${fundBalance}`);
    return postWallet.data.address;
  } catch (err) {
    console.error(err.data);
    return { error: true };
  }
}

export async function newTransaction(client, data, key) {
  try {
    console.log("Client:", client);
    const tx = await client.createTransaction({ data, key });
    console.info("New transaction done!", tx);
    return tx;
  } catch (err) {
    console.log("Error while new tx: ", err);
    throw new Error(err);
  }
}

export async function findByOwner(owner: string) {
  const findByOwner = gql`
    query findByOwner(owner: String!){
      transactions(owners:[owner]) {
          edges {
              node {
                  id
              }
          }
      }
    }
  `;
  const query = findByOwner;
  const result = await request(ARWEAVE_GRAPHQL_URL, query, {
    owner,
  });
  return result;
}
