import {Canister, query, update, int64, text, Principal, bool, Void,ic} from 'azle'

// Define global auction item structure

type auctionItem = {
    itemId: text,
    itemName: text,
    seller: Principal,
    startTime: int64,
    endTime: int64,
    currentBid: int64,
    highestBidder: Principal,
    canceled: bool,
};

// create a map to store auction items
let auctions = new Map<text, auctionItem>();

export default Canister({
    // function to place a bid on an item
    placeBid: update([text, int64], async (itemId, bidAmount, caller) => {
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
    blockTimeStamp: query([], Void, () => {
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

    cancelAuction: update([text], Void, (itemId) => {
        const auction = auctions.get(itemId);
        if (auction) {
            auction.canceled = true;
            auctions.set(itemId, auction);
        }
    }),
    
    extendAuction: update([text, int64], Void, (itemId, newEndTime) => {
        const auction = auctions.get(itemId);
        if (auction && !auction.canceled && Date.now() < auction.endTime) {
            auction.endTime = newEndTime;
            auctions.set(itemId, auction);

        }
    }),

    createAuction: update([text,int64], Void, (itemId, startTime,endTime, startingBid, caller) => {
        auctions.set(itemId, {
            seller: caller,
            startTime: startTime,
            endTime: endTime,
            currentBid: startingBid,
            highestBidder: Principal.fromText(''),
            canceled: false
        });
    })
})