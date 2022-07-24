pragma solidity ^0.8.15;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract PriceTracker{
    // a simple mechanism to receive a mark to market on illiquid assets
    event newPool(
        uint256 indexed poolId,
        address collectionAddress,
        uint256 nftId
    );
    event newBid(
        uint256 indexed bidAmount,
        address user,
        uint256 indexed bidNum
    );
    event sold(address newOwner, uint256 bidAmount);
    event fundsProvided(uint256 amountProvided); //not implemented
    event auctionCancelled(uint256 Id);

    uint256 count;
    struct Auction {
        address owner;
        address collectionAddress;
        uint256 nftId;
        uint256 startTime;
        uint256 endTime;
        uint256 reward;
        uint256 numOfBids;
        uint256 totalPoints;
    }
    mapping(uint256 => Auction) public auctions;

    struct Bid {
        uint256 bidTime;
        uint256 bidAmount;
        address user;
        uint256 points;
        bool withdrawn;
    }
    mapping(uint256 => mapping(uint256 => Bid)) public bids; //1st arg is for auction #, 2nd is bid #

    IERC20 public Token; //token to denominate all activity
    constructor(address _token) {
        Token = IERC20(_token);
    }

    function launch(address _collectionAddress, uint256 _nftId, uint256 _startTime, uint256 _endTime, uint256 _reward) public {
        require(_startTime >= block.timestamp, "PriceTracker: start time in past");
        require(_endTime > _startTime, "PriceTracker: start after end");
        Token.transferFrom(msg.sender, address(this), _reward);
        auctions[count] = Auction({
            owner: msg.sender,
            collectionAddress: _collectionAddress,
            nftId: _nftId,
            endTime: _endTime,
            startTime: _startTime,
            reward: _reward,
            numOfBids: 0,
            totalPoints: 0	
        });
        bids[count][0] = Bid({
            bidTime: block.timestamp,
            bidAmount: 0,
            user: msg.sender,
            points: 0,
            withdrawn: false
        });
        emit newPool(count, _collectionAddress, _nftId);
        count++;
    }
    
    //cancel if auction hasn't started yet
    function cancel(uint256 _poolId) external {
        require(auctions[_poolId].owner == msg.sender, "PriceTracker: not owner");
        require(auctions[_poolId].startTime < block.timestamp, "PriceTracker: already started");
        delete auctions[_poolId];
        emit auctionCancelled(_poolId);
    }
    function bid(uint256 _poolId, uint256 _amount) external {
        require(auctions[_poolId].startTime <= block.timestamp, "PriceTracker: not started");
        require(auctions[_poolId].endTime > block.timestamp, "PriceTracker: ended");
        uint256 numOfBids = auctions[_poolId].numOfBids + 1;
        auctions[_poolId].numOfBids = numOfBids;
        require(_amount > bids[_poolId][numOfBids-1].bidAmount, "PriceTracker: bid not higher");
        Token.transferFrom(msg.sender, address(this), _amount);
        //record data
        bids[_poolId][numOfBids].bidTime = block.timestamp;
        bids[_poolId][numOfBids].bidAmount = _amount;
        bids[_poolId][numOfBids].user = msg.sender;
        //calculate points for previous bidder
        uint256 durationOfLastBid = block.timestamp - bids[_poolId][numOfBids-1].bidTime;
        uint256 points = durationOfLastBid * bids[_poolId][numOfBids-1].bidAmount;
        bids[_poolId][numOfBids-1].points = points;
        auctions[_poolId].totalPoints += points;
        emit newBid(_amount, msg.sender, numOfBids);
    }
    /*
    function exit(uint256 _poolId, uint256 _bidNum) external {
        withdrawBid(_poolId, _bidNum);
        claimReward(_poolId, _bidNum);
    }*/
    function withdrawBid(uint256 _poolId, uint256 _bidNum) external {
        require(bids[_poolId][_bidNum].user == msg.sender, "PriceTracker: not the bidder");
        if(bids[_poolId][_bidNum+1].user == address(0)){
            //you are the highest bidder, can only withdraw if owner does not accept bid 24 hrs after deadline
            require(auctions[_poolId].endTime + 24 hours <= block.timestamp, "PriceTracker: you are the highest bidder!");
        }
        require(!bids[_poolId][_bidNum].withdrawn, "PriceTracker: already withdrawn");
        uint256 bidAmount = bids[_poolId][_bidNum].bidAmount;
        bids[_poolId][_bidNum].withdrawn = true;
        Token.transfer(msg.sender, bidAmount);
    }
    function claimReward(uint256 _poolId, uint256 _bidNum) external {
        require(bids[_poolId][_bidNum].user == msg.sender, "PriceTracker: not the bidder");
        if(!_isFinalized(_poolId)){
            _finalize(_poolId);
        }
        uint256 points = bids[_poolId][_bidNum].points;
        require(points != 0, "PriceTracker: already claimed");
        uint256 totalReward = auctions[_poolId].reward;
        uint256 totalPoints = auctions[_poolId].totalPoints;
        //calculate reward
        uint256 reward = totalReward*points/totalPoints;
        bids[_poolId][_bidNum].points = 0;
        auctions[_poolId].totalPoints -= points;
        Token.transfer(msg.sender, reward);
    }
    //trigger the last bid standing if the owner decides to
    function sellNFT(uint256 _poolId) external {
        require(auctions[_poolId].owner == msg.sender, "PriceTracker: not owner");
        require(auctions[_poolId].endTime + 24 hours > block.timestamp, "PriceTracker: offer expired");
        uint256 numOfBids = auctions[_poolId].numOfBids;
        require(!bids[_poolId][numOfBids].withdrawn, "PriceTracker: offer already previously accepted");
        //transfer NFT
        IERC721 NFT = IERC721(auctions[_poolId].collectionAddress);
        address newOwner = bids[_poolId][numOfBids].user;
        NFT.safeTransferFrom(msg.sender, newOwner, auctions[_poolId].nftId);
        //withdraw token
        uint256 bidAmount = bids[_poolId][numOfBids].bidAmount;
        bids[_poolId][numOfBids].withdrawn = true;
        Token.transfer(msg.sender, bidAmount);
        emit sold(newOwner, bidAmount);
    }

    //checks if the last bidder has points (aka has finalized been called)
    function _isFinalized(uint256 _poolId) internal view returns (bool){
        uint256 numOfBids = auctions[_poolId].numOfBids;
        return (bids[_poolId][numOfBids].points != 0);
    }
    function _finalize(uint256 _poolId) internal {
        uint256 endTime = auctions[_poolId].endTime;
        require(endTime <= block.timestamp, "PriceTracker: auction not ended");
        uint256 numOfBids = auctions[_poolId].numOfBids;
        //calculate points for last bidder
        uint256 durationOfLastBid = endTime - bids[_poolId][numOfBids].bidTime;
        uint256 points = durationOfLastBid * bids[_poolId][numOfBids].bidAmount;
        bids[_poolId][numOfBids].points = points;
        auctions[_poolId].totalPoints += points;
    }
}