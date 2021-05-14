<template>
  <div class="home row">
    <Parameters class="col-md-4" v-if="metadata"
                :paramGroupMetadata="metadata.parameterGroups"
                :paramValues="paramValues"
                @updateMetadata="setParameterMetadata"
                @updateValues="updateParameterValues"></Parameters>
    <div class="col-md-8">
      <Charts v-if="metadata"
              :chart-metadata="metadata.charts"
              :chart-data="results"
              :layout-data="chartLayoutData"></Charts>
      <div v-if="fetchingResults" id="fetching-results">
        <div id="fetching-results-msg">
          <loading-spinner size="xs"></loading-spinner>
          Updating analysis...
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/composition-api";
import Charts from "@/components/charts/Charts.vue";
import Parameters from "@/components/parameters/Parameters.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default defineComponent({
    name: "Home",
    components: {
        Charts,
        Parameters,
        LoadingSpinner
    },
    computed: {
        ...mapState([
            "metadata",
            "paramValues",
            "results",
            "fetchingResults"
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
