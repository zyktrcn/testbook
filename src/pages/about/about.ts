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
        this.userAttendList = [];
        this.userBuildList = [];
    }

    ionViewWillEnter() {
        
        var syncConfig = {
          syncURL: "https://plant-book.wilddogio.com/"
        };
        wilddog.initializeApp(syncConfig);

        var userConfig = {
            authDomain: "plant-book.wilddog.com/"
        };
        wilddog.initializeApp(userConfig);
        wilddog.auth().signInWithEmailAndPassword('594823346@qq.com','123456');
        wilddog.auth().onAuthStateChanged( (user) =>{
            this.userAttendList = [];
            this.userBuildList = [];
            if(user) {
                console.log('User is logined in');
                this.listBook(user,'touid', this.userAttendList);
                this.listBook(user,'fromuid', this.userBuildList);
            }else {
                console.log('No user is logined in');
                // 用户未登录
                var noLoginToast = this.toastCtrl.create({
                    message: '用户尚未登录,请先登录!',
                    duration: 2000
                });
                noLoginToast.present();
            }
        })    
    }

    listBook(user, type, bookList) {
        var syncConfig = {
          syncURL: "https://plant-book.wilddogio.com/"
        };
        wilddog.initializeApp(syncConfig);

        var bookref = wilddog.sync().ref('books');
        console.log('bookref:' + bookref);
        bookref.orderByChild(type).equalTo(user.uid).limitToLast(3).once("value", (snapshot) => {
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

    userAttendMore(event) {
        this.navCtrl.push(UserAttend);
    }

    bookDetailEdit(event, userBuild) {
        this.navCtrl.push(BookEdit, {book: userBuild});
    }

    userBuildMore(event) {
        /*this.navCtrl.push(UserBuild);*/
        console.log('Getting currentUser');
        var currentUser = wilddog.auth().currentUser;
        console.log(currentUser);
    }
}
