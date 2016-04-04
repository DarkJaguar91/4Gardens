import {Component, OnInit} from "angular2/core";
import {HTTP_PROVIDERS}    from 'angular2/http';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, Router} from "angular2/router";
import {HomeComponent} from "./home.component";
import {TypeService} from "../service/TypeService";
import {Type} from "../obj/type";
import {ProductsComponent} from "./products.component";

@Component({
    selector: 'my-app',
    templateUrl: 'app/view/app.component.html',
    styleUrls: ['app/css/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        TypeService
    ]
})
@RouteConfig([
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent,
        useAsDefault: true
    },
    {
        path: '/product/:id',
        name: 'Products',
        component: ProductsComponent
    },
])
export class AppComponent implements OnInit {
    types:Type[];

    constructor(private _router:Router, private _typeService: TypeService) {}

    ngOnInit():any {
        this._typeService.getTypes().subscribe(
            types => this.types = types,
            error => console.log(error)
        )
    }

    gotoProduct(type: Type) {
        let link = ['Products', { id: type.id }];
        this._router.navigate(link);
    }
}
