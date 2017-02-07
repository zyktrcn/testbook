/// <reference path="../tabs/wilddog.d.ts" />
import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {BookDetails} from './bookdetails';
import {SearchPage} from './search';
import {CreatePage} from './create';
import {Wilddog} from 'wilddog';

@Component({
    templateUrl: 'home.html'
})
export class HomePage {

    private bookList:any;
    private book:any;

    constructor(private navCtrl:NavController, private modalCtrl:ModalController) {

        this.book = {};
        this.book.bookName = "";

    }

    ionViewWillEnter() {
        this.bookList = [];
        var config = {
            syncURL: "https://plant-book.wilddogio.com/",
        };
        Wilddog.initializeApp(config);
        var ref = Wilddog.sync().ref("books");
        ref.on("value",function(snapshot){
            snapshot.forEach(function(snap){
                this.bookList.push(snap.val());
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
