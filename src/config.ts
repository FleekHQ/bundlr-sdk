// mumbai testnet: https://rpc-mumbai.matic.today
// alchemy mumbai project: https://polygon-mumbai.g.alchemy.com/v2/gPmcni8hZeWxdrPFYnkwveEO1j8b9HlM
import { readFileSync } from "fs";

export const arweaveConfig = {
    isDefault: true,
    url: "https://node1.bundlr.network",
    currency: "arweave",
    key: JSON.parse(readFileSync("arweave-wallet.json").toString()),
    custom: null,
};
  
// @@ TODO: Figure out how to correctly build the key object for the matic private key
// Is not accepting the private key as { "key": "RSA", "n": "xxxx"} for some reason? 
// ERROR: Expected private key to be an Uint8Array with length 32

export const maticConfig = {
    url: "https://devnet.bundlr.network",
    currency: "matic",
    key: JSON.parse(readFileSync("matic-wallet.json").toString()),
    custom: {
        customProvider: {
            providerUrl: "https://rpc-mumbai.matic.today"
         }
    }
};