<template>
  <child-test></child-test>
  <div>{{ showValue }}</div>
</template>

<script lang="ts">
import { computed, provide, ref, watch } from "vue";

import ChildTest from "./ChildTest.vue";

function Test() {
  const test = ref({
    test: {
      test: {
        test: [""],
      },
    },
  });

  return { test };
}

export default {
  name: "App",
  components: { "child-test": ChildTest },
  setup() {
    const testService = Test();

    provide("test", testService);

    watch(testService.test, console.log);

    const showValue = computed(() => testService.test.value.test.test.test[0]);

    return { showValue };
  },
};
</script>
