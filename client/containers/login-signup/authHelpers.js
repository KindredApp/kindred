import Cookies from 'js-cookie';
import instance from '../../config.js';

function checkVisits() {
  let cookie = Cookies.getJSON();
  for (let key in cookie) {
    if (key !== 'pnctest') {
      instance.goInstance.get(`/api/visitCheck?q=${cookie[key].Username}`)
      .then((response) => {
        response.data === 'true' ? this.setState({ redirect: false }) : this.setState({ redirect: true});
      }).catch((error) => { console.log('Check visits error', error); });
    }
  }
}

export default function checkToken() {
  let cookie = Cookies.getJSON(), cookieCount = 0;
  for (let key in cookie) {
    cookieCount++;
    if (key !== 'pnctest') {
      instance.goInstance.post('/api/tokenCheck', {
        Username: cookie[key].Username,
        Token: cookie[key].Token
      }).then((response) => {
        response.data === true ? this.setState({ unauthorized: false }, () => { checkVisits.call(this); }) : this.setState({ unauthorized: true });
      }).catch((error) => {
        this.setState({unauthorized: true});
        console.log('Check token error', error);
      });
    }
  }
  if (cookieCount === 1) {
    this.setState({ unauthorized: true });
  }
}