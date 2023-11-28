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

    endAuction: update([text], Void,(itemId) => {
        const auction = auctions.get(itemId);
        if (auction && !auction.canceled && Date.now() >= auction.endTime ){
            // transfer the highest bid to the seller 
        }
    })
})