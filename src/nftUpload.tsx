import { NFTStorage } from "nft.storage";
import { createNFT } from "./Algorand/createNft";
const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ5MjE1MTU4NzE5ZDkwOTc2M0UwYUE5YzJjMjFjMzk2QTFhOUYyMWQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTg1MzA4MzY2OCwibmFtZSI6Im5mdFVwbG9hZGVyS2V5In0.HixA_X7ZtkZToI1pPWBbeOlWcHVeg-i7LwXP-pVqtxw",
});

export async function nftUpload(file: File): Promise<string> {
  console.log(file.name);
  const metadata = await client.store({
    name: "person",
    description: "personPicture",
    whatever: "asd",
    image: file,
  });
  console.log("NFT data stored!");
  console.log(metadata.url);
  const result = await createNFT(metadata.url, "person", "CHAR1");
  console.log("nft stored! ");
  return result;
  // ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
}
