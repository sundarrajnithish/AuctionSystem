import { getApi } from "./CommonServices";

export const getProducts = () => {
  return getApi("products");
};

export const getProductById = (data) => {
  return getApi(`products/${data.id}`);
};

export const getCategory = () => {
  return getApi("products/categories");
};

export const filterProdcut = (filter) => {
  if (filter.category != "All")
    return getApi(`products/category/${filter.category}?sort=${filter.sort}`);
  else return getProducts();
};
