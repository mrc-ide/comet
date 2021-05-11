<template>
  <div>
    <div v-for="paramGroup in readOnlyParamGroups" :key="paramGroup.id">
      <dynamic-form v-if="paramGroup.type == 'dynamicForm'"
                    v-model="paramGroup.config"></dynamic-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent} from "@vue/composition-api";
import {DynamicControlSection, DynamicForm, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import { ParameterGroupMetadata } from "@/types";

interface Props {
    paramGroupMetadata: Array<ParameterGroupMetadata>
}

export default defineComponent({
    name: "Parameters",
    components: {
        DynamicForm
    },
    props: {
        paramGroupMetadata: Object
    },
    setup(props: Props) {
        // Display readonly parameters as collapsible panels //TODO: split this up - getCollapsibleForm as separate method
        const readOnlyParamGroups = computed(() => {
            return props.paramGroupMetadata.map((metadata: ParameterGroupMetadata) => {
                if (metadata.type === "dynamicForm") {
                    const collapsibleSections = (metadata.config as DynamicFormMeta).controlSections
                        .map((section: DynamicControlSection) => {
                            return {
                                ...section,
                                collapsible: true,
                                collapsed: true
                            };
                        });
                    return {
                        ...metadata,
                        config: {
                            controlSections: collapsibleSections
                        }
                    };
                } else {
                    return metadata;
                }
            });
        });

        return { readOnlyParamGroups };
    }
});
</script>
