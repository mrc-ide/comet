<template>
  <div>
    <b-alert v-if="errors.length > 0"
         variant="danger"
         show
         dismissible
         @dismissed="$emit('dismissed')">
      <strong>{{errors.length > 1 ? "Errors occurred:" : "An error occurred:"}}</strong>
      <ul>
        <li v-for="(error, idx) in errors" :key="idx">
          {{ error.detail || error.error }}
        </li>
      </ul>
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
