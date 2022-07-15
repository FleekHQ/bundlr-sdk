import { Request, Response } from "express";
import { FleekWeave } from "./";

// We should pass stuff like the wallet.json and this should behave like an API for interacting with AR.
// @@TODO: Decouple
// const fleekWeave = new (pathToWallet.json, GraphQLEndpoint ?);
const fleekWeave = new FleekWeave();

export const getAddress = async (req: Request, res: Response) => {
  const address = fleekWeave.getAddress();
  return res.json({ address });
};

export const mintWalletAndFund = async (req: Request, res: Response) => {
  await fleekWeave.generateNewWalletAndFund();
  return res.json({ success: true });
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    console.log("createTransaction");
    const newTx = "<html><body><p>Hi!</p></body></html>";
    const tx = await fleekWeave.createTx(newTx);
    return res.json({ data: tx });
  } catch (err) {
    console.log("Error: ", err);
    res.status(404).send(err);
  }
};

export const getTransactionsByOwner = async (req: Request, res: Response) => {
  try {
    console.log("getTransactionsByOwner");
    const txs = await fleekWeave.getTransactions();
    return res.json({ data: txs });
  } catch (err) {
    console.log("Error: ", err);
    res.status(404).send(err);
  }
};

export const getTransactionsIds = async (req: Request, res: Response) => {
  try {
    console.log("getTransactionsIds");
    const txs = await fleekWeave.getTransactionsIds();
    return res.json({ data: txs });
  } catch (err) {
    console.log("Error: ", err);
    res.status(404).send(err);
  }
};
