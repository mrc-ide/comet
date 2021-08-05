import dayjs, { Dayjs } from "dayjs";
import { Rt } from "@/types";

export interface DisplayPhase {
  index: number
  days: number
  startDate: Dayjs,
  start: string
  end: string
  value: string
}

export const daysBetween = (start: Date | Dayjs, end: Date | Dayjs): number => {
    return dayjs(end).diff(dayjs(start), "day");
};

export const getDisplayPhase = (
    rt: Rt,
    idx: number,
    phases: Rt[],
    forecastEnd: Date
): DisplayPhase => {
    const startDate = dayjs(rt.start);
    let endDate;
    if (idx < phases.length - 1) {
        endDate = dayjs(phases[idx + 1].start).subtract(1, "day");
    } else {
        endDate = dayjs(forecastEnd);
    }

    const days = daysBetween(startDate, endDate) + 1; // include last day
    const format = "DD/MM/YY";

    return {
        index: idx + 1,
        days,
        startDate,
        start: startDate.format(format),
        end: endDate.format(format),
        value: rt.value.toString()
    };
};

export const getTotalDays = (start: Date, end: Date): number => daysBetween(start, end) + 1;

export const phaseClassFromIndex = (idx: number): string => (idx % 2 ? "phase-odd" : "phase-even");

export const numericFormatter = (num: number): any => {
    if (num > 999 && num < 1000000) {
        return `${(num / 1000).toFixed(2)}k`; // convert to K for number from > 1000 < 1 million
    } if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2)}m`; // convert to M for number from > 1 million
    } if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(2)}b`; // convert to B for number from > 1 billion
    } if (num < 900) {
        return num.toString(); // if value < 1000, nothing to do
    }

    return 0;
};
