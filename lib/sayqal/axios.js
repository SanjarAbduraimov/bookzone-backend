import Axios from "axios";
import CryptoJS from "crypto-js";
const axios = Axios.create({
  baseURL: "https://routee.sayqal.uz/sms"
})

const userName = process.env.SMS_USERNAME;
const secretKey = process.env.SMS_SECRET_KEY;
const password = process.env.SMS_PASSWORD;
const timestamp = Math.floor(Date.now() / 1000);

const access = `TransmitSMS ${userName} ${secretKey} ${timestamp}`;
const accessToken = CryptoJS.MD5(access).toString();

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers['X-Access-Token'] = accessToken;
  config.headers.Authorization = `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`;

  if (config.method === 'post' || config.method === 'put') {
    // Check if it's a POST or PUT request (modify according to your requirements)
    if (!config.data) {
      // If request body doesn't exist, initialize it as an empty object
      config.data = {};
    }
    // Add properties to the request body
    config.data.utime = timestamp;
    config.data.username = userName;
    // Add more properties as needed
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default axios;