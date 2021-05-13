<template>
  <div class="home row">
    <Parameters class="col-md-4" v-if="metadata"
                :paramGroupMetadata="metadata.parameterGroups"></Parameters>
    <Charts class="col-md-8" v-if="metadata"
            :chart-metadata="metadata.charts"
            :chart-data="results"
            :layout-data="chartLayoutData"></Charts>
  </div>
</template>

<script lang="ts">

import { defineComponent } from "@vue/composition-api";
import Charts from "@/components/charts/Charts.vue";
import Parameters from "@/components/parameters/Parameters.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default defineComponent({
    name: "Home",
    components: {
        Charts,
        Parameters
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
