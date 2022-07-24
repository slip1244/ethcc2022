import WalletConnectProvider from "@walletconnect/web3-provider";

const web3ModalConfig = (theme) => ({
	network: "mainnet",
	cacheProvider: true,
	theme: theme,
	providerOptions: {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				infuraId: "9aa3d95b3bc440fa88ea12eaa4456161"
			}
		}
	}
})

export default web3ModalConfig