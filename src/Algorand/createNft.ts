import { algodClient } from "./algoClient";
import algosdk from "algosdk";
import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";

const testAlgoAddress =
  "UNBYE4N7QW3U3HBEA6LNJ7WYBOF332TXOVFDML7XE2PNTZM2EMNSCL5SEU";
const testAlgoMmenonic =
  "security ten evidence soccer topic resource music lend job main jealous pet suit chair path cram economy vicious coffee stock keen violin car above because";
const sk = algosdk.mnemonicToSecretKey(testAlgoMmenonic).sk;
export async function createNFT(
  url: string,
  assetName: string,
  unitName: string
) {
  let params = await algodClient.getTransactionParams().do();
  const client = algodClient;
  const creator = testAlgoAddress;
  const defaultFrozen = false;
  const managerAddr = undefined;
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = undefined;
  const total = 1; // NFTs have totalIssuance of exactly 1
  const decimals = 0; // NFTs have decimals of exactly 0
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: url,
    assetMetadataHash: "16efaa3924a6fd9d3a4824799a4ac65d",
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  });

  const rawSignedTxn = txn.signTxn(sk);
  console.log(txn);
  const tx = await client.sendRawTransaction(rawSignedTxn).do();
  // wait for transaction to be confirmed
  await waitForConfirmation(client, tx.txId);
  console.log(tx.txId);
  // Get the new asset's information from the creator account
  const ptx = await client.pendingTransactionInformation(tx.txId).do();
  const assetID = ptx["asset-index"];
  console.log("AssetID = " + assetID);

  return assetID;
}

const waitForConfirmation = async function (
  algodclient: AlgodClient,
  txId: string
) {
  const response = await algodclient.status().do();
  let lastround = response["last-round"];
  while (true) {
    const pendingInfo = await algodclient
      .pendingTransactionInformation(txId)
      .do();
    if (
      pendingInfo["confirmed-round"] !== null &&
      pendingInfo["confirmed-round"] > 0
    ) {
      // Got the completed Transaction
      break;
    }
    lastround++;
    await algodclient.statusAfterBlock(lastround).do();
  }
};
