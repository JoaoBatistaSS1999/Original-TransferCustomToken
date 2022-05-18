import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./Wallet.module.css";
import TestAbi from "./Contracts/TestAbi.json";
import Interactions from "./Interactions";

const Wallet = () => {
  // Rinkeby token address
  const contractAddress = "0x3101918C2ef55E2Da961DBa4B4e55cb95A9C0685";

  const [tokenName, setTokenName] = useState("Token");
  const [btnText, setBtnText] = useState("Connect Wallet");
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const conectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => {
          accountChangeHandler(res[0]);
          setBtnText("Refresh Balance");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("install metamask");
    }
  };

  const accountChangeHandler = (newAddres) => {
    setDefaultAccount(newAddres);
    updateEthers();
  };

  const updateEthers = () => {
    // Read access
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    // Write access
    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    // Contract
    let tempContract = new ethers.Contract(
      contractAddress,
      TestAbi,
      tempSigner
    );
    setContract(tempContract);
  };

  useEffect(() => {
    if (contract != null) {
      updateBalance();
      updateTokenName();
    }
  }, [contract]);

  const updateBalance = async () => {
    const balanceBigN = await contract.balanceOf(defaultAccount);
    const balanceNumber = balanceBigN.toString();

    const tokenDecimals = await contract.decimals();
    setDecimals(tokenDecimals);
    const tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

    setBalance(tokenBalance);
  };

  const updateTokenName = async () => {
    const name = await contract.name();
    setTokenName(name);
  };

  return (
    <div className={styles.container}>
      <h2>{tokenName} ERC-20 Token Wallet</h2>
      <button onClick={conectWalletHandler}>{btnText}</button>
      <div className={styles.walletCard}>
        <h3>Address:{defaultAccount}</h3>
        <h2>
          {tokenName} balance: {balance}
        </h2>
      </div>
      <Interactions contract={contract} decimals={decimals} />
    </div>
  );
};

export default Wallet;
