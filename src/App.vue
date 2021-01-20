<template>
  <child-test></child-test>
  <div>{{ service.test.value.test.test.test[0] }}</div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, watch, watchEffect } from "vue";
import { defineModule, getInjectionToken } from "./injection-helper";
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
    const { innerContext: service, token } = defineModule(testService, "test");
    watch(service.test, console.log, { deep: true });
    return { service };
  },
};
</script>

<style>
</style>