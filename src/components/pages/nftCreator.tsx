import React, { useState } from "react";
import { FileUploadPage } from "../FIleUpload";
import placeholder from "../../images/placeholder.png";
import { nftUpload } from "../../nftUpload";

interface State {
  img: File | null;
  loading: boolean;
  message: string;
}

export function NFTCreator() {
  const [stateCharacter, setStateCharacter] = useState<State>({
    img: null,
    loading: false,
    message: "",
  });

  const [stateProjectile, setStateProjectile] = useState<State>({
    img: null,
    loading: false,
    message: "",
  });

  const changeHandler = async (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files || [];
    console.log("file is: " + files.length);
    const file: File = files[0];
    console.log(file.name);
    await nftUpload(file);
  };

  return (
    <div className="flex justify-center mt-20 w-screen">
      <div className="flex flex-col lg:w-2/3 ">
        <div className="border border-black text-xl h-20 flex justify-center items-center text-6xl">
          NFT Creator!
        </div>
        <div className="flex justify-around mt-10 items-center">
          <input
            className="flex justify-center w-1/6"
            type={"file"}
            multiple={false}
            accept="image/jpeg, image/png"
            onChange={(event) => {
              if (event.target.files) {
                const selectedFile = Array.from(event.target.files)[0];
                setStateCharacter({ ...stateCharacter, img: selectedFile });
              }
            }}
          />
          <div className="flex justify-center w-1/4 border border-black">
            {stateCharacter.img ? (
              <img src={URL.createObjectURL(stateCharacter.img)} alt="img1" />
            ) : (
              <img src={placeholder} alt="img1" />
            )}
          </div>
          <div className="flex justify-center w-1/4 border border-black">
            {stateProjectile.img ? (
              <img src={URL.createObjectURL(stateProjectile.img)} alt="img1" />
            ) : (
              <img src={placeholder} alt="img1" />
            )}
          </div>
          <input
            className="flex justify-center w-1/6"
            type={"file"}
            multiple={false}
            accept="image/jpeg, image/png"
            onChange={(event) => {
              if (event.target.files) {
                const selectedFile = Array.from(event.target.files)[0];
                setStateProjectile({ ...stateProjectile, img: selectedFile });
              }
            }}
          />
        </div>
        <div className="flex justify-around mt-10">
          <div className="flex justify-center w-1/6"></div>
          {stateCharacter.img ? (
            <button
              className="flex justify-center items-center w-1/4 border border-black rounded-lg"
              onClick={(event) => {
                const changeHandler = async () => {
                  if (stateCharacter.img) {
                    setStateCharacter({
                      ...stateCharacter,
                      loading: true,
                      message: "",
                    });
                    nftUpload(stateCharacter.img).then((result) => {
                      setStateCharacter({
                        ...stateCharacter,
                        loading: false,
                        message: `AssetID: ${result}`,
                      });
                    });
                  }
                };
                changeHandler();
              }}
            >
              Confirm
            </button>
          ) : (
            <button className="flex justify-center items-center w-1/4 border border-black rounded-lg opacity-50 cursor-default">
              Confirm
            </button>
          )}
          {stateProjectile.img ? (
            <button
              className="flex justify-center items-center w-1/4 border border-black rounded-lg"
              onClick={(event) => {
                const changeHandler = async () => {
                  if (stateProjectile.img) {
                    setStateProjectile({
                      ...stateProjectile,
                      loading: true,
                      message: "",
                    });
                    nftUpload(stateProjectile.img).then((result) => {
                      setStateProjectile({
                        ...stateProjectile,
                        loading: false,
                        message: `AssetID: ${result}`,
                      });
                    });
                  }
                };
                changeHandler();
              }}
            >
              Confirm
            </button>
          ) : (
            <button className="flex justify-center items-center w-1/4 border border-black rounded-lg opacity-50 cursor-default">
              Confirm
            </button>
          )}
          <div className="flex justify-center w-1/6"></div>
        </div>
        <div className="flex justify-around mt-10 h-10">
          <div className="flex justify-center w-1/6"></div>
          <div className="flex justify-center w-1/4">
            {stateCharacter.loading && <div>Loading...</div>}
          </div>
          <div className="flex justify-center w-1/4">
            {stateProjectile.loading && <div>Loading...</div>}
          </div>
          <div className="flex justify-center w-1/6"></div>
        </div>
        <div className="flex justify-around h-10">
          <div className="flex justify-center w-1/6"></div>
          <div className="flex justify-center w-1/4">
            <div>{stateCharacter.message}</div>
          </div>
          <div className="flex justify-center w-1/4">
            <div>{stateProjectile.message}</div>
          </div>
          <div className="flex justify-center w-1/6"></div>
        </div>
      </div>
    </div>
  );
}
