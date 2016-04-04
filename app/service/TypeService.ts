/**
 * Created by bjtal on 2016/04/03.
 */

import {Injectable} from 'angular2/core';
import {Type} from "../obj/type";
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class TypeService {
    types:Type[];

    constructor(private http:Http) {}

    getTypes() : Observable<Type[]> {
        if (this.types) {
            return Observable.create(observable => {
                observable.next(this.types);
                observable.complete();
            });
        } else
            return this.http.get('http://4gardens/rest/products')
                .map(res => <Type[]> res.json())
                .do(data => {
                    this.types = data;
                })
                .catch(this.handleError);
    }

    getType(id:number) : Observable<Type> {
        return Observable.create(observer => {
            this.getTypes().subscribe(
                data => {
                    observer.next(data.filter(type => type.id === id)[0]);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        })
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}