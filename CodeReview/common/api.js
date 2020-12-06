import axios from "axios";
import { showErrorToast, showSuccessToast } from "./toaster";

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      showErrorToast(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export const apiCallPost = async (url, data = {}, showToast = false) => {
  return await axios
    .post(`${backendUrl}${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => {
      if (showToast)
        res.data && res.data.success
          ? showSuccessToast((res.data && res.data.message) || "Success")
          : showErrorToast((res.data && res.data.message) || "Failed");
      return res.data;
    })
    .catch((error) => {
      showToast && showErrorToast((error && error.message) || "Failed");
      return error;
    });
};

export const apiCallPatch = async (url, data, showToast = false) => {
  return await axios
    .patch(`${backendUrl}${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => {
      showToast &&
        showSuccessToast((res.data && res.data.message) || "Success");
      return res.data;
    })
    .catch((error) => {
      showToast && showErrorToast((error && error.message) || "Failed");
      return error;
    });
};

export const apiCallGet = async (url, showToast = false) => {
  return await axios
    .get(`${backendUrl}${url}`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then((res) => {
      showToast &&
        showSuccessToast((res.data && res.data.message) || "Success");
      return res.data;
    })
    .catch((error) => {
      showToast && showErrorToast((error && error.message) || "Failed");
      return error;
    });
};

export const apiCallUploadFile = async (url, data, showToast = false) => {
  return await axios
    .post(`${backendUrl}${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      showToast &&
        showSuccessToast((res.data && res.data.message) || "Success");
      return res.data;
    })
    .catch((error) => {
      showToast && showErrorToast((error && error.message) || "Failed");
      return error;
    });
};

export const apiCallPatchFile = async (url, data, showToast = false) => {
  return await axios
    .patch(`${backendUrl}${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      showToast &&
        showSuccessToast((res.data && res.data.message) || "Success");
      return res.data;
    })
    .catch((error) => {
      showToast && showErrorToast((error && error.message) || "Failed");
      return error;
    });
};

export const apiCallDelete = async (url, showToast = false) => {
  return await axios
    .delete(`${backendUrl}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => {
      if (showToast)
        res.data && res.data.success
          ? showSuccessToast((res.data && res.data.message) || "Success")
          : showErrorToast((res.data && res.data.message) || "Failed");
      return res.data;
    })
    .catch((error) => {
      showToast && showErrorToast((error && error.message) || "Failed");
      return error;
    });
};
