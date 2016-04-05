System.register(["angular2/core", "angular2/router", "../service/ProductService", "../pipes/productSearchPipe"], function(exports_1, context_1) {
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
    var core_1, router_1, ProductService_1, productSearchPipe_1;
    var ProductsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (ProductService_1_1) {
                ProductService_1 = ProductService_1_1;
            },
            function (productSearchPipe_1_1) {
                productSearchPipe_1 = productSearchPipe_1_1;
            }],
        execute: function() {
            ProductsComponent = (function () {
                function ProductsComponent(_routeParams, _productService) {
                    this._routeParams = _routeParams;
                    this._productService = _productService;
                    this.searchText = '';
                }
                ProductsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._productService.getProductsForType(this._routeParams.get('id')).subscribe(function (products) { return _this.products = products; }, function (error) { return console.log(error); });
                };
                ProductsComponent = __decorate([
                    core_1.Component({
                        selector: 'products',
                        templateUrl: 'app/view/products.component.html',
                        providers: [ProductService_1.ProductService],
                        pipes: [productSearchPipe_1.ProductSearchPipe],
                        styleUrls: ['app/css/product.component.css']
                    }), 
                    __metadata('design:paramtypes', [router_1.RouteParams, ProductService_1.ProductService])
                ], ProductsComponent);
                return ProductsComponent;
            }());
            exports_1("ProductsComponent", ProductsComponent);
        }
    }
});
//# sourceMappingURL=products.component.js.map