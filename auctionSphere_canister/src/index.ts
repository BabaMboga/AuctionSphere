import {Canister, query, text, update, Principal, Vec, Opt, None, float64, Void} from 'azle'

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

    // Update functions to modify auction state
    placeBid: update([text, float64], Void, (bidder, amount) => {
        // Validate bid and update auction state if valid
        if (validateBid(bidder, amount)) {
            currentBid = {bidder, amount};
            if (!auctionHistory) {
                auctionHistory = new Vec<Bid>;
            }
            auctionHistory?.push(currentBid);
        }
    }),

    endAuction: update([], Void, () => {
        //end the auction and perform any necessary actions
    }),

    cancelAuction: update([], Void, () => {
        //Cancel the auction if hasnt ended yet
        if (block_timestamp() < auctionEndTime) {
            currentBid = null;
            auctionEndTime = 0;
        }
    }),

    makeBid: update([text, float64], Void, (bidder, amount) => {
        //place a bid and keep updating until it becomes the highest bid
        placeBid(bidder, amount);

        while (block_timestamp() < auctionEndTime) {
            const currentBid = getCurrentBid();
            if (!current || currentBid.amount < amount) {
                placeBid(bidder, amount);
            } else {
                break;
            }
        }
    }),

    extendAuction: update([float64], Void, (newEndTime) => {
        // Extend the auction if it hasn't ended yet
        if (block_timestamp() < auctionEndTime) {
            auctionEndTime = newEndTime;
        }
    }),
})