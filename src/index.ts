import Bundlr from '@bundlr-network/client';
import BigNumber from 'bignumber.js';

const currencyName = 'foo';

// privateKey accepts paths to key files, raw key strings, or even objects 
const privateKey = 'bar';

const bundlr = new Bundlr("http://node1.bundlr.network", currencyName, privateKey);


export function parseInput(input: number) {
  const conv = new BigNumber(input).multipliedBy(bundlrInstance!.currencyConfig.base[1])
  if (conv.isLessThan(1)) {
      console.log('error: value too small')
      toast({
          title: "Error: value too small",
          status: "error"
      })
      return
  } else {
      return conv
  }
}

async function fundWallet(amount) {
  if (!amount) return
  const amountParsed = parseInput(amount);
  await bundlrInstance.fund(amountParsed);
}