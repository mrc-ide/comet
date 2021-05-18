<template>
  <div>
    <div v-for="error in errors">
      {{error.detail}}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    name: "Errors",
    props: ["errors"]
});
</script>
