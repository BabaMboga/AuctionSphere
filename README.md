# AuctionSphere

AuctionSphere is a decentralized auction platform implemented in Azle, allowing users to participate in auctions for various items. The system ensures secure and transparent bidding processes, with features such as bid placement, auction creation, cancellation and more.

## Features

1. User-friendly Interface: The system provides an intuitive and user-friendly interface, simplifying the process of participating in auctions and managing bids.

2. Real-time Updates: Experience real-time updates on auction status, bid amounts and other relevant information, ensuring participants are well-informed throughout the auction duration.

3. Secure Transaction Handling: AuctionSphere ensures secure transaction handling by implementing robust authorization mechanism. Users can only access and modify auctions they are authorized to interact with,ensuring data integrity and privacy.

4. Search Functionality: Quickly locate auctions by searching throug item names, current Bid, or other relevant details, enhancing the overall user experience.

5. Bid Placement: Users can place bids on items, with the system validating bid amounts and ensuring fair competition among participants.

6. Auction Management: The system automatically concludes auctions at their specified end times or extend the auction duration, handling the transfer of the highest bid to the seller or appropriately cancelling the auction if the reserve price is not met.

7. Detailed Auction Information: Access comprehensive details about each auction, icnluding item descriptions, current bids and seller information, provind a transparent and informative biddign experience.

8. Automated Bid History: View a detailed history of bids placed on each item,priving transparency and facilitating strategic bidding decisions.

9. Cancellation Safeguards: In the event of unforseen circumstances, sellers can cancel auctions with appropriate safeguards, ensuring a fair and reliable auction platform.

##Usage Description

To use the Azle AuctionSphere, you need to have an Azle(DFINITY) account. Here's how to get started:

- `placeBid(itemId: text, bidAmount: int64, caller: Principal): Void` : Allows users to place bids on auction items. Verifies the caller's identity and checks if the bid is valid before updating the auction details.

- `endAuction(itemId: text): Void` : Concludes a specific auction, transferring the highest bid to the seller if the reserve price is met. Handles scenarios where the seserve pricee is not reached, canceling the auction.

- `blockTimeStamp(): int64` : Returns the current block timestamp, providing a reference for the timing of various auction-related operations.

- `getCurrentBid(itemId: text): int64` : Retrieves the current highest bid for a given auction item.

- `getAuctionEndTime(itemId: text): int64` : Fetches the end time of a specific auction.

- `cancelAuction(itemId: text): Void` : Allows the seller to cancel an auction, updating the auction status accordingly.

- `extendAuction(itemId: text, newEndTime: int64): Void` : Extends the duraiton of an auction if certain conditions are met, providing flexibility in managing auction timelines.

- `searchAuctionItem(itemId: text): auctionItem` : Searces for a specific auction item using its unique itemId. It Returns the details of the auction item, including the current bid, seller and auction status

- `createAuction(itemId: text, itemName: text, startTime: int64, endTime: int64, startingBid: int64, reservedPrice: int64, caller: Principal) : Void` : Enables the creation of new auctions with specified parameters, initializing the auction structure and making it available for bidding.

## Installation

You can run your Azle AuctionSphere in your Azle environment or a development environment.

    1. Environment Setup: Ensure you have an Azle environment set up and running.

    2. Deployment: Deploy the Auctionsphere caister to your Azle environment.

    3. Configuration: Update your system confgurations as needed.

    4. Use the system: Access the system via a web browser and start managing your tasks.

## Run Locally

`dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:

`npm run dfx_install`

Next you will want to start a replica, which is a local instance of the IC that you can deploy your cannisters to:

`dfx start --background`

If you ever want to stop the replica:

`dfx stop`

Now you can deploy your canister locally:

`npm install`
`dfx deploy`

## Contributing 

We welcome contributions from the community to enhance the Azle Task Management System. If you want to contribute, please follow these steps:

    1. Fork te repository to your own account.
    2. Create a new branch for your feature or bug fix.
    3. Make your changes and ensure all tests pass.
    4. Submit a pull request for review.

Thaank you for considering contributing to our project. Your contributions help make this system better for everyone.

## License

This projecr is licensed under the GNU License. Feel free to use, modify and distribute the code as per the terms of the license. Contributions are welcome! See `LICENSE` for more information.