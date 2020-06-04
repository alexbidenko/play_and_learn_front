<template>
  <v-sparkline
    :value="values"
    :gradient="gradient"
    :smooth="radius || false"
    :padding="padding"
    :line-width="width"
    :stroke-linecap="lineCap"
    :gradient-direction="gradientDirection"
    :type="type"
    :auto-line-width="autoLineWidth"
    auto-draw
    :show-labels="true"
    :labels="labels"
  ></v-sparkline>
</template>

<script>
    export default {
        props: [
            'values', 'labels'
        ],

        data: () => ({
            width: 2,
            radius: 10,
            padding: 8,
            lineCap: 'round',
            gradient: ['#f72047', '#ffd200', '#1feaea'],
            gradientDirection: 'top',
            type: 'trend',
            autoLineWidth: false,
        }),
    }
</script>

<style scoped>

</style>
