<template>
  <child-test></child-test>
  <div>{{ service.test.value.test.test.test[0] }}</div>
  <input v-model="service.test.value.test.test.test[0]" />
  <button @click="service.change">change</button>
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
  const change = () => {
    console.log("sdfsdfsdf");
    test.value.test.test.test[0] = "changed";
  };
  return { test, change };
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