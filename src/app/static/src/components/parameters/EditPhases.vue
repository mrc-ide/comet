<template>
  <div>
    <modal class="phase-modal" :open="open">
      <h3>Edit {{paramGroup && paramGroup.label}}</h3>
      <p>Click on a Phase to drag it to a new start date.</p>
        <div class="phase-editor" @mouseup="mouseUp">
          <div class="phases-container">
            <div ref="rail" class="rail">
              <div v-for="(value, index) in sliderValues" :id="`slider-${index}`"
                   :key="index"
                   role="slider"
                   :tabindex="index"
                   :style="{ left:`${sliderPosition(value)}%`, zIndex: value.value.zIndex }"
                   class="slider"
                   :class="phaseClassFromIndex(index+1)"
                   :aria-valuemin="sliderMin(index)"
                   :aria-valuenow="value.value.daysFromStart"
                   :aria-valuetext="displayPhases[index].start"
                   :aria-valuemax="sliderMax(index)"
                   :aria-label="`Phase ${displayPhases[index].index}`"
                   @mousemove.stop.prevent="mouseMove(index, $event)"
                   @mousedown.stop.prevent="mouseDown(index, $event)"
                   @mouseup="mouseUp">
                <div class="slider-spike" :class="phaseClassFromIndex(index+1)"></div>
                <div class="slider-text">
                  <span class="phase-label font-weight-bold">
                    Phase {{displayPhases[index].index}}
                  </span>
                  <span class="phase-days">
                    ({{displayPhases[index].days}} day{{displayPhases[index].days > 1 ? "s" : ""}})
                  </span>
                  <br/>
                  <div class="phase-start">Start: {{displayPhases[index].start}}</div>
                  <div class="phase-end">End: {{displayPhases[index].end}}</div>
                  <div class="phase-rt">Rt: {{displayPhases[index].value}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <template v-slot:footer>
        <button class="btn btn-action"
                @click="updatePhases">OK</button>
        <button class="btn btn-secondary"
                @click="cancel">Cancel</button>
      </template>
    </modal>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import {
    computed,
    Ref,
    ref,
    defineComponent
} from "@vue/composition-api";
import Modal from "@/components/Modal.vue";
import { ParameterGroupMetadata, Rt } from "@/types";
import {
    DisplayPhase,
    daysBetween,
    getDisplayPhase,
    phaseClassFromIndex,
    getTotalDays
} from "./phasesUtils";

interface Props {
    open: boolean;
    forecastStart: Date;
    forecastEnd: Date;
    paramGroup: ParameterGroupMetadata
}

interface SliderValue {
    daysFromStart: number;
    rt: number;
    zIndex: number;
}

export default defineComponent({
    name: "EditPhases",
    components: {
        Modal
    },
    props: {
        open: Boolean,
        forecastStart: Date,
        forecastEnd: Date,
        paramGroup: Object
    },
    setup(props: Props, context) {
        const rail: Ref<HTMLElement | null> = ref(null); // ref this element to find its width

        const railWidth = () => {
            return rail.value ? (rail.value as HTMLElement).clientWidth : 0;
        };

        const sliderValues: Ref<SliderValue>[] = (props.paramGroup.config as Rt[]).map((phase) => {
            return ref({
                daysFromStart: daysBetween(props.forecastStart, dayjs(phase.start)),
                rt: phase.value,
                zIndex: 99
            });
        });

        // Phases computed from the slider values
        const phases: Ref<Rt[]> = computed(() => {
            return sliderValues.map((sv) => {
                return {
                    start: dayjs(props.forecastStart).add(sv.value.daysFromStart, "day").format("YYYY-MM-DD"),
                    value: sv.value.rt
                };
            });
        });

        // Display phases computed from the phases
        const displayPhases: Ref<DisplayPhase[]> = computed(() => phases.value.map((rt, idx) => {
            return getDisplayPhase(rt, idx, phases.value, props.forecastEnd);
        }));

        const totalDays = getTotalDays(props.forecastStart, props.forecastEnd);

        const movingSlider: Ref<number | null> = ref(null);
        const moveStartOffset: Ref<number | null> = ref(null);

        const sliderMin = (index: number) => {
            return index === 0 ? 0 : sliderValues[index - 1].value.daysFromStart + 1;
        };

        const sliderMax = (index: number) => {
            if (index === (sliderValues.length - 1)) {
                return totalDays - 1;
            }
            return sliderValues[index + 1].value.daysFromStart - 1;
        };

        const limitSliderValue = (index: number, value: number) => {
            const result = Math.max(sliderMin(index), value);
            return Math.round(Math.min(sliderMax(index), result));
        };

        const mouseDown = (index: number, event: MouseEvent) => {
            movingSlider.value = index;
            moveStartOffset.value = event.offsetX;

            // bring slider to front
            sliderValues.forEach((sv: Ref<SliderValue>, arrIdx: number) => {
                const val = sv.value;
                val.zIndex = (arrIdx === index) ? 100 : 99;
            });
        };

        const mouseMove = (index: number, event: MouseEvent) => {
            if (movingSlider.value === index && moveStartOffset.value !== null) {
                const offsetDiff = event.offsetX - moveStartOffset.value;
                const diffAsRangeFraction = offsetDiff / railWidth();
                const valueDiff = totalDays * diffAsRangeFraction;
                const oldValue = sliderValues[index].value.daysFromStart;
                const newValue = limitSliderValue(index, oldValue + valueDiff);
                sliderValues[index].value.daysFromStart = newValue;
            }
        };

        const mouseUp = () => {
            movingSlider.value = null;
            moveStartOffset.value = null;
        };

        const sliderPosition = (value: Ref<SliderValue>) => {
            return (value.value.daysFromStart / totalDays) * 100;
        };

        const cancel = () => {
            context.emit("cancel");
        };

        const updatePhases = () => {
            context.emit("update", phases.value);
        };

        return {
            rail,
            sliderValues,
            phases,
            displayPhases,
            sliderPosition,
            sliderMin,
            sliderMax,
            mouseMove,
            mouseDown,
            mouseUp,
            cancel,
            updatePhases,
            phaseClassFromIndex
        };
    }
});
</script>
<style lang="scss">
.phase-modal {
  @media (min-width: 1000px) {
    .modal-dialog-centered {
      max-width: 900px;
    }
  }

  .phase-editor {
    font-size: 0.8em;
    padding-left: 5rem;
    padding-right: 5rem;
    .rail {
      border-bottom: 1px solid #ccc;
      position: relative;
      width: 100%;
      height: 13rem;
    }

    .slider {
      position: absolute;
      top: 3rem;
      cursor: pointer;
      height: 7rem;
      width: 9rem;
      margin-left: -4.5rem;

      .slider-spike {
        position: absolute;
        width: 0.4rem;
        top: -3rem;
        left: 4.3rem;
        height: 13rem;
      }

      .slider-text {
        position: absolute;
        padding: 0.5rem;
      }
    }

    .slider.focus,
    .slider:hover {
      outline-color: rgb(140, 203, 242);
      outline-style: solid;
      outline-width: 2px;
      outline-offset: 2px;
    }
  }
}
</style>
