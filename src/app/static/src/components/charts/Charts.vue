<template>
  <div>
    <Chart v-for="chart in chartMetadata" :metadata="chart" :chart-data="chartData"></Chart>
  </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import Chart from "./Chart.vue";
    import {ChartMetadata} from "@/types";

    export default defineComponent( {
        name: "Charts",
        components: {
            Chart
        },
        props: {
            chartMetadata: {
                type: Array,
                default: []
            },
            chartData: {
                type: Object
            }
        }
    });
</script>
