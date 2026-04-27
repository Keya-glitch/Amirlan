import https from 'https';

https.get('https://www.pinterest.com/pin/922886148653965039/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/i\.pinimg\.com\/originals\/[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+/g);
    console.log(matches ? matches.join('\n') : 'not found');
  });
});
