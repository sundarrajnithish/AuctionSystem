import { getApi, postApi } from "./commonServices";

export const postAuctionFormData = (data) => {
  return postApi("/", data);
};

export const enhanceDescriptionWithAI = (desc) => {
  return getApi(`/items/AI?keywords=${encodeURIComponent(desc)}&type=1`);
};
