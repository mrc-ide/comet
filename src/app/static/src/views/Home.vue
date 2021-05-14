<template>
  <div class="home row">
    <Parameters class="col-md-4" v-if="metadata"
                :paramGroupMetadata="metadata.parameterGroups"
                :paramValues="paramValues"
                @updateMetadata="setParameterMetadata"
                @updateValues="updateParameterValues"></Parameters>
    <Charts class="col-md-8" v-if="metadata"
            :chart-metadata="metadata.charts"
            :chart-data="results"
            :layout-data="chartLayoutData"></Charts>
  </div>
</template>

<script lang="ts">

import Vue from "vue";
import Charts from "@/components/charts/Charts.vue";
import Parameters from "@/components/parameters/Parameters.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default Vue.extend({
    name: "Home",
    components: {
        Charts,
        Parameters
    },
    computed: {
        ...mapState([
            "metadata",
            "paramValues",
            "results"
        ]),
        ...mapGetters([
            "chartLayoutData"
        ])
    },
    methods: {
        ...mapActions([
            "getMetadata",
            "getResults",
            "updateParameterValues"
        ]),
        ...mapMutations([
            "setParameterMetadata"
        ])
    },
    mounted() {
        this.getMetadata();
        this.getResults();
    }
});
</script>
