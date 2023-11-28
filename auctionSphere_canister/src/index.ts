import {Canister, query, update, int64, text, Principal, bool, Record, Void,ic} from 'azle'

// Define global auction item structure

const auctionItem = Record({
    itemId: text,
    seller: Principal,
    startTime: int64,
    endTime: int64,
    currentBid: int64,
    highestBidder: Principal,
    canceled: bool,
});

// create a map to store auction items
let auctions = new Map<text, typeof auctionItem>();

export default Canister({
    // function to place a bid on an item
    placeBid: update([text, int64], Void, async (itemId, bidAmount, caller) => {
        const verifiedCaller = await ic.caller();
        if (verifiedCaller.toText() === caller.toText()) {
            const auction = auctions.get(itemId);
            if (auction && !auction.canceled && Date.now() / 1000 < auction.endTime && bidAmount > auction.currentBid) {
                auction.currentBid = bidAmount;
                auction.highestBidder = caller;
                auctions.set(itemId, auction);
            }
        }
    }),

    // function that ends a particular auction for an item 
    endAuction: update([text], Void,(itemId) => {
        const auction = auctions.get(itemId);
        if (auction && !auction.canceled && Date.now() >= auction.endTime ){
            // transfer the highest bid to the seller 
        }
    }),

    // get the current block time stamp 
    blockTimeStamp: query([], Time, () => {
        return Date.now();
    }),

    //get the current bid for an item
    getCurrentBid: query([text], int64, (itemId) => {
        const auction = auctions.get(itemId);
        return auction ? auction.currentBid : 0;
    }),

    // function to get the endtime of an auction 
    getAuctionEndTime: query([text], int64, (itemId) => {
        const auction = auctions.get(itemId);
        return auction? auction.endTime : 0;
    }),
})