<template>
  <div class="p-2">
    <div class="phase-block-container">
      <div
        v-for="block in phaseBlocks"
        :key="block.index"
        class="phase-block"
        :class="phaseClassFromIndex(block.index)"
        :style="`height:${block.height}; width:${block.width}; left: ${block.left}`"
      ></div>
    </div>
    <div class="phase-block-base"></div>
    <div v-for="phase in displayPhases"
         :key="phase.index"
         class="phase-description p-2 mt-2"
         :class="phaseClassFromIndex(phase.index)">
      <div class="phase-header">
        <span class="font-weight-bold">Phase {{phase.index}}</span> ({{phase.days}} days)
      </div>
      <div class="phase-dates mb-3">{{phase.start}} - {{phase.end}}</div>
      <div class="phase-rt">Rt: <span class="font-weight-bold">{{phase.value}}</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Rt } from "@/types";
import dayjs, { Dayjs } from "dayjs";;
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface Props {
    phases: Array<Rt>,
    forecastStart: Date,
    forecastEnd: Date
}

interface DisplayPhase {
    index: number
    days: number
    startDate: Dayjs,
    start: string
    end: string
    value: string
}

interface PhaseBlock {
    index: number
    width: string,
    left: string,
    height: string
}

export default defineComponent({
    name: "Phases",
    props: {
        phases: Array,
        forecastStart: Date,
        forecastEnd: Date
    },
    setup(props: Props) {
        const daysBetween = (start: Date | Dayjs, end: Date | Dayjs) => {
            return dayjs(end).diff(dayjs(start), "day");
        };

        const displayPhases: Array<DisplayPhase> = props.phases.map((rt, idx) => {
            const startDate = dayjs(rt.start);
            let endDate;
            if (idx < props.phases.length - 1) {
                endDate = dayjs(props.phases[idx + 1].start).subtract(1, "day");
            } else {
                endDate = dayjs(props.forecastEnd);
            }

            const days = daysBetween(startDate, endDate) + 1; // include last day
            const format = "DD/MM/YY";

            return {
                index: idx + 1,
                days,
                startDate,
                start: startDate.format(format),
                end: endDate.format(format),
                value: rt.value
            };
        });

        const totalDays = daysBetween(props.forecastStart, props.forecastEnd) + 1;
        const daysAsPercent = (days: number) => (days / totalDays) * 100;

        const maxRt = Math.max(...props.phases.map((p) => parseFloat(p.value)));
        const rtAsPercent = (rt: number) => (rt / maxRt) * 100;

        const formatPercent = (value: number) => `${value.toFixed(2)}%`;

        let nextLeft = daysAsPercent(daysBetween(props.forecastStart, displayPhases[0].startDate));
        const phaseBlocks: Array<PhaseBlock> = displayPhases.map((displayPhase) => {
            const width = daysAsPercent(displayPhase.days);
            const result = {
                index: displayPhase.index,
                left: formatPercent(nextLeft),
                width: formatPercent(width),
                height: formatPercent(rtAsPercent(parseFloat(displayPhase.value)))
            };
            nextLeft += width;

            return result;
        });

        const phaseClassFromIndex = (index: number) => (index % 2 ? "phase-odd" : "phase-even");

        return {
            displayPhases,
            phaseBlocks,
            phaseClassFromIndex
        };
    }
});
</script>
