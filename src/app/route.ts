import { NextResponse } from 'next/server';
import axios from 'axios';

import { env, generateBasicAuthHeader } from '@/utils';

const { APP_CLIENT_ID, APP_CLIENT_SECRET, REFRESH_TOKEN } = env();
const BASIC_AUTH_HEADER = generateBasicAuthHeader(
  APP_CLIENT_ID as string,
  APP_CLIENT_SECRET as string,
);
const API_BASE_URI = 'https://api.spotify.com/v1';

export const revalidate = 0;

export async function GET() {
  try {
    // https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
    const { access_token, token_type } = await axios
      .post(
        'https://accounts.spotify.com/api/token',
        {
          grant_type: 'refresh_token',
          refresh_token: REFRESH_TOKEN,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: BASIC_AUTH_HEADER,
          },
        },
      )
      .then((res) => res.data);

    const config = {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    const [player, top_tracks] = await Promise.all([
      // https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
      axios
        .get(`${API_BASE_URI}/me/player/currently-playing`, config)
        .then((res) => (typeof res.data === 'object' ? res.data : { is_playing: false })),
      // https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
      axios
        .get(`${API_BASE_URI}/me/top/tracks?limit=4&time_range=short_term`, config)
        .then((res) => res.data),
    ]);

    return NextResponse.json({
      player,
      top: {
        tracks: top_tracks,
      },
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
