import axios from 'axios';

var baseUrlGo;
var baseUrlNode;

switch (environment) {
case "dev":
  baseUrlGo = 'http://localhost:8080';
  baseUrlNode = 'http://localhost:3000';
  break;
case "production":
  baseUrlGo = 'https://www.kindredchat.io:443';
  baseUrlNode = 'https://www.kindredchat.io:3000';
  break;
default:
  baseUrlGo = 'http://localhost:8080';
  baseUrlNode = 'http://localhost:3000';
  break;
}

var instance = {
  goInstance: axios.create({
    baseURL: baseUrlGo
  }),
  nodeInstance: axios.create({
    baseURL: baseUrlNode
  })
};

export default instance;