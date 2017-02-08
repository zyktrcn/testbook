import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {BookDetails} from '../home/bookdetails';
import {BookEdit} from '../about/edit';
import {UserAttend} from '../about/attend';
import {UserBuild} from '../about/build';
import wilddog from 'wilddog';

@Component({
    templateUrl: 'about.html'
})
export class AboutPage {

    private userAttendList:any;
    private userBuildList:any;

    constructor(private navCtrl:NavController, private toastCtrl: ToastController) {
        var config = {
              authDomain: "testbookapp.wilddog.com"
        };
        wilddog.initializeApp(config);
    }

    listBook(type, bookList) {
        var userref = new Wilddog("https://plant-book.wilddogio.com");
        var authData = userref.getAuth();
        if (authData) {
            var bookref = new Wilddog("https://plant-book.wilddogio.com/books");
            bookref.orderByChild(type).equalTo(authData.uid).limitToLast(3).once("value", (snapshot) => {
                snapshot.forEach((data) => {
                    console.log(data.key());
                    console.log(data.val());
                    bookList.push(data.val());
                });
            });
        } else {
            // 用户未登录
            var noLoginToast = this.toastCtrl.create({
                message: '用户尚未登录,请先登录!',
                duration: 2000
            });
            noLoginToast.present();
        }
    }

    ionViewWillEnter(){
    }

    bookDetailClick(event, userAttend) {
        this.navCtrl.push(BookDetails, {book: userAttend});
    }

    userAttendMore(event) {
        this.navCtrl.push(UserAttend);
    }

    bookDetailEdit(event, userBuild) {
        this.navCtrl.push(BookEdit, {book: userBuild});
    }

    userBuildMore(event) {
        this.navCtrl.push(UserBuild);
    }
}
