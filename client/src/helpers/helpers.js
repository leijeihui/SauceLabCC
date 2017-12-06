import axios from 'axios';

export const helpers = {
  getDataCall: (params, callback) => {
    axios.get('/api/getData', {params: params}).then((obj) => callback(obj));
  }
};

export default helpers;