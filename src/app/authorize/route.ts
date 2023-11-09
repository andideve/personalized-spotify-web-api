import { NextResponse } from 'next/server';

import { env } from '@/utils';

const { APP_CLIENT_ID, OAUTH2_URL_GENERATOR } = env();

export function GET(req: Request) {
  const url = new URL(req.url);
  const redirect_uri = `${url.origin}/callback`;

  return NextResponse.redirect(
    `${OAUTH2_URL_GENERATOR}?client_id=${APP_CLIENT_ID}&redirect_uri=${redirect_uri}`,
  );
}
