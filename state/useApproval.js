import { useEffect, useRef } from "react"
import ERC20ABI from "../abis/ERC20.json"
import { ethers } from "ethers"
import { useState } from "react" 
const BN = n => ethers.BigNumber.from(n)

function useApproval(account, signer, spender, tokenAddress) {
    const Token = tokenAddress ? new ethers.Contract(tokenAddress, ERC20ABI, signer) : null
    const [ allowance, setAllowance] = useState(BN(0))

    function update() {
        if (account && spender) {
            Token.allowance(account, spender).then(setAllowance)
        }
    }

    useEffect(() => {
        update()
        const updateInterval = setInterval(update, 5000)

        return () => {
            clearInterval(updateInterval)
        }
    }, [account])

	function approve(amount) {
		console.log(amount)
		const tx = Token.approve(spender, amount ? amount : BN(2).pow(BN(256).sub(BN(1))))
		tx.then(txResponse => txResponse.wait()).then(update)

		return tx
	}

    return {
		allowance,
		approve
	}
}

export default useApproval