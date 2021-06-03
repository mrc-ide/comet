import dayjs from "dayjs";
import { RootState } from "@/store/state";
import { Data } from "@/types";

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
        // NB This will be updated from today to the day after last reporting day
        return new Date();
    },
    forecastEnd: (): Date => {
        // NB counting from today for now, but this will be updated to count from last reporting
        // day in country data
        return dayjs().add(forecastDays, "days").toDate();
    }
};
