(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "vue", "./App.vue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const vue_1 = require("vue");
    const App_vue_1 = require("./App.vue");
    vue_1.createApp(App_vue_1.default).mount("#app");
});
//# sourceMappingURL=main.js.map