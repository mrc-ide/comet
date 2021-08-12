import dayjs from "dayjs";
import { RootState } from "@/store/state";
import { Data } from "@/types";
import { numericFormatter } from "../utils/formatter";

// We hard-code this parameter sent to cometr to give a forecast of 2 years
export const forecastDays = 730;

export const getters = {
    chartLayoutData: (state: RootState): Data => {
        return {
            params: state.paramValues,
            // This is not a parameter, cannot be edited - will come from cometr regions endpoint
            population: 67890000
        };
    },
    forecastStart: (): Date => {
        // NB This will be updated from today to the day after last reporting day  mrc-2442
        return dayjs().startOf("day").toDate();
    },
    forecastEnd: (): Date => {
        // NB counting from today for now, but this will be updated to count from last reporting
        // day in country data in mrc-2442
        return dayjs().startOf("day").add(forecastDays, "days").toDate();
    },
    population: (state: RootState): string => {
        const population = state.countries && state.countries
            .find((country) => country.code === state.paramValues!.region)!.population;

        return numericFormatter(population || 0);
    }
};
