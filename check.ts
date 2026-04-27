import https from 'https';

const url = 'https://i.pinimg.com/originals/78/9f/7d/789f7d427235ad783bf941ed5eaeff66.gif';
https.request(url, { method: 'HEAD' }, (res) => {
  console.log(res.statusCode);
}).end();
