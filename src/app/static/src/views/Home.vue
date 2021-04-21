<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import {mapActions} from "vuex"; // @ is an alias to /src

export default defineComponent({
    name: "Home",
    components: {
        HelloWorld
    },
    methods: {
        ...mapActions([
            "getMetadata"
        ])
    },
    mounted() {
        this.getMetadata();
    }
});
</script>
