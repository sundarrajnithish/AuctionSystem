import axios from "axios";

const baseAPI = "https://fakestoreapi.com/";

const headers = () => {
  return {
    "Content-Type": "application/json",
  };
};

export async function getApi(endUrl, params) {
  return await axios({
    method: "GET",
    url: baseAPI + endUrl,
    params: params,
    headers: headers(),
  });
}

export async function postApi(endUrl, data) {
  return await axios({
    method: "POST",
    url: baseAPI + endUrl,
    data: data,
    headers: headers(),
  });
}

export async function putApi(endUrl, data) {
  return await axios({
    method: "PUT",
    url: baseAPI + endUrl,
    data: data,
    headers: headers(),
  });
}

export async function deleteApi(endUrl, params) {
  return await axios({
    method: "DELETE",
    url: baseAPI + endUrl,
    params: params,
    headers: headers(),
  });
}
