import React, { useState } from "react";
import { nftUpload } from "../nftUpload";

export function FileUploadPage() {
  const changeHandler = async (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files || [];
    console.log("file is: " + files.length);
    const file: File = files[0];
    console.log(file.name);
    await nftUpload(file);
  };

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
    </div>
  );
}
