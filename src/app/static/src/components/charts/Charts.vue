<template>
  <div>
    Here are charts
    <!--<div v-for="chart in chartMetadata">{{JSON.stringify(chart)}}</div>-->
    <Chart v-if="chartData" v-for="chart in chartMetadata" :chart-metadata="chart" :chart-data="chartData"></Chart>
  </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import Chart from "./Chart.vue";
    import {ChartMetadata, Results} from "@/types";

    export default defineComponent( {
        name: "Charts",
        components: {
            Chart
        },
        props: {
            chartMetadata: { type: Array as PropType<ChartMetadata[]>, required: true },
            chartData: { type: Object as PropType<Results> , required: true}
        },
    });
</script>
