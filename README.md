
---
## 1. Install

### npm
```
npm i
```

## 2. Environment variables
```sh
NODE_ENV=development

PORT=8000

#AUTH0
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

#WINSTON
LOG_LEVEL=debug

#MONGODB
MONGODB_URI=

#MIXPANEL
MIXPANEL_TOKEN=

#STRIPE
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

```

## 3. Start
### Run as dev using nodemon
```sh
npm run dev
```

---

## 4. Testing

`npm run test`

### Testing webhooks

Use the Stripe CLI to listen and trigger events.

1. In one terminal run the Stripe CLI to forward events to your local endpoint, and leave running (don't quit)
`stripe listen --forward-to localhost:8000/api/v1/stripe_webhooks`
2. In a second terminal trigger events: `stripe trigger [event]`

## Acknowledgements
- [express](https://expressjs.com/)
- [express-oauth2-jwt-bearer](https://auth0.github.io/node-oauth2-jwt-bearer/)
- [cors](https://expressjs.com/en/resources/middleware/cors.html)
- [node-auth0](https://auth0.github.io/node-auth0/)
- [fs](https://www.npmjs.com/package/fs)