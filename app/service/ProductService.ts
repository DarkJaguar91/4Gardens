/**
 * Created by bjtal on 2016/04/03.
 */

import {Injectable} from 'angular2/core';
import {Type} from "../obj/type";
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Product} from "../obj/product";

@Injectable()
export class ProductService {
    products:Product[];

    constructor(private http:Http) {
    }

    getProducts():Observable<Product[]> {
        if (this.products) {
            return Observable.create(observable => {
                observable.next(this.products);
                observable.complete();
            });
        } else
            return this.http.get('http://4gardens/rest/products/product')
                .map(res => <Type[]> res.json())
                .do(data => {
                    console.log(data);
                    this.products = data;
                })
                .catch(this.handleError);
    }

    getProductsForType(id:number):Observable<Product[]> {
        return Observable.create(observer => {
            this.getProducts().subscribe(
                data => {
                    observer.next(data.filter(product => product.type === id));
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        })
    }

    private handleError(error:Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}