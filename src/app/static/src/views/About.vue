<template>
  <div class="about">
    <h1>{{ heading }}</h1>
    <errors :errors="errors" @dismissed="setErrors([])"></errors>
    <h2>API versions</h2>
    <p id="api-name">API Name: {{apiName}}</p>
    <div v-for="(value, key) in apiVersion" :key="key" class="api-version">{{key}}: {{value}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState, mapMutations } from "vuex";
import Errors from "@/components/Errors.vue";

export default Vue.extend({
    name: "About",
    props: {
        heading: {
            type: String,
            default: "About comet"
        }
    },
    components: {
        Errors
    },
    computed: {
        ...mapState([
            "apiInfo",
            "errors"
        ]),
        apiName(): string {
            return this.apiInfo && this.apiInfo.name;
        },
        apiVersion(): Record<string, string> {
            return this.apiInfo ? this.apiInfo.version : {};
        }
    },
    methods: {
        ...mapActions([
            "getApiInfo"
        ]),
        ...mapMutations([
            "setErrors"
        ])
    },
    mounted() {
        this.getApiInfo();
    }
});
</script>
