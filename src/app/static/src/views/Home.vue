<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Charts chart-metadata="metadata.charts" chart-data="results"></Charts>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Charts from "@/components/charts/Charts.vue";
import {mapActions, mapState} from "vuex";

export default defineComponent({
    name: "Home",
    components: {
        Charts
    },
    methods: {
        ...mapActions([
            "getMetadata",
            "getResults"
        ]),
        ...mapState([
            "metadata",
            "results"
        ])
    },
    mounted() {
        this.getMetadata();
        this.getResults();
    }
});
</script>
