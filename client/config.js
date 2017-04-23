import axios from 'axios';

var instance = {
  goInstance: axios.create({
    //use commented for production build
    // baseURL: 'https://www.kindredchat.io:443'
    baseURL: 'http://localhost:8080'
  }),
  nodeInstance: axios.create({
    //use commented for production build
    // baseURL: 'https://www.kindredchat.io:3000'
    baseURL: 'http://localhost:3000'
  })
};

export default instance;