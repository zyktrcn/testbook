import {Component} from '@angular/core';
import {NavController, ViewController, ToastController} from 'ionic-angular';
import {SearchBookPage} from '../home/searchbook';
import wilddog from 'wilddog';

@Component({
    templateUrl: 'search.html'
})
export class SearchPage {
    private place;
    private classify;
    private change;
    private key;

    constructor(private navCtrl:NavController, private viewCtrl:ViewController, private toastCtrl:ToastController) {
        this.place = '';
        this.classify = '';
        this.change = '';
    }

    ionViewWillEnter() {
        var syncConfig = {
            syncURL : 'https://plant-book.wilddogio.com'
        };
        wilddog.initializeApp(syncConfig);
    }

    //搜索栏内容
    getItems(event) {
        var val = event.target.value;
        console.log(val);

        this.key = val;
    }

    //搜索功能
    search() {
        var searchlist = [];
        var bookref = wilddog.sync().ref('books');
        if(this.key != ''){
            bookref.orderByChild('bookname').startAt(this.key).endAt(this.key + '~').once("value", (snapshot) => {
                snapshot.forEach((data) => {
                    console.log(data.key());
                    console.log(data.val());

                    if (data.val().place == this.place || this.place == '') {
                        if (data.val().classify == this.classify || this.classify == '') {
                            if (data.val().change == this.change || this.change == '') {
                                searchlist.push(data.val());
                            }
                        }
                    };


                });
            });
            console.log(searchlist);
            this.navCtrl.push(SearchBookPage,searchlist);
        }else if(this.place != ''){
            bookref.orderByChild('place').equalTo(this.place).once("value", (snapshot) => {
                snapshot.forEach((data) => {
                    console.log(data.key());
                    console.log(data.val());

                    if (data.val().classify == this.classify || this.classify == '') {
                        if (data.val().change == this.change || this.change == '') {
                            searchlist.push(data.val());
                        }
                    };


                });
            });
            console.log(searchlist);
            this.navCtrl.push(SearchBookPage,searchlist);
        }else if(this.classify != ''){
            bookref.orderByChild('classify').equalTo(this.classify).once("value", (snapshot) => {
                snapshot.forEach((data) => {
                    console.log(data.key());
                    console.log(data.val());


                    if (data.val().change == this.change || this.change == '') {
                        searchlist.push(data.val());
                    };


                });
            });
            console.log(searchlist);
            this.navCtrl.push(SearchBookPage,searchlist);
        }else if(this.change != ''){
            bookref.orderByChild('change').equalTo(this.change).once("value", (snapshot) => {
                snapshot.forEach((data) => {
                    console.log(data.key());
                    console.log(data.val());

                    searchlist.push(data.val());

                });
            });
            console.log(searchlist);
            this.navCtrl.push(SearchBookPage,searchlist);
        }else{
            let searchToast = this.toastCtrl.create({
                message : '搜索选项至少填写一项',
                duration : 2000
            });
            searchToast.present();
        }
    }

    cancel() {
        this.viewCtrl.dismiss();
    }
}
