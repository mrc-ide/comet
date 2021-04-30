<template>
  <div ref="chart"></div>
</template>

<script lang="ts">
import Plotly from "plotly.js";
import Ajv from "ajv";
import { ChartMetadata, Data } from "@/types";
import {
    computed,
    defineComponent,
    onMounted,
    PropType,
    ref,
    watch
} from "vue";
import jsonata from "jsonata";

export default defineComponent({
    name: "Chart",
    props: {
        chartMetadata: { type: Object as PropType<ChartMetadata>, required: true },
        chartData: { type: Object as PropType<Data>, required: true },
        layoutData: { type: Object as PropType<Data>, required: true }
    },
    setup(props) {
        const chart = ref(null);

        const inputData = computed(() => {
            return {
                ...props.chartData,
                ...props.layoutData
            };
        });

        const data = computed(() => {
            return jsonata(props.chartMetadata.data).evaluate(inputData.value);
        });
        const layout = computed(() => {
            console.log(JSON.stringify({data: data.value}))
            return jsonata(props.chartMetadata.layout).evaluate({
                ...props.layoutData,
                data: data.value
            });
        });
        const config = computed(() => {
            return jsonata(props.chartMetadata.config).evaluate({
                ...props.layoutData,
                data: data.value
            });
        });

        function validate() {
            const ajv = new Ajv();
            const ajvValidate = ajv.compile(props.chartMetadata.inputSchema);
            const valid = ajvValidate(inputData.value);

            if (!valid) {
                console.error(ajvValidate.errors);
                throw new Error("Data validation failed");
            }
        }

        function drawChart() {
            const el = chart.value as unknown;
            Plotly.react(el as HTMLElement, data.value, layout.value, config.value);
        }

        onMounted(() => {
            validate();
            drawChart();
        });

        watch([data, layout], () => {
            validate();
            drawChart();
        });

        return {
            chart,
            data,
            layout,
            config
        };
    }
});
</script>
