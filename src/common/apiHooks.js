import { useEffect, useState } from "react";
import { apiCallGet } from "./api";
import _ from "lodash";
let categoriesCache = [];

export const useCategories = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (_.head(categoriesCache)) {
        setData(categoriesCache);
      } else {
        const categoriesInfo = await apiCallGet("/getmerchantcategorylist");
        const apiData = categoriesInfo && categoriesInfo.results;
        categoriesCache = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return data;
};

let allCategoriesCache = [];

export const useAllCategories = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (_.head(allCategoriesCache)) {
        setData(allCategoriesCache);
      } else {
        const categoriesInfo = await apiCallGet("/getcategorylist");
        const apiData = categoriesInfo && categoriesInfo.results;
        allCategoriesCache = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return data;
};

let programsCache = [];
export const usePrograms = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchPrograms = async () => {
      if (_.head(programsCache)) {
        setData(programsCache);
      } else {
        const programsInfo = await apiCallGet("/getprogramlist");
        const apiData = programsInfo && programsInfo.results;
        programsCache = apiData;
        setData(programsCache);
      }
    };
    fetchPrograms();
  }, []);
  return data;
};

let merchantTimeZone = [];
export const useMerchantTimeZone = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (_.head(merchantTimeZone)) {
        setData(merchantTimeZone);
      } else {
        const adminTimezoneInfo = await apiCallGet("/gettimezonelist");
        const apiData = adminTimezoneInfo && adminTimezoneInfo.results;
        merchantTimeZone = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return data;
};

let merchantLocations = [];
export const useMerchantLocations = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (_.head(merchantLocations)) {
        setData(merchantLocations);
      } else {
        const locationsInfo = await apiCallGet("/getmerchantlocationlist");
        const apiData = locationsInfo && locationsInfo.results;
        merchantLocations = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return data;
};

let nationalsList = [];
export const useNationals = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (_.head(nationalsList)) {
        setData(nationalsList);
      } else {
        const nationalsInfo = await apiCallGet("/getnationallist");
        const apiData = nationalsInfo && nationalsInfo.results;
        nationalsList = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return data;
};

let languagesList = [];
export const useLanguages = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (_.head(languagesList)) {
        setData(languagesList);
      } else {
        const languageInfo = await apiCallGet("/getlanguagelist");
        const apiData = languageInfo && languageInfo.results;
        languagesList = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return data;
};

let merchantProfile = {};
export const useMerchantProfile = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      if (merchantProfile && Object.keys(merchantProfile).length > 0) {
        setData(merchantProfile);
      } else {
        const response = await apiCallGet("/getmerchantprofile");
        const apiData = response && response.results;
        merchantProfile = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return [data, setData];
};

let taxList = [];
export const useTaxList = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (taxList && Object.keys(taxList).length > 0) {
        setData(taxList);
      } else {
        const response = await apiCallGet("/gettaxlist");
        const apiData = response && response.results;
        taxList = apiData;
        setData(apiData);
      }
    };
    fetchData();
  }, []);
  return data;
};

let adminPrice;
export const useAppSettings = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (adminPrice) {
        setData(adminPrice);
      } else {
        const response = await apiCallGet("/getappsettingslist");
        const apiData = response && response.results;
        let deal_price = 1;
        if (apiData && Array.isArray(apiData)) {
          const dealPrice = apiData.find(
            (item) => item.code === "deal_price_per_day"
          );
          if (dealPrice?.value) deal_price = Number(dealPrice.value);
        }
        adminPrice = deal_price;
        setData(deal_price);
      }
    };
    fetchData();
  }, []);
  return data;
};
