import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, ToastController} from 'ionic-angular';
import {bookImageEditPage} from '../home/bookimageedit';
import wilddog from 'wilddog';

@Component({
    templateUrl: 'edit.html'
})
export class BookEdit {

    private bookList:any;
    private bid:string;

    constructor(private navCtrl:NavController,
                private viewCtrl:ViewController,
                private navParams:NavParams,
                private toastCtrl:ToastController) {
        this.bookList = navParams.data.book;
    }

    ionViewWillEnter() {
        var userConfig = {
            authDomain : 'plant-book.wilddog.com'
        }
        wilddog.initializeApp(userConfig);
        wilddog.auth().onAuthStateChanged((user) => {
            if(user){
                console.log('User is logined in');
            }else{
                console.log('No suer is logined in');
            }
        })

        var syncConfig = {
            syncURL : 'https://plant-book.wilddogio.com'
        }
        wilddog.initializeApp(syncConfig);
        var bookref = wilddog.sync().ref('books');
        bookref.orderByChild('bookname').equalTo(this.bookList.bookname).once("value", (snapshot) => {
            snapshot.forEach((data) => {
                this.bid = data.val().bid;
            });
        });
    }

    /**
     * 编辑书籍
     */
    editConfirm() {
        if (this.bookList.bookname == '') {
            let bookNameToast = this.toastCtrl.create({
                message: '书名不能为空',
                duration: 2000
            });
            bookNameToast.present();
        } else if (this.bookList.price == '') {
            let bookPriceToast = this.toastCtrl.create({
                message: '价格不能为空',
                duration: 2000
            });
            bookPriceToast.present();
        } else if (this.bookList.place == '') {
            let bookPlaceToast = this.toastCtrl.create({
                message: '请选择书籍地区',
                duration: 2000
            });
            bookPlaceToast.present();
        } else if (this.bookList.classify == '') {
            let bookClassifyToast = this.toastCtrl.create({
                message: '请选择书籍类型',
                duration: 2000
            });
            bookClassifyToast.present();
        } else if (this.bookList.change == '') {
            let bookChangeToast = this.toastCtrl.create({
                message: '请选择交换方式',
                duration: 2000
            });
            bookChangeToast.present();
        } else if (this.bookList.bookcontent == '') {
            let bookContentToast = this.toastCtrl.create({
                message: '书籍简介不能为空',
                duration: 2000
            });
            bookContentToast.present();
        } else if (this.bookList.image == '') {
            let bookImageToast = this.toastCtrl.create({
                message: '书籍封面不能为空',
                duration: 2000
            });
            bookImageToast.present();
        } else {
            var bookref = wilddog.sync().ref('books').child(this.bid);
            bookref.update({
                'bookname': this.bookList.bookname,
                'price': this.bookList.price,
                'place': this.bookList.place,
                'classify': this.bookList.classify,
                'change': this.bookList.change,
                'bookcontent': this.bookList.bookcontent,
                'image': this.bookList.image
            });
            console.log('success to edit book data');

            this.navCtrl.pop();
        }
    }

    /**
     * 删除书籍
     */
    removeBook() {
        var bookref = wilddog.sync().ref('books').child(this.bid);
        bookref.remove();
        console.log('success to remove the book');

        this.navCtrl.pop();
    }

    imageEdit(){
        this.navCtrl.push(bookImageEditPage,this.bid);
    }
}
