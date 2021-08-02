<template>
  <div class="home row">
    <div class="col-md-4">
      <Parameters class="parameters" v-if="metadata"
                  :paramGroupMetadata="metadata.parameterGroups"
                  :paramValues="paramValues"
                  :forecastStart="forecastStart"
                  :forecastEnd="forecastEnd"
                  @updateMetadata="setParameterMetadata"
                  @updateValues="updateParameterValues"></Parameters>
    </div>
    <div class="col-md-8">
      <Errors :errors="errors" @dismissed="setErrors([])"></Errors>
      <Charts v-if="metadata && !fetchingResults"
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
import { defineComponent } from "@vue/composition-api";
import Charts from "@/components/charts/Charts.vue";
import Parameters from "@/components/parameters/Parameters.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {
    mapActions,
    mapGetters,
    mapMutations,
    mapState
} from "vuex";
import Errors from "@/components/Errors.vue";

export default defineComponent({
    name: "Home",
    components: {
        Charts,
        Parameters,
        Errors,
        LoadingSpinner
    },
    computed: {
        ...mapState([
            "metadata",
            "paramValues",
            "results",
            "fetchingResults",
            "errors"
        ]),
        ...mapGetters([
            "chartLayoutData",
            "forecastStart",
            "forecastEnd"
        ])
    },
    methods: {
        ...mapActions([
            "getMetadata",
            "getCountries",
            "getResults",
            "updateParameterValues"
        ]),
        ...mapMutations([
            "setParameterMetadata",
            "setErrors"
        ])
    },
    mounted() {
        if (!this.metadata) {
            this.getMetadata();
        }
        if (!this.countries) {
            this.getCountries();
        }
        if (!this.results) {
            this.getResults();
        }
    }
});
</script>
