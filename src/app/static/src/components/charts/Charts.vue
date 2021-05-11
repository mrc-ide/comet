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
import { defineComponent } from "@vue/composition-api";
import Chart from "./Chart.vue";

export default defineComponent({
    name: "Charts",
    components: {
        Chart
    },
    props: {
        chartMetadata: Array,
        chartData: Object,
        layoutData: Object
    }
});
</script>
