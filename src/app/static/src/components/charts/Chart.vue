<template>
  <div>
    <div>{{JSON.stringify(data)}}</div>
    <div>{{JSON.stringify(layout)}}</div>
    <div ref="chart"></div>
  </div>
</template>

<script lang="ts">
  import Plotly from "plotly.js";
  import {ChartMetadata} from "@/types";
  import { defineComponent, ref } from "vue";

  //TODO: do all necessary jsonata unpacking and validation
  export default defineComponent( {
      name: "Chart",
      $refs: {
          chart: ref(null)
      },
      props: {
          chartMetadata: {
              type: Array,
              default: []
          },
          chartData: {
              type: Object
          }
      },
      data() {
          return {
              data: [{ x: [1, 3], y: [2, 4] }],
              layout: {},
              config: {}
          }
      },
      mounted() {
          Plotly.newPlot(this.$refs.chart as HTMLElement, this.data, this.layout, this.config)
      }
  });
</script>

