import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BookEdit} from '../about/edit';

@Component({
    templateUrl: 'build.html'
})
export class UserBuild {
    userBuildList;

    constructor(private navCtrl:NavController) {
        this.userBuildList = [];

        var userref = new Wilddog("https://plant-book.wilddogio.com");
        var authData = userref.getAuth();
        if(authData){
            var bookref = new Wilddog("https://plant-book.wilddogio.com/books");
            bookref.orderByChild('fromuid').equalTo(authData.uid).once("value", (snapshot) => {
                snapshot.forEach((data) => {
                    console.log(data.key());
                    console.log(data.val());
                    this.userBuildList.push(data.val());
                });
            });
        }else{
            console.log('fail to get booklist');
        }
    }

    bookDetailEdit(event, userBuild) {
        this.navCtrl.push(BookEdit, {book: userBuild});
    }
}
