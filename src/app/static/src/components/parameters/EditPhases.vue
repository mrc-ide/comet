<template>
  <div>
    <modal :open="open">
      <div class="aria-widget-slider" @mouseup="mouseUp" @mousemove="mouseMove">
        <div ref="rail" class="rail">
          <div v-for="(value, index) in values" :id="`slider-${index}`"
               :key="index"
               role="slider"
               tabindex="0"
               :style="`left:${sliderPosition(value)}px;`"
               class="slider"
               :aria-valuemin="sliderMin(index)"
               :aria-valuenow="value"
               aria-valuetext="$100"
               :aria-valuemax="sliderMax(index)"
               aria-label="Hotel Minimum Price"
               @mousemove="mouseMove(index, $event)"
               @mousedown="mouseDown(index, $event)"
               @mouseup="mouseUp">
          </div>
        </div>
        <p  v-for="(value, index) in values" :key="index">value {{index}}: {{value.value}}</p>
        <p>Moving slider: {{movingSlider && movingSlider.value}}</p>
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
import {computed, Ref, ref, defineComponent} from "@vue/composition-api";
import Modal from "@/components/Modal.vue";

interface Props {
    open: boolean;
}

export default defineComponent({
    name: "EditPhases",
    components: {
        Modal
    },
    props: {
        open: Boolean
    },
    setup(props: Props, context) {
        const rail = ref(null);
        const railWidth = () => {
            return rail.value ? (rail.value as any).clientWidth : 0; //TODO: sort this out
        };

        const values = [ref(25), ref(75)];
        const movingSlider: Ref<number | null> = ref(null);
        const moveStartOffset: Ref<number | null> = ref(null);
        const min = 0;
        const max = 100;

        const valueRange = max - min;

        const sliderMin = (index: number) => {
            if (index === 0) {
                return min;
            } else {
                return values[index - 1].value + 1;
            }
        };

        const sliderMax = (index: number) => {
            if (index === (values.length - 1)) {
                return max;
            } else {
                return values[index + 1].value - 1;
            }
        };

        const limitSliderValue = (index: number, value: number) => {
            const result = Math.max(sliderMin(index), value);
            return Math.min(sliderMax(index), result);
        };

        const mouseDown = (index: number, event: any) => {
            // console.log("move start offset: " + event.offsetX)
            movingSlider.value = index;
            moveStartOffset.value = event.offsetX;
            event.preventDefault();
            event.stopPropagation();
        };

        const mouseMove = (index: number, event: any) => {
            if (movingSlider.value === index) {
                // console.log("offset: " + event.offsetX);
                // console.log("rail width: " + railWidth());

                const offsetDiff = event.offsetX - (moveStartOffset.value || 0); //TODO deal with more nicely
                const diffAsRangeFraction = offsetDiff / railWidth();
                const valueDiff = valueRange * diffAsRangeFraction;
                const oldValue = values[index].value;
                const newValue = limitSliderValue(index, oldValue + valueDiff);
                // console.log(`oldValue: ${oldValue} newValue: ${newValue}`)
                values[index].value = newValue;



                event.preventDefault();
                event.stopPropagation();
            }
        };

        const mouseUp = () => {
            movingSlider.value = null;
            moveStartOffset.value = null;
        };

        const sliderPosition = (value: Ref<number>) => {
            const pos = (value.value / (max - min)) * railWidth();
            // console.log("width:" + railWidth())
            // console.log("value:" + JSON.stringify(value));
            // console.log("value type: " + typeof value)
            // console.log("range:" + (max - min))
            // console.log("pos: "+ pos);
            return pos;
        };

        function cancel() {
            context.emit("cancel");
        }

        function updatePhases() {
            //TODO!!
        }

        return {
            values,
            min,
            max,
            valueRange,
            movingSlider,
            moveStartOffset,
            rail,
            railWidth,
            sliderPosition,
            sliderMin,
            sliderMax,
            limitSliderValue,
            mouseMove,
            mouseDown,
            mouseUp,
            cancel,
            updatePhases
        };
    }
});
</script>
<style lang="scss">
/* CSS Document */

div.aria-widget-slider {
clear: both;
padding-top: 0.5em;
padding-bottom: 1em;
}

div.rail-label {
padding-right: 0.5em;
text-align: right;
float: left;
width: 4em;
position: relative;
top: -0.5em;
}

div.rail-label.max {
padding-left: 0.5em;
text-align: left;
}

div.aria-widget-slider .rail {
background-color: #eee;
border: 1px solid #888;
position: relative;
  position: relative;
  height: 34px;
  width: 100%;
}

div.aria-widget-slider img[role="slider"] {
position: absolute;
padding: 0;
margin: 0;
top: -10px;
}

div.aria-widget-slider img[role="slider"].focus,
div.aria-widget-slider img[role="slider"]:hover {
outline-color: rgb(140, 203, 242);
outline-style: solid;
outline-width: 2px;
outline-offset: 2px;
}

div.aria-widget-slider .rail.focus {
background-color: #aaa;
}

div.slider {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 2px;
  background-color: #0074D9;
}
</style>
