<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import { mapActions } from "vuex";

export default defineComponent({
    name: "Home",
    components: {
        HelloWorld
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
