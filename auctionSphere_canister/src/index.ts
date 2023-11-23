import {Canister, query, text, update, Principal, Vec, Opt, None, float64,} from 'azle'

type Bid = {
    bidder: Principal;
    amount: float64;
    item: text;
}
//Global variables to store auction state

let currentBid: Opt<Bid> = None;
let auctionEndTime: float64 = 0;
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