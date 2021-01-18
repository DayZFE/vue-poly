<template>
  <input :value="provideRef" @input="change" />
</template>

<script lang="ts">
import { InjectionMapping } from "vue-injection-helper";

export default {
  name: "child-test",

  setup() {
    const provideRef = InjectionMapping<string>(
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
