<template>
  <div>
    Here is a chart
    <div ref="chart"></div>
  </div>
</template>

<script lang="ts">
  import Plotly, {Config, Data, Layout} from "plotly.js";
  import {ChartMetadata, Results} from "@/types";
  import { defineComponent, ref, PropType, computed, watch, onMounted } from "vue";
  import jsonata from "jsonata";

  interface Props {
      chartMetadata: ChartMetadata,
      chartData: Results
  }

  export default defineComponent( {
      name: "Chart",
      props: {
          chartMetadata: { type: Object as PropType<ChartMetadata>},
          chartData: { type: Object as PropType<Results>},
          layoutData: { type: Object}
      },
      $refs: {
          chart: ref(null)
      },
      mounted() {
          //TODO: schema validation
          console.log("setting some metadata for " + (this.chartMetadata as any).id);
          const plotlyData = JSON.parse(JSON.stringify(jsonata(this.chartMetadata!!.data).evaluate(this.chartData)));
          console.log("plotlyData: " + JSON.stringify(plotlyData))
          console.log("plotly data params:" + JSON.stringify(plotlyData.params));
          console.log("layout data:" + JSON.stringify(this.layoutData))

          const plotlyLayout = JSON.parse(JSON.stringify(jsonata(this.chartMetadata!!.layout).evaluate({...this.layoutData, data: plotlyData})));
          //const plotlyLayout = {title: {text: "R"}};
          console.log("plotlyLayout: " + JSON.stringify(plotlyLayout))
          const plotlyConfig = this.chartMetadata!!.config as Partial<Config>; //TODO: This shouldn't change
          //console.log("plotlyConfig: " + JSON.stringify(plotlyConfig))
          Plotly.newPlot(this.$refs.chart as HTMLElement, plotlyData, plotlyLayout, plotlyConfig); //TODO: make plotly.react in watch data and layoutData
      }
  });
</script>

