<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Charts :chart-metadata="metadata ? metadata.charts: null" :chart-data="results"></Charts>
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
    computed: {
        ...mapState([
            "metadata",
            "results"
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
