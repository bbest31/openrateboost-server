'use strict';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const checkJwt = require('./src/middlewares/checkJwt.js');
const sendErrorResponse = require('./src/middlewares/errorResponseMiddleware.js');
const mongoose = require('mongoose');
const http = require('http');
const enforce = require('express-sslify');

const usageJob = require('./src/jobs/usageJob.js');
// UTILS
const { httpResponseMessage } = require('./src/utils/responseMessages.js');

//  ROUTES
const routes = require('./src/routes/api.js');

// APP SETUP
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(/\/((?!.*tracking_pixel|.*stripe_webhooks|.*support).)*/, checkJwt);

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  } else {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
    mongoose.set({ autoIndex: false, autoCreate: false });
  }
  mongoose.set({ sanitizeFilter: true, strictQuery: true });
  await mongoose.connect(process.env.MONGODB_URI);
}

main().catch((err) => console.log(err));

// Parse incoming payloads as json, but make raw body available too
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use('/api', routes);

app.get('*', (_, res) => {
  res.status(404).send(httpResponseMessage[404]);
});

app.use(sendErrorResponse);

usageJob.start();

http.createServer(app).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
