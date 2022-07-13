import express from "express";
import cors from "cors";
import { getAddress, mintWalletAndFund, createTransaction, getTransactionsByOwner } from "./handlers";

const app = express();

app.use([cors(), express.json()]);
const PORT = 3003;

app.get("/whoami", getAddress);
app.get("/transactions", getTransactionsByOwner);
app.post("/address", mintWalletAndFund);
app.post("/transaction", createTransaction);

app.listen(PORT, () => {
  console.log(`/// Fleekweave running: ${PORT} ///`);
});
