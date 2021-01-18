<template>
  <child-test></child-test>
  <div>{{ testService.test.value.test.test.test[0] }}</div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, watch, watchEffect } from "vue";
import { getInjectionToken } from "./injection-helper";
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
    return { testService };
  },
};
</script>

<style>
</style>