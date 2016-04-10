System.register(['angular2/platform/browser', './components/gardens.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, gardens_component_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (gardens_component_1_1) {
                gardens_component_1 = gardens_component_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(gardens_component_1.GardensComponent);
        }
    }
});
//# sourceMappingURL=main.js.map