<template>
  <dynamic-form></dynamic-form>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { ParameterGroupMetadata } from "@/types";

export default defineComponent({
    name: "Parameters",
    props: {
        paramGroupMetadata: { type: Array as PropType<ParameterGroupMetadata[]>, required: true }
    }
});
</script>
