<template>
  <div class="aria-widget-slider">
    <div ref="rail" class="rail" style="width: 300px;">
      <img v-for="(value, index) in values" id="minPriceHotel"
           src="https://i.pinimg.com/564x/4e/dc/b4/4edcb460a940ff726549077935f57168.jpg"
           width="40"
           height="40"
           role="slider"
           tabindex="0"
           :left="sliderPosition(value)"
           class="min thumb"
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
</template>

<script lang="ts">
    import {computed, Ref, ref} from "@vue/composition-api";

export default {
    name: "EditPhases",
    setup() {
        const rail = ref(null);
        const railWidth = () => {
            return (rail.value as any).clientWidth;
        };

        const values = [ref(25), ref(75)];
        const movingSlider: Ref<number | null> = ref(null)
        const min = 0;
        const max = 100;

        const sliderPosition = (value: number) => {
            const percentPos = (value / (max - min)) * 100;
            return `${percentPos}%`;
        };

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

        const mouseMove = (index: number, event: any) => {
            if (movingSlider.value === index) {
                console.log("offset: " + event.offsetX)
                console.log("rail width: " + railWidth())

                event.preventDefault();
                event.stopPropagation();
            }
        };

        const mouseDown = (index: number, event: any) => {
            console.log("move start offset: " + event.offsetX)
            movingSlider.value = index;
            event.preventDefault();
            event.stopPropagation();
        };

        const mouseUp = () => {
          movingSlider.value = null;
        };

        return {
            values,
            min,
            max,
            movingSlider,
            rail,
            railWidth,
            sliderPosition,
            sliderMin,
            sliderMax,
            mouseMove,
            mouseDown,
            mouseUp
        };
    }
};
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
height: 4px;
float: left;
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
</style>
