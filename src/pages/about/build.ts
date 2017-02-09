import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BookEdit} from '../about/edit';
import wilddog from 'wilddog';

@Component({
    templateUrl: 'build.html'
})
export class UserBuild {
    userBuildList;

    constructor(private navCtrl:NavController) {
        this.userBuildList = [];
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
            this.userBuildList = [];
            if(user){
                console.log('User is logined in');
                this.listBook(user,'fromuid',this.userBuildList);
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

    bookDetailEdit(event, userBuild) {
        this.navCtrl.push(BookEdit, {book: userBuild});
    }
}
