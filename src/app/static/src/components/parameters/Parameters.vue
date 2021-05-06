<template>
  <div v-for="paramGroup in paramGroupMetadata">
    Here's a param group
    <dynamic-form v-if="paramGroup.type == 'dynamicForm'"
                  v-model="paramGroup.config"></dynamic-form>
  </div>>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { DynamicForm } from "@reside-ic/vue3-dynamic-form";
import { ParameterGroupMetadata } from "@/types";

export default defineComponent({
    name: "Parameters",
    components: {
        DynamicForm
    },
    props: {
        paramGroupMetadata: { type: Array as PropType<ParameterGroupMetadata[]>, required: true }
    }
});
</script>
