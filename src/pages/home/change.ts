import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({
    templateUrl: 'change.html',
    styleUrls: ['/pages/home/change.scss']
})
export class ChangePage {
    bookList;

    constructor(private navCtrl:NavController, private viewCtrl:ViewController) {
        this.bookList = {};
        this.bookListGet();
    }

    bookListGet() {
    }

    bookListClear() {
    }

    cancel() {
        this.bookListClear();
        this.viewCtrl.dismiss();
    }
}
