<template>
  <div class="about">
    <h1>{{ heading }}</h1>
    <h2>API versions</h2>
    <p>API Name: {{apiName}}</p>
    <div v-for="(value, key) in apiVersion" :key="key">{{key}}: {{value}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";

export default Vue.extend({
    name: "About",
    props: {
        heading: {
            type: String,
            default: "This is an about page"
        }
    },
    computed: {
        ...mapState([
            "apiInfo"
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
        ])
    },
    mounted() {
        this.getApiInfo();
    }
});
</script>
