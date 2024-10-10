const https = require('https');
const fs = require('fs');
const app = require('./app'); // Assuming your Express app is in app.js
const config = require('./config');

const options = {
  key: fs.readFileSync('path/to/your/private-key.pem'),
  cert: fs.readFileSync('path/to/your/certificate.pem')
};

https.createServer(options, app).listen(config.port, () => {
  console.log(`Server running on https://localhost:${config.port}`);
});