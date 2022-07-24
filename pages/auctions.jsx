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
			<div className="auction-list row">
				
			</div>
			<div className="auction-container card col between">

			</div>
			
			<style jsx>{`
				
			`}</style>
		</>
	)
}

export default Auctions