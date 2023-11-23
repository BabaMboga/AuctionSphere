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

    // function to get the current bid made
    getCurrentBid: query([], text, () => {
        if (currentBid) {
            return JSON.stringify(currentBid);
        
        } else {
            return '';
        }
    }),

    // function to get the auction end time
    getAuctionEndTime: query([], text, () => {
        return auctionEndTime.toString();
    }),

    // function to get the auction history
    getAuctionHistory: query([], text, () => {
        try {
            return JSON.stringify(auctionHistory);
        } catch (error) {
            console.error('Error getting auction history:', error);
            return '';
        }
    }),
})