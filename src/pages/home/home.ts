import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {BookDetails} from './bookdetails';
import {SearchPage} from './search';
import {CreatePage} from './create';
import wilddog from 'wilddog';

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

  ionViewWillEnter() {
    var booklist:any[] = [];
    var syncConfig = {
      syncURL: "https://plant-book.wilddogio.com/"
    };
    wilddog.initializeApp(syncConfig);
    var ref = wilddog.sync().ref("books");
    ref.on("value", function (snapshot) {
      snapshot.forEach(function (snap) {
        booklist.push(snap.val());
      });
    });
    console.log(booklist);
    this.bookList = booklist;
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
