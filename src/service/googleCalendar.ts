import { calendar_v3, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import key from './credentials.json';

import dotenv from 'dotenv';
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

class GoogleCalendar {
  private readonly authClient: any;
  private readonly calendarApi: any;

  // ２種類の認証方法を用意
  // refreshTokenを利用するOAuth2.0。タイムアウトする
  // service accountを利用する。タイムアウトしない
  constructor(refreshToken?: string) {
    if (refreshToken !== undefined) {
      this.authClient = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET
      );
      this.authClient.setCredentials({ refresh_token: refreshToken });
    } else {
      this.authClient = new google.auth.JWT(
        key.client_email,
        '',
        key.private_key,
        ['https://www.googleapis.com/auth/calendar'],
        ''
      );
    }
    this.calendarApi = google.calendar({
      version: 'v3',
      auth: this.authClient,
    });
  }

  async listCalendars() {
    const response = await this.calendarApi.calendarList.list();

    return response.data.items;
  }

  async listEvents(calendarId: string) {
    const response = await this.calendarApi.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items;
  }
}

export { GoogleCalendar };
