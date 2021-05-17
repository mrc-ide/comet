<template>
  <div>
    <h3 @click="toggleOpen" class="cursor-pointer">
      {{heading}}
      <component style="vertical-align: initial"
                 :is="chevronComponent"></component>
    </h3>
    <b-collapse v-model="open">
      <slot></slot>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ChevronDownIcon, ChevronUpIcon } from "vue-feather-icons";
import { BCollapse } from "bootstrap-vue";

interface Methods {
    toggleOpen: () => void
}

interface Props {
    initialOpen: boolean,
    heading: string
}

interface Data {
    open: boolean
}

export default Vue.extend<Data, Methods, {}, Props>({
    name: "DynamicFormControlSection",
    data() {
        return {
            open: this.initialOpen
        };
    },
    props: {
        initialOpen: Boolean,
        heading: String
    },
    computed: {
        chevronComponent() {
            if (this.open) {
                return "chevron-up-icon"
            }
            return "chevron-down-icon"
        }
    },
    methods: {
        toggleOpen() {
            this.open = !this.open;
        }
    },
    components: {
        ChevronDownIcon,
        ChevronUpIcon,
        BCollapse
    }
});
</script>
