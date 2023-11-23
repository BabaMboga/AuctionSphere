import {Canister, query, text, update, nat64, Principal, Vec, Opt, None,} from 'azle'

type Bid = {
    bidder: Principal;
    amount: nat64;
    item: text;
}
//Global variables to store auction state

let currentBid: Opt<Bid> = None;
let auctionEndTime: nat64 = 0;
let auctionHistory: Vec<Bid> | null = null;

export default Canister({
    // Query functions to retrieve auction state
    getCurrentBid: query([], text, () => {
        if (currentBid) {
            return JSON.stringify(currentBid);
        
        } else {
            return '';
        }
    }),

    getAuctionEndTime: query([], text, () => {
        return auctionEndTime.toString();
    }),
})