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
import { defineComponent, computed, Ref } from "@vue/composition-api";
import { Rt } from "@/types";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import {DisplayPhase, daysBetween, getDisplayPhase, phaseClassFromIndex, getTotalDays} from "./phasesUtils";

dayjs.extend(duration);

interface Props {
    phases: Array<Rt>,
    forecastStart: Date,
    forecastEnd: Date
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
        const displayPhases: Ref<DisplayPhase[]> = computed(() => {
            return props.phases.map((rt, idx) => {
                return getDisplayPhase(rt, idx, props.phases, props.forecastEnd);
            });
        });

        const totalDays = getTotalDays(props.forecastStart, props.forecastEnd);
        const daysAsPercent = (days: number) => (days / totalDays) * 100;

        const maxRt = computed(() => { return Math.max(...props.phases.map((p) => p.value)); });
        const rtAsPercent = (rt: number) => (rt / maxRt.value) * 100;

        const formatPercent = (value: number) => `${value.toFixed(2)}%`;

        const phaseBlocks: Ref<PhaseBlock[]> = computed(() => {
            let nextLeft = daysAsPercent(daysBetween(props.forecastStart, displayPhases.value[0].startDate));
            return displayPhases.value.map((displayPhase) => {
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
        });

        return {
            displayPhases,
            phaseBlocks,
            phaseClassFromIndex
        };
    }
});
</script>
