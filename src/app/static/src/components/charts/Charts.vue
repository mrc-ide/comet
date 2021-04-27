<template>
  <div>
    <Chart v-if="chartData"
           v-for="chart in chartMetadata"
           :chart-metadata="chart"
           :chart-data="chartData"
           :layout-data="layoutData"></Chart>
  </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import Chart from "./Chart.vue";
    import {ChartMetadata, Data} from "@/types";

    export default defineComponent( {
        name: "Charts",
        components: {
            Chart
        },
        props: {
            chartMetadata: { type: Array as PropType<ChartMetadata[]>, required: true },
            chartData: { type: Object as PropType<Data>},
            layoutData: { type: Object as PropType<Data>, required: true }
        },
    });
</script>
