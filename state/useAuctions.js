import { useEffect, useRef, useState } from "react"
import ERC20ABI from "../abis/ERC20.json"
import { ethers } from "ethers"
import PriceTrackerABI from "../abis/PriceTrackerABI.json"
import networks from "../config/networks.json"
import useApproval from "./useApproval"
import { unparse } from "../util/number.js"
const BN = n => ethers.BigNumber.from(n)


function useAuction(account, signer, network) {
	const DAI = network ? new ethers.Contract(networks[network?.chainId]?.deployments?.dai, ERC20ABI, signer) : null
	const PriceTracker = network ? new ethers.Contract(networks[network?.chainId]?.deployments?.pricetracker, PriceTrackerABI, signer) : null
	const TokenApproval = useApproval(account, signer, PriceTracker?.address, DAI?.address)

	const [ auctionCount, setAuctionCount ] = useState(0)

	function update() {
		if (PriceTracker) {
			PriceTracker.count().then(_auctionCount => {
				setAuctionNumber(_auctionCount)
				for (let i = 0; i < _auctionCount; i++) {
					
				}
			})
		}
	}

	useEffect(() => {
        update()
        const updateInterval = setInterval(update, 5000)

        return () => {
            clearInterval(updateInterval)
        }
    }, [account, network])

	return {
		approval: TokenApproval,
		auctionNumber
	}
}

export default useAuction