import axios from "axios";
import { t } from "i18next";
import { keysToCamelCase, serializeKeysToSnakeCase } from "neetocist";
import { Toastr } from "neetoui";
import { evolve } from "ramda";

const shouldShowToastr = response =>
  typeof response === "object" && response?.noticeCode;

const showSuccessToastr = response => {
  if (shouldShowToastr(response.data)) Toastr.success(response.data);
};

const showErrorToastr = error => {
  if (error.message === t("error.networkError")) {
    Toastr.error(t("error.noInternetConnection"));
  } else if (error.response?.status !== 404) {
    Toastr.error(error);
  }
};

// what is the use of this ?
// when we are passing data (params) to the axios.get function in the ./product.js/fetch()
// we are passing like this { searchTerm: searchKey } and when it will be converted to the url, it will be "baseUrl/products?searchTerm=mens" but we want the query params to be in snake_case (because the server expects query params to be in snake_case) not in camelCase, thats why we are transforming the keys

// what is data and params ?
// params is the query-parameter object and data is the user data when making a post request
// we are converting both query-parameter object keys and the keys in the data object to snake_case
// Does server expects the keys of the data object to also be in snake_case ?
// Yes — if you're using snake_case everywhere on the server, the server also expects the JSON body keys (data) to be in snake_case.

const requestInterceptors = () => {
  // axios.interceptors.request.use(request =>
  //   evolve(
  //     { data: serializeKeysToSnakeCase, params: serializeKeysToSnakeCase },
  //     request
  //   )
  // );

  // All ramda functions are curried by default. So we don't need to explicitly pass request argument to the evolve function.
  axios.interceptors.request.use(
    evolve({ data: serializeKeysToSnakeCase, params: serializeKeysToSnakeCase })
  );
};

// manual implementaion of keysToCamelCase function of neetocist
// const camelCase = obj => {
//   let res = {};

//   for (let key in obj) {
//     let next = false;
//     let newKey = "";

//     for (let i = 0; i < key.length; i++) {
//       if (next) {
//         newKey += key[i].toUpperCase();
//         next = false;
//       } else if (key[i] === "_") {
//         next = true;
//       } else {
//         newKey += key[i];
//       }
//     }
//     res[newKey] = obj[key]; // store transformed key with original value
//   }

//   return res;
// };

const transformResponseKeysToCamelCase = response => {
  if (response.data) response.data = keysToCamelCase(response.data);
};

const responseInterceptors = () => {
  axios.interceptors.response.use(
    response => {
      transformResponseKeysToCamelCase(response);
      showSuccessToastr(response);

      return response.data;
    },
    error => {
      showErrorToastr(error);

      return Promise.reject(error);
    }
  );
};

const setHttpHeaders = () => {
  axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

export default function initializeAxios() {
  axios.defaults.baseURL =
    "https://smile-cart-backend-staging.neetodeployapp.com/";
  setHttpHeaders();
  responseInterceptors();
  requestInterceptors();
}
