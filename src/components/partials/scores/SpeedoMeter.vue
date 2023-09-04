<script>
import Gauge from '@chrisheanan/vue-gauge';

export default {
  components: {
    Gauge
  },
  data() {
    return {
      exampleValue: 35
    };
  }
};
</script>

<template>
    <gauge
        heading="A title goes here"
        :min="0"
        :max="100"
        :value="exampleValue"
    />
</template>