/**
 * Created by bjtal on 2016/04/03.
 */
System.register(['angular2/core', 'angular2/http', 'rxjs/Observable'], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1;
    var TypeService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            TypeService = (function () {
                function TypeService(http) {
                    this.http = http;
                }
                TypeService.prototype.getTypes = function () {
                    var _this = this;
                    if (this.types) {
                        return Observable_1.Observable.create(function (observable) {
                            observable.next(_this.types);
                            observable.complete();
                        });
                    }
                    else
                        return this.http.get('http://4gardens/rest/products')
                            .map(function (res) { return res.json(); })
                            .do(function (data) {
                            _this.types = data;
                        })
                            .catch(this.handleError);
                };
                TypeService.prototype.getType = function (id) {
                    var _this = this;
                    return Observable_1.Observable.create(function (observer) {
                        _this.getTypes().subscribe(function (data) {
                            observer.next(data.filter(function (type) { return type.id === id; })[0]);
                            observer.complete();
                        }, function (error) {
                            observer.error(error);
                            observer.complete();
                        });
                    });
                };
                TypeService.prototype.handleError = function (error) {
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                TypeService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], TypeService);
                return TypeService;
            }());
            exports_1("TypeService", TypeService);
        }
    }
});
//# sourceMappingURL=TypeService.js.map