import axios from "axios";
import { keysToCamelCase } from "neetocist";

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
  axios.interceptors.response.use(response => {
    transformResponseKeysToCamelCase(response);

    return response.data;
  });
};

const setHttpHeaders = () => {
  axios.defaults.headers = {
    Accept: "application/json", // type of data expected from the server in response
    "Content-Type": "application/json", // type of data we send to the server
  };
};

export default function initializeAxios() {
  axios.defaults.baseURL =
    "https://smile-cart-backend-staging.neetodeployapp.com/";
  setHttpHeaders();
  responseInterceptors();
}
