import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios, {AxiosInstance} from 'axios';
import {ApiBaseUrl} from '../../../config/api';
import {keyTokenSaveLocalStorage} from '../../../config/app';
import AxiosErrors from './AxiosErrors';

export const config = (authToken = null) => {
  let axios = Axios.create();

  axios.interceptors.request.use(
    config => {
      config.baseURL = ApiBaseUrl;
      if (authToken != null) {
        config.headers = {
          Authorization: `Bearer ${authToken}`,
        };
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    response => response,
    error => Promise.reject(AxiosErrors.handle(error)),
  );

  return axios;
};

export const Request = config(null);

export const RequestAuth = async props => {
  try {
    let authToken = await AsyncStorage.getItem(keyTokenSaveLocalStorage);

    if (authToken == null) {
      props.navigation.reset({
        index: 1,
        routes: [{name: 'LoginScreen'}],
      });

      return Promise.reject({
        message: 'Not Authenticate Token',
        status: -1,
        errors: null,
        data: null,
      });
    }

    return config(authToken);
  } catch (error) {
    return Promise.reject(error);
  }
};
