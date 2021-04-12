<template>
  <div class="about">
    <h1>{{ heading }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'About',
  props: {
    heading: {
      type: String,
      default: 'This is an about page',
    },
  },
});
</script>
