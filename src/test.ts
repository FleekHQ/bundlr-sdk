import { FleekBundlr } from "."
import { arweaveConfig, maticConfig } from './config';

async function test() {
    console.log('Starting a new FleekBundlr client');
    const { url, currency, key, custom } = arweaveConfig;
    const bundlrClient = new FleekBundlr(
        url,
        currency,
        key,
        custom,
    );
    const address = bundlrClient.getAddress();
    console.log('Client address: ', address);
    console.log('Client network: ', bundlrClient.getCurrency());

    // bundlrClient.fundWallet(10000000); Errors 
    const balance = await bundlrClient.getBalance();
    const strBalance = BigInt(balance).toString();
    console.log('Balance:' , strBalance);
    
};

function main() {
    return test().then(() => {
        console.log('Finished');
    }).catch(err => {
        console.error('Errored: ', err);
    });
};

main();