<template>
  <div>
    <div v-for="phase in displayPhases"
         :key="phase.index"
         class="p-2 m-2"
         :class="phase.index % 2 ? 'phase-odd' : 'phase-even'">
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
    forecastStart: Date,
    forecastEnd: Date
}

interface displayPhase {
    index: number
    days: number
    startDate: Date,
    endDate: Date,
    start: string
    end: string
    value: number
}

interface phaseBlock {
    index: number
    width: number,
    left: number,
    height: number
}

export default defineComponent({
    name: "Phases",
    props: {
        phases: Array,
        forecastStart: Date,
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

            const days = endDate.diff(startDate, "day");
            const format = "DD/MM/YY";

            return {
                index: idx + 1,
                days,
                startDate,
                endDate,
                start: startDate.format(format),
                end: endDate.format(format),
                value: rt.value
            };
        });

        const totalDays = dayjs(props.forecastEnd).diff(dayjs(props.forecastStart, "day"));
        const daysAsPercent = (days: number) => {
            return (days / totalDays) * 100;
        };

        const maxRt = Math.max(...props.phases.map(p => parseFloat(p.value));
        const rtAsPercent = (rt: number) => {
            return (rt / maxRt) * 100''
        };

        let lastRight = daysAsPercent(dayjs(displayPhases[0].startDate).diff(dayjs(props.forecastStart, "day")));
        const phaseBlocks = displayPhases.map((displayPhase) => {
            const result = {
                index: displayPhase.index,
                left: lastRight,
                width: daysAsPercent(displayPhase.days),
                height: rtAsPercent(parseFloat(displayPhase.value))
            };
            lastRight += result.width;

            return result;
        });

        return {
            displayPhases,
            phaseBlocks
        };
    }
});
</script>
