import dayjs, { Dayjs } from 'dayjs';
import { AMOUNT_OF_DAYS } from 'src/booking-list/constants';
import { endOfDay, startOfDay } from 'date-fns';
import { IStartEndDates } from 'src/booking-list/types';

class DatesTimeManager {
  getDatesForCalendarMS() {
    let arrOfDays: number[] = [];
    arrOfDays.length = AMOUNT_OF_DAYS - 1;
    arrOfDays.fill(0);

    const arrDatesMs = arrOfDays.reduce((acc: number[], item, index) => {
      const currentDate = +new Date();
      const nextDateMS = currentDate + 86_400_000 * index;
      acc.push(nextDateMS);
      return acc;
    }, []);
    return arrDatesMs;
  }

  getStartAndEndOfDays(datesMs: number[]) {
    return datesMs.reduce((accum: IStartEndDates[], item) => {
      const dateItem: IStartEndDates = {
        date: item,
        start: +startOfDay(new Date(item)),
        end: +endOfDay(new Date(item)),
      };
      accum.push(dateItem);
      return accum;
    }, []);
  }

  getFormattingDate(date: number) {
    return this.formatter.format(date);
  }

  getFormattingDateTime(date: number) {
    return this.formatterDateTime.format(date);
  }

  getFormattingTime(date: number) {
    return this.formatterTime.format(date);
  }

  getCurrentDate() {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }

  getCurrentDateTimeDayJs() {
    return dayjs();
  }

  getCurrentDateTime() {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  addHours(originalTime: Dayjs, hours: number) {
    return originalTime.add(hours, 'hour');
  }

  getDateTimeSec(date: Dayjs | undefined, time: Dayjs | undefined) {
    const startHour = dayjs(time).hour();
    const startMin = dayjs(time).minute();
    const startDateTime = dayjs(date).hour(startHour).minute(startMin);

    return this.getSecFromDate(startDateTime);
  }

  getSecFromDate(date: string | Dayjs) {
    return Math.round(dayjs(date).toDate().getTime() / 1000);
  }

  private formatter = new Intl.DateTimeFormat('ru', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  private formatterDateTime = new Intl.DateTimeFormat('ru', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  private formatterTime = new Intl.DateTimeFormat('ru', {
    hour: 'numeric',
    minute: 'numeric',
  });
}

export const datesManager = new DatesTimeManager();
