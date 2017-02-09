import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BookDetails} from '../home/bookdetails';
import wilddog from 'wilddog';


@Component({
    templateUrl: 'attend.html'
})


export class UserAttend {
    userAttendList;

    constructor(private navCtrl:NavController) {
        this.userAttendList = [];

    }

    ionViewWillEnter() {
        var syncConfig = {
            syncURL : 'https://plant-book.wilddogio.com'
        };
        wilddog.initializeApp(syncConfig);

        var userConfig = {
            authDomain : 'plant-book.wilddog.com'
        };
        wilddog.initializeApp(userConfig);

        wilddog.auth().onAuthStateChanged( (user) => {
            this.userAttendList = [];
            if(user){
                console.log('User is logined in');
                this.listBook(user,'touid',this.userAttendList);
            }else{
                console.log('No user is logined in');
            }
        })
    }

    listBook(user, type, bookList) {
        var syncConfig = {
          syncURL: "https://plant-book.wilddogio.com/"
        };
        wilddog.initializeApp(syncConfig);

        var bookref = wilddog.sync().ref('books');
        console.log(bookref);
        bookref.orderByChild(type).equalTo(user.uid).once("value", (snapshot) => {
            snapshot.forEach((data) => {
                console.log(data.key());
                console.log(data.val());
                bookList.push(data.val());
            });
        });
    }

    bookDetailClick(event, userAttend) {
        this.navCtrl.push(BookDetails, {book: userAttend});
    }
}
