<template>
  <input :value="provideRef" @input="change" />
</template>

<script lang="ts">
import { watch } from "vue";
import { InjectionMapped } from "./injection-helper";
export default {
  name: "child-test",
  setup() {
    const provideRef = InjectionMapped<string>(
      "test",
      ["test", "value", "test", "test", "test", "0"],
      1
    );
    return {
      provideRef,
      change(e: any) {
        provideRef.value = e.target.value;
      },
    };
  },
};
</script>

<style>
</style>