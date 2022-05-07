import { algodClient } from "./algoClient";
import algosdk from "algosdk";
import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";

const testAlgoAddress = 'UNBYE4N7QW3U3HBEA6LNJ7WYBOF332TXOVFDML7XE2PNTZM2EMNSCL5SEU';
const testAlgoMmenonic = 'security ten evidence soccer topic resource music lend job main jealous pet suit chair path cram economy vicious coffee stock keen violin car above because';
const sk = algosdk.mnemonicToSecretKey(testAlgoMmenonic);
export async function createNFT(url: string, assetName: string, unitName: string) {
    let params = await algodClient.getTransactionParams().do();
    const client = algodClient
    const creator = testAlgoAddress;
    const defaultFrozen = false;
    const managerAddr = undefined;
    const reserveAddr = undefined;
    const freezeAddr = undefined;
    const clawbackAddr = undefined;
    const total = 1;                // NFTs have totalIssuance of exactly 1
    const decimals = 0;             // NFTs have decimals of exactly 0
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: creator,
        total,
        decimals,
        assetName,
        unitName,
        assetURL: url,
        assetMetadataHash: '16efaa3924a6fd9d3a4824799a4ac65d',
        defaultFrozen,
        freeze: freezeAddr,
        manager: managerAddr,
        clawback: clawbackAddr,
        reserve: reserveAddr,
        suggestedParams: params,
    });

    console.log("Transaction : " + txn.txID());
    let assetID = null;
    // wait for transaction to be confirmed
    await waitForConfirmation(client, txn.txID());
    // Get the new asset's information from the creator account
    const ptx = await client.pendingTransactionInformation(txn.txID()).do();
    assetID = ptx["asset-index"];
    // console.log("AssetID = " + assetID);

    await printCreatedAsset(client, testAlgoAddress, assetID);
}

const waitForConfirmation = async function (algodclient: AlgodClient, txId: string) {
    const response = await algodclient.status().do();
    let lastround = response["last-round"];
    while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            // Got the completed Transaction
            break;
        }
        lastround++;
        await algodclient.statusAfterBlock(lastround).do();
    }
};


// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodclient: AlgodClient, account: string, assetid: string) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    const accountInfo = await algodclient.accountInformation(account).do();
    for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
        const scrutinizedAsset = accountInfo['created-assets'][idx];
        if (scrutinizedAsset.index == assetid) {
            const myparms = JSON.stringify(scrutinizedAsset.params, undefined, 2);
            break;
        }
    }
};