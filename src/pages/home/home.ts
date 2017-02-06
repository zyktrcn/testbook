/// <reference path="../tabs/wilddog.d.ts" />
import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {BookDetails} from './bookdetails';
import {SearchPage} from './search';
import {CreatePage} from './create';
import 'wilddog';

@Component({
    templateUrl: 'home.html'
})
export class HomePage {

    private bookList:any;
    private book:any;

    constructor(private navCtrl:NavController, private modalCtrl:ModalController) {

        this.bookList = [];
        this.book = {};
        this.book.bookName = "";

    }

    onPageWillEnter() {
        this.bookList = [];
        var ref = new Wilddog("https://plant-book.wilddogio.com/books");
        ref.orderByChild("bookname").once("value", (snapshot) => {
            snapshot.forEach((data) => {
                console.log(data.key());
                console.log(data.val());
                this.bookList.push(data.val());
            });
        });
    }

    bookDetailClick(event, book) {
        this.navCtrl.push(BookDetails, {book: book});
    }

    search() {
        let searchModal = this.modalCtrl.create(SearchPage);
        searchModal.present();
    }

    create() {
        let createModal = this.modalCtrl.create(CreatePage);
        createModal.present();
    }

}
