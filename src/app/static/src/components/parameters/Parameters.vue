<template>
  <div>
    <div id="countries" class="mb-3">
      <h3>Country</h3>
      <select id="select-country" v-model="selectedCountry" class="form-control">
        <option v-for="country in countries" :value="country.code">{{country.name}}</option>
      </select>
    </div>
    <div v-for="paramGroup in paramGroupMetadata" :key="paramGroup.id">
      <div>
        <collapsible class="collapsible mt-2" :initial-open="false" :heading="paramGroup.label">
          <div class="parameter-panel">
            <div v-if="paramGroup.type === 'dynamicForm'" class="standard-parameters">
              <dynamic-form v-model="paramGroup.config"
                          :readonly="true"></dynamic-form>
              <button class="btn btn-action float-right mb-3 mr-3"
                      @click="editParameters(paramGroup.id)">Edit</button>
              <span class="clearfix"></span>
            </div>
            <div v-if="paramGroup.type === 'rt'">
              <phases
                :phases="paramGroup.config"
                :forecastEnd="forecastEnd"
                :forecastStart="forecastStart"
                class="mt-2"
              ></phases>
              <button class="btn btn-action float-right mb-3 mr-3"
                      @click="editPhases(paramGroup.id)">Edit</button>
              <span class="clearfix"></span>
            </div>
          </div>
        </collapsible>
      </div>
    </div>
    <edit-parameters
      v-if="editParamGroup && editParamGroup.type === 'dynamicForm'"
      class="edit-parameters"
      :open="paramsModalOpen"
      :paramGroup="editParamGroup"
      @cancel="closeModal"
      @update="updateParameters"
    ></edit-parameters>
    <edit-phases
      v-if="editParamGroup && editParamGroup.type === 'rt'"
      class="edit-parameters"
      :open="phasesModalOpen"
      :forecastStart="forecastStart"
      :forecastEnd="forecastEnd"
      :paramGroup="editParamGroup"
      @cancel="closePhases"
      @update="updatePhases"></edit-phases>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@vue/composition-api";
import {
    DynamicForm,
    DynamicFormData
} from "@reside-ic/vue-dynamic-form";
import {Country, Data, ParameterGroupMetadata, Rt} from "@/types";
import Collapsible from "@/components/Collapsible.vue";
import EditParameters from "./EditParameters.vue";
import Phases from "./Phases.vue";
import EditPhases from "./EditPhases.vue";

interface Props {
    paramGroupMetadata: ParameterGroupMetadata[]
    paramValues: Data
    forecastStart: Date
    forecastEnd: Date
    countries: Country[]
}

export default defineComponent({
    name: "Parameters",
    components: {
        DynamicForm,
        EditParameters,
        EditPhases,
        Collapsible,
        Phases
    },
    props: {
        paramGroupMetadata: Array,
        paramValues: Object,
        forecastStart: Date,
        forecastEnd: Date,
        countries: Array
    },
    setup(props: Props, context) {
        const paramsModalOpen = ref(false);
        const phasesModalOpen = ref(false);
        const editParamGroupId = ref("");

        const editParamGroup = computed(() => {
            return props.paramGroupMetadata.find((g) => g.id === editParamGroupId.value);
        });

        const selectedCountry = computed({
            get: () => {
                return props.paramValues.region as string;
            },
            set: (value: string) => {
                context.emit("updateCountry", value);
            }
        });

        function editParameters(paramGroupId: string) {
            editParamGroupId.value = paramGroupId;
            paramsModalOpen.value = true;
        }

        function editPhases(paramGroupId: string) {
            editParamGroupId.value = paramGroupId;
            phasesModalOpen.value = true;
        }

        function closeModal() {
            paramsModalOpen.value = false;
            editParamGroupId.value = "";
        }

        function closePhases() {
            phasesModalOpen.value = false;
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

        function updatePhases(newPhases: Rt[]) {
            const groupId = editParamGroupId.value;
            closePhases();
            const idx = props.paramGroupMetadata.findIndex((g) => g.id === groupId);
            const newMetadata = [...props.paramGroupMetadata];
            newMetadata[idx] = { ...newMetadata[idx], config: newPhases };
            context.emit("updateMetadata", newMetadata);

            const newParamValues = { ...props.paramValues };
            newParamValues[groupId] = newPhases;
            context.emit("updateValues", newParamValues);
        }

        return {
            selectedCountry,
            paramsModalOpen,
            phasesModalOpen,
            editParamGroupId,
            editParamGroup,
            editParameters,
            editPhases,
            closeModal,
            closePhases,
            updateParameters,
            updatePhases
        };
    }
});
</script>
