export function env() {
  return {
    APP_CLIENT_ID: process.env.APP_CLIENT_ID,
    APP_CLIENT_SECRET: process.env.APP_CLIENT_SECRET,
    OAUTH2_URL_GENERATOR: process.env.OAUTH2_URL_GENERATOR,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  };
}

export function generateBasicAuthHeader(username: string, pass: string) {
  return 'Basic ' + Buffer.from(`${username}:${pass}`).toString('base64');
}
