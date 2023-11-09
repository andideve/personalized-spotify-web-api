import { NextResponse } from 'next/server';
import axios from 'axios';

import { env, generateBasicAuthHeader } from '@/utils';

const { APP_CLIENT_ID, APP_CLIENT_SECRET } = env();
const BASIC_AUTH_HEADER = generateBasicAuthHeader(
  APP_CLIENT_ID as string,
  APP_CLIENT_SECRET as string,
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirect_uri = `${url.origin}/callback`;
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      {
        status: false,
        message: 'Missing required parameter: code',
      },
      { status: 400 },
    );
  }

  try {
    // https://developer.spotify.com/documentation/web-api/tutorials/code-flow
    const { refresh_token } = await axios
      .post(
        'https://accounts.spotify.com/api/token',
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: BASIC_AUTH_HEADER,
          },
        },
      )
      .then((res) => res.data);

    return NextResponse.json({
      refresh_token,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: false,
        message: axios.isAxiosError(err) ? err.message : 'Unknown Error',
      },
      { status: 500 },
    );
  }
}
