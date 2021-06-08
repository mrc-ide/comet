<template>
  <div>
    <modal class="phase-modal" :open="open">
      <h3>Edit {{paramGroup && paramGroup.label}}</h3>
      <p>Click on a Phase to drag it to a new start date.</p>
        <div class="phase-editor" @mouseup="mouseUp" @mousemove="mouseMove">
          <div class="phases-container">
            <div ref="rail" class="rail">
              <div v-for="(value, index) in sliderValues" :id="`slider-${index}`"
                   :key="index"
                   role="slider"
                   tabindex="0"
                   :style="`left:${sliderPosition(value)}px;`"
                   class="slider"
                   :class="phaseClassFromIndex(index+1)"
                   :aria-valuemin="sliderMin(index)"
                   :aria-valuenow="value"
                   aria-valuetext="$100"
                   :aria-valuemax="sliderMax(index)"
                   aria-label="Hotel Minimum Price"
                   @mousemove="mouseMove(index, $event)"
                   @mousedown="mouseDown(index, $event)"
                   @mouseup="mouseUp">
                <div class="slider-spike" :class="phaseClassFromIndex(index+1)"></div>
                <div class="slider-text">
                  <span class="font-weight-bold">Phase {{displayPhases[index].index}}</span>
                  ({{displayPhases[index].days}} days) <br/>
                  Start: {{displayPhases[index].start}} <br/>
                  End: {{displayPhases[index].end}} <br/>
                  Rt: {{displayPhases[index].value}} <br/>
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
import {computed, Ref, ref, defineComponent, watch} from "@vue/composition-api";
import Modal from "@/components/Modal.vue";
import {ParameterGroupMetadata, Rt} from "@/types";
import {
    DisplayPhase,
    daysBetween,
    getDisplayPhase,
    phaseClassFromIndex,
    getTotalDays
} from "./phasesUtils";
import dayjs from "dayjs";

interface Props {
    open: boolean;
    forecastStart: Date;
    forecastEnd: Date;
    paramGroup: ParameterGroupMetadata
}

interface SliderValue {
    daysFromStart: number;
    rt: number;
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
        const rail = ref(null); // ref this element to find its width

        const railWidth = () => {
            return rail.value ? (rail.value as any).clientWidth : 0; //TODO: sort this out
        };

        // The values for the sliders - the number of days since forecast start, and the rt
        const sliderValues: Ref<SliderValue>[] = (props.paramGroup.config as Rt[]).map((phase) => {
            return ref({
                daysFromStart: daysBetween(props.forecastStart, dayjs(phase.start)),
                rt: parseFloat(phase.value)
            });
        });

        // Phases computed from the slider values
        const phases = computed(() => {
            return sliderValues.map((sv) => {
                return {
                    start: dayjs(props.forecastStart).add(sv.value.daysFromStart, "day").format("YYYY-MM-DD"),
                    value: sv.value.rt.toString()
                };
            });
        });

        // Display phases computed from the phases
        const displayPhases = computed(() => phases.value.map((rt, idx) => {
            return getDisplayPhase(rt, idx, phases.value, props.forecastEnd);
        }));

        const totalDays = getTotalDays(props.forecastStart, props.forecastEnd);

        const movingSlider: Ref<number | null> = ref(null);
        const moveStartOffset: Ref<number | null> = ref(null);

        const sliderMin = (index: number) => {
            if (index === 0) {
                return 0;
            } else {
                return sliderValues[index - 1].value.daysFromStart + 1;
            }
        };

        const sliderMax = (index: number) => {
            if (index === (sliderValues.length - 1)) {
                return totalDays;
            } else {
                return sliderValues[index + 1].value.daysFromStart - 1;
            }
        };

        const limitSliderValue = (index: number, value: number) => {
            const result = Math.max(sliderMin(index), value);
            return Math.round(Math.min(sliderMax(index), result));
        };

        const mouseDown = (index: number, event: any) => {
            movingSlider.value = index;
            moveStartOffset.value = event.offsetX;
            event.preventDefault();
            event.stopPropagation();
        };

        const mouseMove = (index: number, event: any) => {
            if (movingSlider.value === index) {
                const offsetDiff = event.offsetX - (moveStartOffset.value || 0); //TODO deal with more nicely
                const diffAsRangeFraction = offsetDiff / railWidth();
                const valueDiff = totalDays * diffAsRangeFraction;
                const oldValue = sliderValues[index].value.daysFromStart;
                const newValue = limitSliderValue(index, oldValue + valueDiff);
                sliderValues[index].value.daysFromStart = newValue;

                event.preventDefault();
                event.stopPropagation();
            }
        };

        const mouseUp = () => {
            movingSlider.value = null;
            moveStartOffset.value = null;
        };

        const sliderPosition = (value: Ref<SliderValue>) => {
            return (value.value.daysFromStart / totalDays) * railWidth();
        };

        function cancel() {
            context.emit("cancel");
        }

        function updatePhases() {
            //TODO!!
        }

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
      width: 8rem;
      margin-left: -4rem;

      .slider-spike {
        position: absolute;
        width: 0.4rem;
        top: -3rem;
        left: 3.8rem;
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
