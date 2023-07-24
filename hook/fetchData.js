import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_TIME = 24 * 60 * 60 * 1000; // Cache data for 1 minute (adjust as needed)

const fetchData = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: 'GET',
    url: `https://travel-advisor.p.rapidapi.com/${endpoint}`,
    params: {
      ...query,
    },
    headers: {
      'X-RapidAPI-Key': '06acbbd301mshd0a4084798337cep1b04cajsn0fe56a1fe9cd',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
    },
  };

  const fetch = async () => {
    setisLoading(true);
    try {

      const cachedData = await AsyncStorage.getItem(endpoint);
      if (cachedData !== null) {
        const { timestamp, data: cachedDataValue } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_TIME) {
          setData(cachedDataValue);
          setisLoading(false);
          return;
        }
      }

      const response = await axios.request(options);
      setData(response.data.data);


      const cacheData = {
        timestamp: Date.now(),
        data: response.data.data,
      };
      await AsyncStorage.setItem(endpoint, JSON.stringify(cacheData));
      setError(null);
    } catch (error) {
      setError(error);
      alert(error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const refetch = () => {
    setisLoading(true);
    fetch();
  };

  return { data, isLoading, error, refetch };
};

export default fetchData;
