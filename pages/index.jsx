import { useWallet } from "@gimmixorg/use-wallet"
import { ethers } from "ethers"
import Link from "next/link"
import { useEffect, useRef } from "react"
import style from "../config/style.json"
import project from "../config/project.json"
import { format, parse } from "../util/number.js"
import classNames from "classnames"

const BN = n => ethers.BigNumber.from(n)

const Landing = ({ theme }) => {
	const { account, provider } = useWallet()

	return (
		<>
			<div>lan protocol</div>
			
			<style jsx>{`
				
			`}</style>
		</>
	)
}

export default Landing