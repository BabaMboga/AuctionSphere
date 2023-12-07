import {
  $query,
  $update,
  Record,
  StableBTreeMap,
  match,
  Result,
  nat64,
  ic,
  Opt,
  Principal,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// Define global auction item structure
type AuctionItem = Record<{
  itemId: string;
  itemName: string;
  seller: Principal;
  startTime: nat64;
  endTime: nat64;
  currentBid: nat64;
  highestBidder: Opt<Principal>;
  reservedPrice: nat64;
  canceled: boolean;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

type AuctionItemPayload = Record<{
  itemName: string;
  startTime: nat64;
  endTime: nat64;
  currentBid: nat64;
  highestBidder: Opt<Principal>;
  reservedPrice: nat64;
}>;

// create a map to store auction items
const auctions = new StableBTreeMap<string, AuctionItem>(0, 44, 1024);

$update;
export function createAuction(payload: AuctionItemPayload): Result<AuctionItem, string> {
  try {
    // Payload Validation
    if (!payload.itemName || !payload.startTime || !payload.endTime || !payload.currentBid || !payload.reservedPrice) {
      throw new Error("Invalid payload. Missing required fields.");
    }

    const auctionItem: AuctionItem = {
      itemId: uuidv4(),
      seller: ic.caller(),
      canceled: false,
      createdAt: ic.time(),
      updatedAt: Opt.None,
      // Explicit Property Setting
      itemName: payload.itemName,
      startTime: payload.startTime,
      endTime: payload.endTime,
      currentBid: payload.currentBid,
      highestBidder: payload.highestBidder,
      reservedPrice: payload.reservedPrice,
    };

    auctions.insert(auctionItem.itemId, auctionItem);

    return Result.Ok<AuctionItem, string>(auctionItem);
  } catch (error: any) {
    return Result.Err<AuctionItem, string>(`Failed to create an auction: ${error}`);
  }
}

$update;
export function placeBid(itemId: string, bidAmount: nat64, caller: Principal): Result<AuctionItem, string> {
  try {
    // ID Validation
    if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
      throw new Error("Invalid itemId. Must be a non-empty string.");
    }

    // Payload Validation
    if (!bidAmount || bidAmount <= BigInt(0)) {
      throw new Error("Invalid bidAmount. Must be a positive integer.");
    }

    const verifiedCaller = ic.caller();
    return match(auctions.get(itemId), {
      Some: (auction) => {
        if (
          verifiedCaller.toText() === caller.toText() &&
          !auction.canceled &&
          Date.now() / 1000 < auction.endTime &&
          bidAmount > auction.currentBid &&
          bidAmount >= auction.reservedPrice
        ) {
          auction.currentBid = bidAmount;
          auction.highestBidder = Opt.Some<Principal>(caller); // Wrap caller in Some
          auctions.insert(itemId, auction);
          return Result.Ok<AuctionItem, string>(auction);
        } else {
          return Result.Err<AuctionItem, string>("Bid conditions not met.");
        }
      },
      None: () => Result.Err<AuctionItem, string>("Auction not found."),
    });
  } catch (error: any) {
    return Result.Err<AuctionItem, string>(`Failed to place a bid: ${error}`);
  }
}

$update;
export function endAuction(itemId: string): Result<AuctionItem, string> {
  try {
    // ID Validation
    if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
      throw new Error("Invalid itemId. Must be a non-empty string.");
    }

    return match(auctions.get(itemId), {
      Some: (auction) => {
        if (!auction.canceled && Date.now() >= auction.endTime) {
          if (auction.currentBid >= auction.reservedPrice) {
            // Set the auction as ended
            auction.canceled = true;
            auction.updatedAt = Opt.Some(ic.time());
            auctions.insert(itemId, auction);
            return Result.Ok<AuctionItem, string>(auction);
          } else {
            // Handle auction not meeting reserve price
            auction.canceled = true;
            auction.updatedAt = Opt.Some(ic.time());
            auctions.insert(itemId, auction);
            return Result.Ok<AuctionItem, string>(auction);
          }
        } else {
          return Result.Err<AuctionItem, string>("Auction not found or not yet ended");
        }
      },
      None: () => Result.Err<AuctionItem, string>("Auction not found"),
    });
  } catch (error: any) {
    return Result.Err<AuctionItem, string>(`Failed to end the auction: ${error}`);
  }
}

// Get the current block timestamp
$query
export function blockTimeStamp(): nat64 {
  return BigInt(Date.now());
}

// Get the current bid for an item
$query
export function getCurrentBid(itemId: string): nat64 {
  // ID Validation
  if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
    throw new Error("Invalid itemId. Must be a non-empty string.");
  }

  return match(auctions.get(itemId), {
    Some: (auction) => auction.currentBid,
    None: () => BigInt(0),
  });
}

// Function to get the end time of an auction
$query
export function getAuctionEndTime(itemId: string): nat64 {
  // ID Validation
  if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
    throw new Error("Invalid itemId. Must be a non-empty string.");
  }

  return match(auctions.get(itemId), {
    Some: (auction) => auction.endTime,
    None: () => BigInt(0),
  });
}


// Function to cancel the auction
$update
export function cancelAuction(itemId: string): Result<AuctionItem, string> {
  // ID Validation
  if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
    throw new Error("Invalid itemId. Must be a non-empty string.");
  }

  const auctionOpt = auctions.get(itemId);
  return match(auctionOpt, {
    Some: (auction) => {
      auction.canceled = true;
      auctions.insert(itemId, auction);
      return Result.Ok<AuctionItem, string>(auction);
    },
    None: () => Result.Err<AuctionItem, string>("Auction not found"),
  });
}

// Function to extend the auction
$update
export function extendAuction(itemId: string, newEndTime: nat64): Result<AuctionItem, string> {
  // ID Validation
  if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
    throw new Error("Invalid itemId. Must be a non-empty string.");
  }

  const auctionOpt = auctions.get(itemId);
  return match(auctionOpt, {
    Some: (auction) => {
      if (!auction.canceled && Date.now() < auction.endTime) {
        auction.endTime = newEndTime;
        auctions.insert(itemId, auction);
        return Result.Ok<AuctionItem, string>(auction);
      } else {
        return Result.Err<AuctionItem, string>("Auction not canceled, or already ended");
      }
    },
    None: () => Result.Err<AuctionItem, string>("Auction not found"),
  });
}

// Define the searchAuctionItem function
$query
export function searchAuctionItem(itemId: string): Result<AuctionItem, string> {
  // ID Validation
  if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
    throw new Error("Invalid itemId. Must be a non-empty string.");
  }

  return match(auctions.get(itemId), {
    Some: (auction) => Result.Ok<AuctionItem, string>(auction),
    None: () => Result.Err<AuctionItem, string>("Auction item not found"),
  });
}



globalThis.crypto = {
  //@ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
