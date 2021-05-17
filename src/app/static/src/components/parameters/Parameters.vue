<template>
  <div>
    <div v-for="paramGroup in paramGroupMetadata" :key="paramGroup.id">
      <div v-if="paramGroup.type == 'dynamicForm'" class="clearfix">
        <collapsible class="collapsible" :initial-open="false" :heading="paramGroup.label">
          <dynamic-form v-if="paramGroup.type == 'dynamicForm'"
                      v-model="paramGroup.config"
                      :readonly="true"></dynamic-form>
          <button class="btn btn-action float-right mb-3"
                  @click="editParameters(paramGroup.id)">Edit</button>
        </collapsible>
      </div>
    </div>
    <edit-parameters
      :open="modalOpen"
      :paramGroup="editParamGroup"
      @cancel="closeModal"
      @update="updateParameters"
    ></edit-parameters>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@vue/composition-api";
import {
    DynamicControlSection,
    DynamicForm,
    DynamicFormData,
    DynamicFormMeta
} from "@reside-ic/vue-dynamic-form";
import { Data, ParameterGroupMetadata } from "@/types";
import EditParameters from "./EditParameters.vue";
import Collapsible from "@/components/Collapsible.vue";

interface Props {
    paramGroupMetadata: Array<ParameterGroupMetadata>
    paramValues: Data
}

export default defineComponent({
    name: "Parameters",
    components: {
        DynamicForm,
        EditParameters,
        Collapsible
    },
    props: {
        paramGroupMetadata: Array,
        paramValues: Object
    },
    setup(props: Props, context) {
        // Display readonly parameters as collapsible panels
        /*const collapseSections = (config: DynamicFormMeta) => {
            return config.controlSections.map((section: DynamicControlSection) => {
                return {
                    ...section,
                    collapsible: true,
                    collapsed: true
                };
            });
        };

        const readOnlyParamGroups = computed(() => {
            return props.paramGroupMetadata.map((metadata: ParameterGroupMetadata) => {
                if (metadata.type === "dynamicForm") {
                    const controlSections = collapseSections(metadata.config as DynamicFormMeta);
                    return {
                        ...metadata,
                        config: {
                            controlSections
                        }
                    };
                }
                return metadata;
            });
        });*/

        const modalOpen = ref(false);
        const editParamGroupId = ref("");

        const editParamGroup = computed(() => {
            return props.paramGroupMetadata.find((g) => g.id === editParamGroupId.value);
        });

        function editParameters(paramGroupId: string) {
            editParamGroupId.value = paramGroupId;
            modalOpen.value = true;
        }

        function closeModal() {
            modalOpen.value = false;
            editParamGroupId.value = "";
        }

        function updateParameters(
            newParamGroup: ParameterGroupMetadata,
            newValues: DynamicFormData
        ) {
            closeModal();

            const groupId = newParamGroup.id;
            const idx = props.paramGroupMetadata.findIndex((g) => g.id === groupId);
            const newMetadata = [...props.paramGroupMetadata];
            newMetadata[idx] = newParamGroup;
            context.emit("updateMetadata", newMetadata);

            const newParamValues = { ...props.paramValues };
            // Retain any values which are not currently editable e.g. vaccination/future
            newParamValues[groupId] = {
                ...(props.paramValues[groupId] as Record<string, unknown>),
                ...newValues
            };
            context.emit("updateValues", newParamValues);
        }

        return {
            //readOnlyParamGroups,
            modalOpen,
            editParamGroupId,
            editParamGroup,
            editParameters,
            closeModal,
            updateParameters
        };
    }
});
</script>
