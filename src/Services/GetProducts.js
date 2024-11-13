import { getApi } from "./CommonServices";

export function getProducts() {
  return getApi("products");
}
