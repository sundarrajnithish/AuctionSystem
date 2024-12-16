import { getApi, putApi } from "./commonServices";

export const getAuctionItem = (itemId) => {
  return getApi(`/items/item-details?item-id=${itemId}`);
};

export const getAuctionItems = (auctionID) => {
  return getApi(`/items?auction-id=${auctionID}`);
};

export const updateAuctionItem = (itemId, data) => {
  return putApi(`items/item-details?itemId=${itemId}`, data);
};
