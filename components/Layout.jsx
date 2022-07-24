import { useWallet } from "@gimmixorg/use-wallet"
import { useEffect, useState } from "react";
import project from "../config/project.json"
import classNames from "classnames";
import Link from "next/link"
import networks from "../config/networks.json"
import getWeb3ModalConfig from "../util/web3ModalConfig.js"
import { useRouter } from 'next/router';

const WalletManager = ({ theme }) => {
	const { account, network, connect, disconnect } = useWallet()
	const [buttonText, setButtonText] = useState("Connect Wallet")

	function promptConnect() {
		connect(getWeb3ModalConfig(theme))
	}

	useEffect(() => {
		if (localStorage.WEB3_CONNECT_CACHED_PROVIDER) {
			promptConnect()
		}
	}, [])

	function setText() {
		if (account) {
			setButtonText(`${account.slice(0, 6)}...${account.slice(-4)}`)
		} else {
			setButtonText("Connect")
		}
	}

	useEffect(() => {
		setText()
	}, [account])

	function clickAction() {
		if (account) {
			window.open(`${networks[network.chainId].explorer}/address/${account}`, '_blank');
		} else {
			promptConnect()
		}
	}

	return (
		<>
			<div className={classNames("wallet-container", "row", "small", "button", {
				tertiary: !account,
				secondary: account
			})} onClick={clickAction}>
				{account ? (
					<>
						<div className="network-icon"></div>
					</>
				) : (<></>)}
				<button className="connect small row">{buttonText}</button>

			</div>

			{account ? (
				<>
					<button onClick={disconnect} className="disconnect button small tertiary"><i className="disconnect-icon fa-solid fa-link-slash"></i></button>
				</>
			) : (<></>)}

			<style jsx>{`
				.wallet-container {
					height: 32px;
					gap: 6px;
					border: 2px solid ${Object.keys(networks).includes(network?.chainId.toString()) ? networks[network?.chainId]?.color : "transparent"};
				}

				.network-icon {
					height: 20px;
					width: 20px;
					mask: url(${Object.keys(networks).includes(network?.chainId.toString()) ? `/networks/${networks[network?.chainId].icon}` : "/networks/unknown.svg"});
					background-color: ${Object.keys(networks).includes(network?.chainId.toString()) ? networks[network?.chainId]?.color : "var(--text)"}
				}

				.connect {
					border: none;
					background-color: transparent;
					padding: 0;
				}

				.disconnect {
					height: 32px;
					margin-left: 8px;
					padding: 0 8px !important;
				}

				.disconnect-icon {
					color: var(--white);
					font-size: 1em;
				}

				.wallet-container.tertiary * {
					color: var(--white);
				}

				.wallet-container.secondary * {
					color: var(--text);
				}
			`}</style>
		</>
	)
}

const Header = ({ style, theme, setTheme }) => {
	const router = useRouter()

	return (
		<>
			<div className="header row between" style={style}>
					<div className="logo-name-container row">
						<img className="logo" src="https://gateway.pinata.cloud/ipfs/QmeN4Rfxxof5dhKVaw1xSzJNjENq9YquxJuFej4svf7thL" />
						<div className="name title">Protocol</div>
					</div>

				<div className="page-links row center-a">
					<Link href="/">
						<a className={classNames("page-link", "title", {
							active: router.pathname == "/"
						})}>Launch</a>
					</Link>

					<Link href="/auctions">
						<a className={classNames("page-link", "title", {
							active: router.pathname == "/auctions"
						})}>Auctions</a>
					</Link>

					{/* <Link href="/plot">
						<a className={classNames("page-link", "title", {
							active: router.pathname == "/plot"
						})}>Plot</a>
					</Link> */}
				</div>

				<div className="meta row center-a">
					<WalletManager theme={theme} />
					<button className="theme" onClick={() => {setTheme(theme == "light" ? "dark" : "light")}}><i className="fas fa-moon"></i></button>
				</div>
			</div>

			<style jsx>{`
				.header {
					width: 100%;
					padding: 22px 24px;
					background: var(--bg);
					position: relative;
				}

				.logo-name-container {
					height: 100%;
					gap: 12px;
					height: 32px;
					display: flex;
					align-items: end;
				}

				.logo {
					height: 100%;
				}

				.name {
					font-size: 2.5em;
					font-weight: 600;
					position: relative;
					z-index: 9999;
					color: var(--text);
					text-decoration: none;
				}

				.name:hover {
					text-decoration: none;

				}

				.name::before {
					content: "";
					position: absolute;
					top: 100%;
					width: 100%;
					left: 0;
					height: 2px;
					z-index: -1;
					border-radius: 2px;
					background: linear-gradient(111.3deg, var(--accent) 9.6%, var(--accent-alt) 93.6%);
				}

				.page-links {
					gap: 48px;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				.page-link {
					color: var(--text-gray);
					font-size: 1.05em;
				}

				.page-link.active {
					color: var(--text);
				}

				.theme {
					height: 32px;
					width: 32px;
					margin-left: 6px;
					font-size: 1.2em;
					background-color: transparent
				}
				
				.theme > i {
					color: var(--text);
				}
			`}</style>
		</>
	)
}

const Layout = ({ children, theme, setTheme }) => {
	const { account } = useWallet();
	const [checkpointValid, setCheckpointValid] = useState(false)

	return (
		<>
			<div className="app">
				<Header style={{ gridArea: "1 / 1 / 2 / 2" }} theme={theme} setTheme={setTheme} />
				<div className="main row center-a center-m">
					{children}
				</div>
			</div>


			<style jsx>{`
				.app {
					display: grid;
					grid-template-rows: auto 1fr;
					height: 100vh;
				}

				.main {
					grid-area: 2 / 1 / 3 / 2;
					overflow: hidden;
				}

				@media only screen and (max-width: 550px) {
					.app {
						grid-template-columns: 50px;
					}
				}
			`}</style>
		</>
	)
}

export default Layout