import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false)
  const web3ModalRef = useRef()
  const [ens, setENS] = useState('')
  const [address, setAddress] = useState('')


  const setENSOrAddress = async (address, web3Provider) => {
    let _ens = await web3Provider.lookupAddress(address);
  
    if (_ens) {
      setENS(_ens)
    } else {
      setAddress(address)
    }
  }

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const { chainId } = await web3Provider.getNetwork()
    if (chainId !== 5) {
      const message = "change the network to Goerli"
      window.alert(message)
      throw new Error(message)
    }

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()
    await setENSOrAddress(address, web3Provider)
    return signer
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true)
      setWalletConnected(true)
    } catch (error) {
      console.error({error})
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet Connected</div>
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      )
    }
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </div>
  );
}

