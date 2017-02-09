import {Component} from '@angular/core';
import {NavController, ViewController, ToastController, LoadingController} from 'ionic-angular';
import {bookImageEditPage} from '../home/bookimageedit';
import wilddog from 'wilddog';

@Component({
    templateUrl: 'create.html'
})
export class CreatePage {
    private bookList:any;

    constructor(private navCtrl:NavController,
                private viewCtrl:ViewController,
                private toastCtrl:ToastController,
                private loadingCtrl:LoadingController) {
        this.bookListInitial();
    }

    ionViewWillEnter() {

        var userConfig = {
            authDomain : 'plant-book.wilddog.com'
        }
        wilddog.initializeApp(userConfig);
        wilddog.auth().onAuthStateChanged((user) => {
            console.log(user);
        })

    }

    bookListInitial() {
        this.bookList = {
            bookName : 'testbook',
            bookPrice : '123',
            bookLocation : '',
            bookType : '',
            bookChange : '',
            bookContent : '123',
            bookHead : ''
        };
    }

    bookUpload() {
        if (this.bookList.bookName == '') {
            var bookNameToast = this.toastCtrl.create({
                message: '书名不能为空',
                duration: 2000
            });
            bookNameToast.present();
        } else if (this.bookList.bookPrice == '') {
            var bookPriceToast = this.toastCtrl.create({
                message: '书籍价格不能为空',
                duration: 2000
            });
            bookPriceToast.present();
        } else if (this.bookList.bookLocation == '') {
            var bookLocationToast = this.toastCtrl.create({
                message: '地区不能为空',
                duration: 2000
            });
            bookLocationToast.present();
        } else if (this.bookList.bookType == '') {
            var bookTypeToast = this.toastCtrl.create({
                message: '请选择书籍类型',
                duration: 2000
            });
            bookTypeToast.present();
        } else if (this.bookList.bookChange == '') {
            var bookChangeToast = this.toastCtrl.create({
                message: '请选择书籍交换方式',
                duration: 2000
            });
            bookChangeToast.present();
        } else if (this.bookList.bookContent == '') {
            var bookContentToast = this.toastCtrl.create({
                message: '书籍简介不能为空',
                duration: 2000
            });
            bookContentToast.present();
        } else {
            var createBookLoading = this.loadingCtrl.create({
                spinner: 'circles',
                content: '正在上传'
            });
            createBookLoading.present();

            console.log('Getting currentUser');
            var currentUser = wilddog.auth().currentUser;
            console.log(currentUser);

            if(currentUser || currentUser != undefined) {
                this.createBook(currentUser.uid);
            } else {
                var authToast = this.toastCtrl.create({
                    message: '请先登录',
                    duration: 2000
                });
                authToast.present();
            }


            setTimeout(()=> {
                this.viewCtrl.dismiss();
                createBookLoading.dismiss();
            }, 2000);
        }
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    createBook(uid:string) {
        var syncConfig = {
            syncURL : 'https://plant-book.wilddogio.com'
        }
        wilddog.initializeApp(syncConfig);

        var bid:string = this.uuid();
        var setBookList = wilddog.sync().ref('books').push(bid);
        var userref = wilddog.sync().ref('users').child(uid);
        userref.once('value', nameSnapshot => {
            var val = nameSnapshot.val();
            setBookList.set({
                'fromusername' : val.username,
                'fromuserimage' : val.image,
                'bid' : bid,
                'bookname' : this.bookList.bookName,
                'bookcontent' : this.bookList.bookContent,
                'formuid' : uid,
                'touid' : '',
                'tousername' : '',
                'touserimage' : '',
                'image' : 'http://airing.ursb.me/image/plant/1.jpg',
                'place' : this.bookList.bookLocation,
                'status' : '等待交易',
                'price' : this.bookList.bookPrice,
                'classify' : this.bookList.bookType,
                'change' : this.bookList.bookChange
            })
        });
        console.log('success');
    }

    /**
     * 随机生成bid
     * @returns {string}
     */
    uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
}
