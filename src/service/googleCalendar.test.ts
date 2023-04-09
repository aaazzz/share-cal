import { GoogleCalendar } from './googleCalendar';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Google Calendar with Service Account', () => {
  it('should have event array', async () => {

    const googleCalendar = new GoogleCalendar();
    const events = await googleCalendar.listEvents('akira@sango-tech.com');

    expect(events[0]).toHaveProperty('iCalUID');
  });
});

describe('Google Calendar with Refesh Token', () => {
  it('should have calendar array', async () => {
    const user = await prisma.user.findUnique({
      where: {
        id: '114243865363109431680' 
      }
    });
    if (!user) return;

    const refreshToken = user.refreshToken || '';

    const googleCalendar = new GoogleCalendar(refreshToken);
    const calendars = await googleCalendar.listCalendars();
    
    expect(calendars[0]).toHaveProperty('accessRole');
  });
});
