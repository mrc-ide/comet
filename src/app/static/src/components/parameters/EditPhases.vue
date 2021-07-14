<template>
  <div>
    <modal class="phase-modal" :open="open">
      <h3>Edit {{paramGroup && paramGroup.label}}</h3>
      <div class="mb-3">
        Click on a Phase to drag it to a new start date. Click on timeline to add a new Phase.
        <div id="rt-range-text"
             class="d-inline-block"
             :class="rtTextValidationClass()">
            Rt values must be between {{rtMin}} and {{rtMax}}.
        </div>
      </div>
      <div class="phase-editor" @mouseup="mouseUp">
        <div class="phases-container">
          <div ref="rail" class="rail"
               @click="addPhase">
            <div v-for="(value, index) in sliderValues"
                 :id="`slider-${index}-${sliderUpdateKeys[index]}`"
                 :key="index"
                 role="slider"
                 :tabindex="index"
                 :style="{ left:`${sliderPosition(value)}%`, zIndex: value.zIndex }"
                 class="slider"
                 :class="phaseClassFromIndex(index+1)"
                 :aria-valuemin="sliderMin(index)"
                 :aria-valuenow="value.daysFromStart"
                 :aria-valuetext="displayPhases[index].start"
                 :aria-valuemax="sliderMax(index)"
                 :aria-label="`Phase ${displayPhases[index].index}`"
                 @mousemove="mouseMove(index, $event)"
                 @mousedown="mouseDown(index, $event)"
                 @mouseup="mouseUp"
                 @click.stop="">
              <div class="slider-spike" :class="phaseClassFromIndex(index+1)"></div>
              <div class="slider-text">
                <div class="phase-dates disable-select">
                  <span class="phase-label font-weight-bold">
                    Phase {{displayPhases[index].index}}
                  </span>
                  <span class="phase-days">
                    ({{displayPhases[index].days}} day{{displayPhases[index].days > 1 ? "s" : ""}})
                  </span>
                  <br/>
                  <div class="phase-start">Start: {{displayPhases[index].start}}</div>
                  <div class="phase-end">End: {{displayPhases[index].end}}</div>
                </div>
                <div class="phase-rt">Rt:
                  <input
                    :id="`phase-rt-${index}`"
                    class="phase-rt-input"
                    :class="rtInputValidationClass(index)"
                    type="number"
                    :min="rtMin"
                    :max="rtMax"
                    v-model="value.rt"
                    step="0.01"
                    @change="updateRt(index, $event)"
                    @mousedown.stop=""
                    @click="bringSliderToFront(index)">
                </div>
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

        const rtMin = 0.01;
        const rtMax = 4;
        const animateRtValidationIndex: Ref<number | null> = ref(null);

        // We need to force re-render of Rt input if user enters invalid value - get vue to do this
        // by updating key of parent
        const sliderUpdateKeys = ref((props.paramGroup.config as Rt[]).map(() => 0));

        const railWidth = () => {
            return rail.value ? (rail.value as HTMLElement).clientWidth : 0;
        };

        const sliderValues: Ref<SliderValue[]> = ref((props.paramGroup.config as Rt[])
            .map((phase) => {
                return {
                    daysFromStart: daysBetween(props.forecastStart, dayjs(phase.start)),
                    rt: phase.value,
                    zIndex: 99
                };
            }));

        // Phases computed from the slider values
        const phases: Ref<Rt[]> = computed(() => {
            return sliderValues.value.map((sv) => {
                return {
                    start: dayjs(props.forecastStart).add(sv.daysFromStart, "day").format("YYYY-MM-DD"),
                    value: sv.rt
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
            return index === 0 ? 0 : sliderValues.value[index - 1].daysFromStart + 1;
        };

        const sliderMax = (index: number) => {
            if (index === (sliderValues.value.length - 1)) {
                return totalDays - 1;
            }
            return sliderValues.value[index + 1].daysFromStart - 1;
        };

        const limitSliderValue = (index: number, value: number) => {
            const result = Math.max(sliderMin(index), value);
            return Math.round(Math.min(sliderMax(index), result));
        };

        const bringSliderToFront = (index: number) => {
            sliderValues.value.forEach((sv: SliderValue, arrIdx: number) => {
                // eslint-disable-next-line no-param-reassign
                sv.zIndex = (arrIdx === index) ? 100 : 99;
            });
        };

        const mouseDown = (index: number, event: MouseEvent) => {
            movingSlider.value = index;
            moveStartOffset.value = event.offsetX;

            bringSliderToFront(index);
        };

        const sliderValueAsDays = (sliderValue: number) => {
            const valueAsRangeFraction = sliderValue / railWidth();
            return totalDays * valueAsRangeFraction;
        };

        const mouseMove = (index: number, event: MouseEvent) => {
            if (movingSlider.value === index && moveStartOffset.value !== null) {
                const offsetDiff = event.offsetX - moveStartOffset.value;
                const valueDiff = sliderValueAsDays(offsetDiff);
                const oldValue = sliderValues.value[index].daysFromStart;
                const newValue = limitSliderValue(index, oldValue + valueDiff);
                sliderValues.value[index].daysFromStart = newValue;
            }
        };

        const mouseUp = () => {
            movingSlider.value = null;
            moveStartOffset.value = null;
        };

        const sliderPosition = (value: SliderValue) => {
            return (value.daysFromStart / totalDays) * 100;
        };

        const showRtValidationAnimation = (index: number) => {
            animateRtValidationIndex.value = index;
            setTimeout(() => {
                animateRtValidationIndex.value = null;
            }, 1000);
        };

        const animateClass = "animate__animated animate__headShake";
        const rtTextValidationClass = () => {
            return animateRtValidationIndex.value !== null ? animateClass : "";
        };

        const rtInputValidationClass = (index: number) => {
            return animateRtValidationIndex.value === index ? animateClass : "";
        };

        const updateRt = (index: number, event: Event) => {
            const target = event.target as HTMLInputElement;
            let value = parseFloat(target.value);
            if (Number.isNaN(value)) {
                value = 1.0;
            } else {
                value = Math.round(value * 100) / 100;
                if (value < rtMin) {
                    value = rtMin;
                    showRtValidationAnimation(index);
                }
                if (value > rtMax) {
                    value = rtMax;
                    showRtValidationAnimation(index);
                }
            }
            sliderValues.value[index].rt = value;
            sliderUpdateKeys.value[index] += 1;
        };

        const addPhase = (event: MouseEvent) => {
            const newPhaseStart = Math.round(sliderValueAsDays(event.offsetX));
            const newStarts = [
                ...sliderValues.value.map((slider) => slider.daysFromStart),
                newPhaseStart
            ].sort((a, b) => a - b);
            const newPhaseIdx = newStarts.indexOf(newPhaseStart);

            sliderUpdateKeys.value.splice(newPhaseIdx, 0, 0);

            sliderValues.value.splice(newPhaseIdx, 0, {
                daysFromStart: newPhaseStart,
                rt: 1.0,
                zIndex: 99
            });
        };

        const cancel = () => {
            context.emit("cancel");
        };

        const updatePhases = () => {
            context.emit("update", phases.value);
        };

        return {
            rail,
            rtMin,
            rtMax,
            animateRtValidationIndex,
            sliderValues,
            sliderUpdateKeys,
            phases,
            displayPhases,
            sliderPosition,
            sliderMin,
            sliderMax,
            bringSliderToFront,
            rtTextValidationClass,
            rtInputValidationClass,
            mouseMove,
            mouseDown,
            mouseUp,
            updateRt,
            addPhase,
            cancel,
            updatePhases,
            phaseClassFromIndex
        };
    }
});
</script>
<style lang="scss">
@import '../../../node_modules/animate.css/animate.css';

.phase-modal {
  @media (min-width: 1000px) {
    .modal-dialog-centered {
      max-width: 908px;
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

        .disable-select {
          user-select: none; /* supported by Chrome and Opera */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
        }

        .phase-rt-input {
          width: 4rem;
        }
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
