<template>

</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Rt } from "@/types";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

interface Props {
    phases: Array<Rt>,
    forecastDays: number
}

interface displayPhase {
    index: number
    days: number
    start: string
    end: string
    value: number
}

export default defineComponent({
    name: "Phases",
    props: {
        phases: Array,
        forecastDays: Number
    },
    setup(props: Props) {
        const displayPhases = props.phases.map((rt, idx) => {
            //const startDate = new Date(Date.parse(rt.start));
            const startDate = dayjs(rt.start);
            let endDate;
            if (idx < props.phases.length - 1) {
                //const nextStart = Date.parse(props.phases[idx + 1].start);
                //const nextStart = ;
                //endDate = new Date(nextStart);
                //endDate.setDate(endDate.getDate() - 1);
                endDate = dayjs(props.phases[idx + 1].start).subtract(1, "day");
            } else {
                //endDate = new Date();
                //endDate.setDate(endDate.getDate() + props.forecastDays);
                endDate = dayjs().add(props.forecastDays, "day");
            }

            //const days = endDate === startDate ? 0 : Math.floor((endDate.valueOf() - startDate.valueOf())/(1000*60*60*24));
            const days = startDate.diff(endDate, "day");
            const format = "DD/MM/YY";

            return {
                index: idx + 1,
                days,
                start: startDate.format(format),
                end: endDate.format(format),
                value: rt.value
            }
       });
    }
});
</script>
