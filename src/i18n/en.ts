import type { MessageKey } from './hu'

/** English UI strings. The type forces the same keys as hu.ts. */
export const en: Record<MessageKey, string> = {
  'doc.title': 'Advent 2026 – Advent calendar',

  'header.title': 'Advent 2026',
  'header.lead': 'A new door every day. Click it and see what is hiding behind!',

  'lang.switch': 'Language',
  'lang.hu': 'Hungarian',
  'lang.en': 'English',

  'countdown.until': 'Until Christmas Eve',
  'countdown.days.one': 'day',
  'countdown.days.other': 'days',
  'countdown.hours.one': 'hour',
  'countdown.hours.other': 'hours',
  'countdown.minutes.one': 'minute',
  'countdown.minutes.other': 'minutes',
  'countdown.seconds.one': 'second',
  'countdown.seconds.other': 'seconds',
  'countdown.merry': 'Merry Christmas! 🎄',

  'banner.opens.one': 'The first door opens on December 1 – just {n} day to go!',
  'banner.opens.other': 'The first door opens on December 1 – {n} days to go!',

  'calendar.label': 'Advent calendar, 24 doors',
  'door.label': 'Door {n}',
  'door.aria.closed': 'Door {n}, closed – open it!',
  'door.aria.open': 'Door {n}, open',
  'door.aria.locked': 'Door {n}, locked – {when}',
  'door.opensTomorrow': 'Opens tomorrow',
  'door.opensIn.one': 'Opens in {n} day',
  'door.opensIn.other': 'Opens in {n} days',

  'progress.opened': '{n} / 24 doors open',
  'progress.reset': 'Reset progress',
  'progress.reset.confirm': 'Really close every door you have opened?',
  'progress.reset.yes': 'Yes, reset',
  'progress.reset.no': 'Cancel',
}
