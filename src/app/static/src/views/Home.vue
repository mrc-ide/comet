<template>
  <div class="home">
    <Charts v-if="metadata"
            :chart-metadata="metadata.charts"
            :chart-data="results"
            :layout-data="chartLayoutData"></Charts>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Charts from "@/components/charts/Charts.vue";
import {mapActions, mapGetters, mapState} from "vuex";

export default defineComponent({
    name: "Home",
    components: {
        Charts
    },
    computed: {
        ...mapState([
            "metadata",
            "results"
        ]),
        ...mapGetters([
            "chartLayoutData"
        ])
    },
    methods: {
        ...mapActions([
            "getMetadata",
            "getResults"
        ])
    },
    mounted() {
        this.getMetadata();
        this.getResults();
    }
});
</script>
