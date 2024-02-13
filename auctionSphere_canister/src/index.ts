import { Canister, Principal, bool, int64, text, update, ic, query } from "azle"

// global auction item structure
type AuctionItem = {
    itemId: text;
    itemName: text;
    description: text;
    image: text;
    startTime: int64;
    highestBid: int64;
    highestBidder: Principal;
    canceled: bool;
};

export default Canister({
    // Map to store auction items
    let auctionItems = new Map<text, AuctionItem>();

    // Function to create a new auction
    createAuction: update([text, text, text, text, int64, int64, int64], Void, (itemId, itemName, description, image, startTime, endTime, startingPrice) => {
        auctionItems.set(itemId, {
            itemId: itemId,
            itemName: itemName,
            description: description,
            image: image,
            startTime: startTime,
            endTime: endTime,
            startingPrice: startingPrice,
            highestBid: startingPrice,
            higestBidder: ic.nothing<Principal>(),
            canceled: false,
        });

    }),

    //Function to place a bid on an auction
    placeBid: update([text, int64], Void, aysnc (itemId, bidAmount) => {
        const verifiedCaller = await.ic.caller();
        const auctionItem = auctionItems.get(itemId);

        if(!auctionItem) {
            throw new Error ("Auction item not found");
        }

        const currentTime = Date.now() / 1000;
        it (auctionItem.canceled || currentTime < auctionItem.startTime || currentTime >= actionItem.endTime) {
            throw new Error("Invalid bidding period");
        }

        if (bidAmount <= auctionItem.highestBid) {
            throw new Error("Bid amount must be higher than the current highest bid");

        }

        auctionItem.highestBid = bidAmount;
        auctionItem.highestBidder = verifiedCaller;

        auctionItems.set(itemId, auctionItem);

    }),
    // Fucntion to end an auction
    endAuction: update([text], Void, (itemId) => {
        const auctionItem = auctionItems.get(itemId);

        if (!auctionItem){
            throw new Error("Auction item not found");

        }

        const currentTime = Date.now() / 1000;

        if (auctionItem.canceled || currentTime < auctionItem.endTime) {
            throw new Error("Auction period not ended");
        }
    }),

    // Function to cancel an auction
    cancelAuction: update([text], Void, (itemId) => {
        const auctionItem = auctionItems.get(itemId);

        if (auctionItem) {
            auctionItem.canceled = true;
            auctionItems.set(itemId, auctionItem);
        } else {
            throw new Error("Auction item not found");
        }
    }),

    //Query to get the details of an auction item
    getAuctionDetails: query([text], Result<AuctionItem, text>, (itemId) => {
        const auctionItem = auctionItems.get(itemId);

        if (auctionItem) {
            return auctionItem;

        } else {
            reutrn ic.err("Auction item not found");
        }
    }),

    // Query to check if an auction item is canceled
    isAuctionCanceled: query([text], Result<bool, tex>, (itemId) => {
        const auctionItem = auctionItems.get(itemId);

        if(auctionItem) {
            return auctionItem.canceled;
        } else {
            return ic.err("Auction item not found");
        }
    }),
});