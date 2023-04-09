import { OAuth2Client } from 'google-auth-library';
// import { getCalendarList, getEventList } from './googleCalendar';
import {GoogleCalendar} from './googleCalendar';

describe('get google calendar list', () => {
  it('should have calendar array', async () => {
    const rt =
      '1//0eYmlJl7CVgwrCgYIARAAGA4SNwF-L9IrKuL9n5QcDje7PphexHitSh1xvCOqD9W0wzhaKTe5_Tdudh-0Sj6BopHXC11ODW0yQWg';

    const googleCalendar = new GoogleCalendar(rt);
    const calendarList = await googleCalendar.listCalendars();

    expect(calendarList[0]).toHaveProperty('accessRole');
  });
});
