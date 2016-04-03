import {Component, OnInit} from "angular2/core";
import {Hero} from "./../obj/hero";
import {RouteParams} from "angular2/router";
import {HeroService} from "../service/hero.service";

@Component({
    selector: 'my-hero-detail',
    templateUrl: 'app/view/hero-detail.component.html',
    styleUrls: ['app/css/hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    hero:Hero;

    constructor(private _heroService:HeroService,
                private _routeParams:RouteParams) {
    }

    ngOnInit() {
        let id = +this._routeParams.get('id');
        this._heroService.getHero(id)
            .then(hero => this.hero = hero);
    }

    goBack() {
        window.history.back();
    }
}
