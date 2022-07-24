import { useEffect, useRef, useState } from "react"
import ERC20ABI from "../abis/ERC20.json"
import { ethers } from "ethers"
import PriceTrackerABI from "../abis/PriceTrackerABI.json"
import networks from "../config/networks.json"
import useApproval from "./useApproval"
import { unparse } from "../util/number.js"
const BN = n => ethers.BigNumber.from(n)


function useLaunch(account, signer, network, range, reward, collectionAddress, tokenId) {
	const DAI = network ? new ethers.Contract(networks[network?.chainId]?.deployments?.dai, ERC20ABI, signer) : null
	const PriceTracker = network ? new ethers.Contract(networks[network?.chainId]?.deployments?.pricetracker, PriceTrackerABI, signer) : null
	const TokenApproval = useApproval(account, signer, PriceTracker?.address, DAI?.address)


	const [ auctionNumber, setAuctionNumber ] = useState(0)

	function update() {
		if (PriceTracker) {
			PriceTracker.count().then(setAuctionNumber)
		}
	}

	useEffect(() => {
        update()
        const updateInterval = setInterval(update, 5000)

        return () => {
            clearInterval(updateInterval)
        }
    }, [account, network])

	function launch() {
		PriceTracker.launch(collectionAddress, tokenId, range[0].getTime() / 1000, range[1].getTime() / 1000, unparse(reward, 18))
	}

	return {
		approval: TokenApproval,
		launch,
		auctionNumber
	}
}

export default useLaunch