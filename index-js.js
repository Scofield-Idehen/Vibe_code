import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem"
import {contractAddress, cofeeabi} from "./constants-js.js"
// for security paste the following and not rely on esm.sh
// import "/@noble/curves@1.8.2/es2022/secp256k1.mjs";
// import "/@noble/hashes@1.7.2/es2022/ripemd160.mjs";
// import "/@noble/hashes@1.7.2/es2022/sha256.mjs";
// import "/@noble/hashes@1.7.2/es2022/sha3.mjs";
// import "/abitype@1.0.8/es2022/abitype.mjs";
// import "/ox@0.6.9/es2022/AbiConstructor.mjs";
// import "/ox@0.6.9/es2022/AbiFunction.mjs";
// import "/ox@0.6.9/es2022/BlockOverrides.mjs";
// import "/viem@2.29.4/es2022/utils.mjs";
// export * from "/viem@2.29.4/es2022/viem.mjs";


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const ethAmountInput = document.getElementById("ethAmount")
const balanceButton = document.getElementById("balanceButton")

let walletClient
let publicClient

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses()
        connectButton.innerHTML = "Connected"

    } else {
        connectButton.innerHTML = "Please install MetaMask!"
    }
}

async function fund(){
    const ethAmount = ethAmountInput.value
    console.log(`Funding with ${ethAmount} ETH`)
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        // console.log(parseEther(ethAmount))
        const {request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: cofeeabi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount)
        })
        const hash = await walletClient.writeContract(request)
        console.log(`Transaction hash: ${hash}`)

    } else {
        connectButton.innerHTML = "Please install MetaMask!"
    }

}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const balance = await publicClient.getBalance({
            address: contractAddress
        })
        console.log(formatEther(balance))

    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
      id: chainId,
      name: "Custom Chain",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["http://localhost:8545"],
        },
      },
    })
    return currentChain
  }

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
