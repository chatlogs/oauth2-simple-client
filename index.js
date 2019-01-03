const oauth2 = require('simple-oauth2');
const express = require('express');

const appUrl = process.env.APP_URL;
const oAuthUrl = process.env.OAUTH2_URL;

const credentials = {
  client: {
    id: 'test',
    secret: 'secret'
  },
  auth: {
    tokenHost: oAuthUrl,
    tokenPath: '/oauth2/token',
    authorizePath: '/oauth2/auth'
  }
};

const app = express();
const client = oauth2.create(credentials);

app.get('/', (req, res) => {
  // Authorization oauth2 URI
  const authorizationUri = client.authorizationCode.authorizeURL({
    redirect_uri: `${appUrl}/callback`,
    state: '123456789',
    scope: 'openid offline'
  });

  res.redirect(authorizationUri);
});

app.get('/callback', async (req, res) => {
  const tokenConfig = {
    code: req.query.code,
    redirect_uri: `${appUrl}/callback`,
    scope: 'openid offline'
  };

  try {
    const result = await client.authorizationCode.getToken(tokenConfig);
    const accessToken = client.accessToken.create(result);

    res.send(accessToken);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
});

app.listen(3000);
