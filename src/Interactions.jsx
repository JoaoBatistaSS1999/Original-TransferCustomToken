import { BigNumber } from "ethers";
import React, { useState } from "react";
import styles from "./Interactions.module.css";

const Interactions = ({ contract, decimals }) => {
  const [transferHash, setTransferHash] = useState("transferHash");

  const transferHandler = async (event) => {
    event.preventDefault();
    const transferValue =
      event.target.sendAmount.value * Math.pow(10, decimals);
    const stringTransfer = transferValue.toString();

    console.log(transferValue.toString());

    const recieverAdderss = event.target.recieverAddress.value;
    const transaction = await contract.transfer(
      recieverAdderss,
      stringTransfer
    );
    setTransferHash(transaction.hash);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={transferHandler}>
        <h3> Transfer Coins </h3>
        <p> Reciever Address </p>
        <input type='text' id='recieverAddress' />

        <p> Send Amount </p>
        <input type='number' id='sendAmount' min='0' step='1' />

        <button type='submit'>Send</button>
        <div>{transferHash}</div>
      </form>
    </div>
  );
};

export default Interactions;
