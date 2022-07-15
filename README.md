Arweave POC for fleek plugins 

steps to configure environment: 

1) npm install from root 
2) npx arlocal (get local node from arweave running) 
3) npm run

will spin up a new server to run at localhost:3003/ 

now to the fun part and get this working: 

a) you need to set up an address first => 
POST 127.0.0.1:3003/address

a1) optional: check your address 
GET 127.0.0.1:3003/whoami 

b) post a transaction
POST 127.0.0.1:3003/transaction

c) fetch all transactions on the network 
GET 127.0.0.1:3003/transactions 

