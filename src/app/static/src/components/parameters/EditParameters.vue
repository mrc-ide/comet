<template>
<div>
  <modal :open="open">
    <dynamic-form
      v-if="open"
      ref="form"
      v-model="formMeta"
      :include-submit-button="false"
      @submit="formSubmitted"
      @validate="formValidated"
    ></dynamic-form>
    <template v-slot:footer>
      <button class="btn btn-action"
              :disabled="!valid"
              @click="updateParameters">OK</button>
      <button class="btn btn-secondary"
              @click="cancel">Cancel</button>
    </template>
  </modal>
</div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    Ref,
    ref
} from "@vue/composition-api";
import { DynamicForm, DynamicFormMeta, DynamicFormData } from "@reside-ic/vue-dynamic-form";
import Modal from "@/components/Modal.vue";
import { ParameterGroupMetadata } from "@/types";

interface Props {
    open: boolean;
    paramGroup: ParameterGroupMetadata
}

export default defineComponent({
    name: "EditParameters",
    props: {
        open: Boolean,
        paramGroup: Object
    },
    components: {
        Modal,
        DynamicForm
    },
    setup(props: Props, context) {
        const form: Ref<HTMLFormElement | null> = ref(null);
        const formMetaInternal: Ref<DynamicFormMeta | null> = ref(null);
        const valid = ref(false);

        const formMeta = computed({
            get: () => {
                return formMetaInternal.value || props.paramGroup.config as DynamicFormMeta;
            },
            set: (newValue) => {
                // Edits to the form are provisional until submitted (may be cancelled) -
                // keep updated metadata but do not emit updated event until submission
                formMetaInternal.value = newValue;
            }
        });

        function updateParameters() {
            (form.value as HTMLFormElement).submit();
        }

        function cancel() {
            context.emit("cancel");
            formMetaInternal.value = null;
        }

        function formValidated(formValid: boolean) {
            valid.value = formValid;
        }

        function formSubmitted(newValues: DynamicFormData) {
            if (formMetaInternal.value) {
                const newParamGroup = { ...props.paramGroup, config: formMetaInternal.value };
                context.emit("update", newParamGroup, newValues);
                formMetaInternal.value = null; // update from prop on next open
            } else {
                cancel();
            }
        }

        return {
            form,
            formMetaInternal,
            formMeta,
            valid,
            cancel,
            updateParameters,
            formValidated,
            formSubmitted
        };
    }
});
</script>
