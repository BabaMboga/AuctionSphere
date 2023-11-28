import {Canister, query, update, int64, text, Principal, bool, Record} from 'azle'

// Define global auction item structure

const auctionItem = Record({
    seller: Principal,
    startTime: int64,
    endTime: int64,
    currentBid: int64,
    highestBidder: Principal,
    canceled: bool,
});

// create a map to store auction items
let auctions = new Map<text, typeof auctionItem>();

