<template>
  <div ref="chart"></div>
</template>

<script lang="ts">
    import Plotly, {Config} from "plotly.js";
    import {ChartMetadata, Data} from "@/types";
    import {computed, defineComponent, onMounted, PropType, ref, watch} from "vue";
    import jsonata from "jsonata";

    export default defineComponent( {
        name: "Chart",
        props: {
            chartMetadata: { type: Object as PropType<ChartMetadata>, required: true},
            chartData: { type: Object as PropType<Data>, required: true},
            layoutData: { type: Object as PropType<Data>, required: true }
        },
        setup(props) {
            const chart = ref(null);
            const data = computed(() => {
                return JSON.parse(JSON.stringify(jsonata(props.chartMetadata!!.data).evaluate(props.chartData)));
            });
            const layout = computed(() => {
                return JSON.parse(JSON.stringify(jsonata(props.chartMetadata!!.layout).evaluate({...props.layoutData, data: data.value})));
            });
            const config = computed(() => {
                return props.chartMetadata.config as Partial<Config>;
            });

            function drawChart() {
                const el = chart.value as unknown;
                Plotly.react(el as HTMLElement, data.value, layout.value, config.value);
            }

            //TODO: schema validation
            onMounted(() => {
                drawChart();
            });

            watch([data, layout], () =>{
                drawChart();
            });

            return { chart, data, layout, config, drawChart }
        }
  });
</script>

