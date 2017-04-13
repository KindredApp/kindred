import axios from 'axios';

var instance = {
  goInstance: axios.create({
    baseURL: 'http://localhost:8080'
  }),
  nodeInstance: axios.create({
    baseURL: 'http://localhost:3000'
  })
}

export default instance;