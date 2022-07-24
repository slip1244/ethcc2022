import { useWallet } from "@gimmixorg/use-wallet"
import { ethers } from "ethers"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import style from "../config/style.json"
import project from "../config/project.json"
import { format, parse } from "../util/number.js"
import classNames from "classnames"



const BN = n => ethers.BigNumber.from(n)

const Auctions = ({ theme }) => {
	const { account, provider } = useWallet()
	const [startDate, setStartDate] = useState(new Date());

	return (
		<>
			<div className="launch-container card col between">
			</div>
			
			<style jsx>{`
				.launch-container {
					height: 550px;
					width: 400px;
					padding: 25px 25px;
				}

				.launch-header {
					font-size: 1.5em;
					font-weight: bold;
					color: var(--text);
					text-align: center;
					margin-top: 5px;
				}

				.label {
					margin: 0px 0px 10px;
					color: var(--text);
					font-size: 1.2em;
				}

				.reset {
					color: unset;
				}

				.launch-button {
					font-size: 2em;
					height: 50px;
				}

				.input {
					width: 100%;
					border: 1px solid var(--border-color);
					border-radius: var(--border-radius);
					font-size: 1.3em;
					padding: 8px 10px;
					color: var(--text);
				}
			`}</style>
		</>
	)
}

export default Auctions