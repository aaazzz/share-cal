import { calendar_v3, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import dotenv from 'dotenv';
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

class GoogleCalendar {
  private readonly calendarApi: any;

  constructor(refreshToken: string) {
    const authClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    authClient.setCredentials({ refresh_token: refreshToken });
    this.calendarApi = google.calendar({ version: 'v3', auth: authClient });
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

const getCalendarList = async (oAuth2Client: OAuth2Client) => {
  const gCal = google.calendar({ version: 'v3', auth: oAuth2Client });
  const { data } = await gCal.calendarList.list();
  return data;
};

const getEventList = async (
  oAuth2Client: OAuth2Client,
  calendarId: string
): Promise<calendar_v3.Schema$Events> => {
  const gCal = google.calendar({ version: 'v3', auth: oAuth2Client });
  const { data } = await gCal.events.list({ calendarId });
  return data;
};

export { GoogleCalendar };
