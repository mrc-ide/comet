<template>
  <div>
    <b-alert v-for="(error, idx) in errors"
         v-bind:key="idx"
         variant="danger"
         show
         dismissible>
      <strong>An error occurred:</strong>
      {{ error.detail || error.error }}
    </b-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { BAlert } from "bootstrap-vue";

export default defineComponent({
    name: "Errors",
    props: ["errors"],
    components: {
        BAlert
    }
});
</script>
