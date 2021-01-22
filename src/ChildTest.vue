<template>
  <input :value="state" @input="changeValue" />
  <button @click="change">child change</button>
</template>

<script lang="ts">
import { aggregateEvent, aggregateRef } from "./injection-helper";
export default {
  name: "child-test",
  setup() {
    const state = aggregateRef<string>(
      "test",
      ["test", "value", "test", "test", "test", "0"],
      ""
    );
    const change = aggregateEvent("test", ["change"]);
    return {
      change,
      state,
      changeValue(e: any) {
        state.value = e.target.value;
      },
    };
  },
};
</script>

<style>
</style>