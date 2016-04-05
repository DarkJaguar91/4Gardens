/**
 * Created by bjtal on 2016/04/04.
 */

import {Pipe} from "angular2/core";
import {Product} from "../obj/product";

@Pipe({
    name: "search"
})
export class ProductSearchPipe {
    transform(value:Product[], [search]) {
        if (value) {
            return value.filter(item => {
                return item.price.startsWith(search)
            }
            );
        }
        return value;
    }
}