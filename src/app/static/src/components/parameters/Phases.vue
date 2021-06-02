<template>
  <div>
    <div v-for="phase in displayPhases" :key="phase.index">
      <span class="font-weight-bold">Phase {{phase.index}}</span> ({{phase.days}} days)
      <div class="mb-3">{{phase.start}}-{{phase.end}}</div>
      <div>Rt: <span class="font-weight-bold">{{phase.value}}</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Rt } from "@/types";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface Props {
    phases: Array<Rt>,
    forecastEnd: Date
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
        forecastEnd: Date
    },
    setup(props: Props) {
        const displayPhases = props.phases.map((rt, idx) => {
            const startDate = dayjs(rt.start);
            let endDate;
            if (idx < props.phases.length - 1) {
                endDate = dayjs(props.phases[idx + 1].start).subtract(1, "day");
            } else {
                endDate = dayjs(props.forecastEnd);
            }

            const days = startDate.diff(endDate, "day");
            const format = "DD/MM/YY";

            return {
                index: idx + 1,
                days,
                start: startDate.format(format),
                end: endDate.format(format),
                value: rt.value
            };
        });
        return {
            displayPhases
        };
    }
});
</script>
