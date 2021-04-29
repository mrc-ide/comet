<template>
  <div v-if="chartData">
    <Chart v-for="chart in chartMetadata"
           :key="chart.id"
           :chart-metadata="chart"
           :chart-data="chartData"
           :layout-data="layoutData"></Chart>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ChartMetadata, Data } from "@/types";
import Chart from "./Chart.vue";

export default defineComponent({
    name: "Charts",
    components: {
        Chart
    },
    props: {
        chartMetadata: { type: Array as PropType<ChartMetadata[]>, required: true },
        chartData: { type: Object as PropType<Data> },
        layoutData: { type: Object as PropType<Data>, required: true }
    }
});
</script>
