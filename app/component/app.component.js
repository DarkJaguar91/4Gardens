System.register(["angular2/core", 'angular2/http', "angular2/router", "./home.component", "../service/TypeService", "./products.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, router_1, home_component_1, TypeService_1, products_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (home_component_1_1) {
                home_component_1 = home_component_1_1;
            },
            function (TypeService_1_1) {
                TypeService_1 = TypeService_1_1;
            },
            function (products_component_1_1) {
                products_component_1 = products_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_router, _typeService) {
                    this._router = _router;
                    this._typeService = _typeService;
                }
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._typeService.getTypes().subscribe(function (types) { return _this.types = types; }, function (error) { return console.log(error); });
                };
                AppComponent.prototype.gotoProduct = function (type) {
                    var link = ['Products', { id: type.id }];
                    this._router.navigate(link);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: 'app/view/app.component.html',
                        styleUrls: ['app/css/app.component.css'],
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [
                            router_1.ROUTER_PROVIDERS,
                            http_1.HTTP_PROVIDERS,
                            TypeService_1.TypeService
                        ]
                    }),
                    router_1.RouteConfig([
                        {
                            path: '/home',
                            name: 'Home',
                            component: home_component_1.HomeComponent,
                            useAsDefault: true
                        },
                        {
                            path: '/product/:id',
                            name: 'Products',
                            component: products_component_1.ProductsComponent
                        },
                    ]), 
                    __metadata('design:paramtypes', [router_1.Router, TypeService_1.TypeService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map