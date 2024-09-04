import * as apiClient from "../helpers/ApiHelpers";

export const checkPasswordOnServerAsync = async (password) => {
  return new Promise((resolve, reject) =>
    apiClient.postHelper('api/authorization/login', { Password: password })
      .then((response) => {
        return resolve({ data: response });
      }).catch((error) => {
        return reject(error);
      }))
}

export const logOutUserAsync = async () => {
  return new Promise((resolve, reject) =>
    apiClient.postHelper('api/authorization/logout')
      .then((response) => {
        console.log("logOutUserAsync response: ", response)
        return resolve({ data: response.text });
      }).catch((error) => {
        return reject(error);
      }))
}

