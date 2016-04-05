import {Component, OnInit} from "angular2/core";
import {RouteParams} from "angular2/router";
import {ProductService} from "../service/ProductService";
import {Product} from "../obj/product";
import {ProductSearchPipe} from "../pipes/productSearchPipe";

@Component({
    selector: 'products',
    templateUrl: 'app/view/products.component.html',
    providers: [ProductService],
    pipes: [ProductSearchPipe],
    styleUrls: ['app/css/product.component.css']
})
export class ProductsComponent implements OnInit {
    searchText: string = '';
    products:Product[];
    constructor(private _routeParams:RouteParams, private _productService:ProductService) {
    }

    ngOnInit():any {
        this._productService.getProductsForType(<number>this._routeParams.get('id')).subscribe(
            products => this.products = products,
            error => console.log(error)
        )
    }
}
