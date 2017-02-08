import {Component} from '@angular/core';
import {NavController, NavParams, ModalController,ToastController} from 'ionic-angular';
import {ChangePage} from './change';
import {Discuss} from './discuss';
import wilddog from 'wilddog';

@Component({
    templateUrl: 'bookdetails.html'
})
export class BookDetails {

    private book:any;
    private bid:string;
    private comments:any;

    constructor(private navCtrl:NavController, private navParams:NavParams, private modalCtrl:ModalController, private toastCtrl:ToastController) {

        this.book = navParams.data.book;
        this.bid = navParams.data.book.bid;

        var comments = [];
        var config = {
          syncURL: "https://plant-book.wilddogio.com/"
        };
        wilddog.initializeApp(config);
        var ref = wilddog.sync().ref("comments");
        ref.on("value", function (snapshot) {
          snapshot.forEach(function (snap) {
            comments.push(snap.val());
          });
        });
        this.comments = comments;

    }

    bookListSave() {

    }

    /**
     * 交换书籍
     */
    bookChange() {
        let bookChangeModal = this.modalCtrl.create(ChangePage);
        this.bookListSave();
        bookChangeModal.present();
    }

    /**
     * 购买书籍
     */
    buyBook() {
        var ref = new Wilddog('https://plant-book.wilddogio.com');
        var authData = ref.getAuth();
        if (authData) {
            var userref = new Wilddog('https://plant-book.wilddogio.com/users/' + authData.uid);
            userref.once("value", (data) => {
                // 获取登录用户的用户数据
                var newCoin = data.val().coin - this.book.price;
                if (newCoin >= 0) {
                    console.log('完成购买,余额为:' + newCoin);
                    userref.child('coin').set(newCoin);
                    var cid = this.uuid();
                    var cref = new Wilddog('https://plant-book.wilddogio.com/changes/' + cid);
                    cref.child('cid').set(cid);
                    cref.child('bid').set(this.book.bid);
                    cref.child('fromuid').set(authData.uid);
                    cref.child('touid').set(this.book.fromuid);
                    cref.child('coin').set(this.book.price);
                    cref.child('status').set('完成');
                    var d = new Date();
                    var time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                    cref.child('date').set(time);

                    var bref = new Wilddog('https://plant-book.wilddogio.com/books/' + this.book.bid);
                    bref.child('touid').set(authData.uid);
                    bref.child('tousername').set(data.val().username);
                    bref.child('touserimage').set(data.val().image);
                    bref.child('status').set('交易完毕');

                    var touserref = new Wilddog('https://plant-book.wilddogio.com/users/' + this.book.touid);
                    touserref.once("value", (data) => {
                        let tousercoins = data.val().coin + this.book.price;
                        touserref.child('coin').set(tousercoins);
                    })
                    var buySucceedToast = this.toastCtrl.create({
                        message: '完成购买,余额为:' + newCoin,
                        duration: 2000
                    });
                    buySucceedToast.present();
                } else {
                    console.log('余额不足,欠款为:' + newCoin);
                    var buyFailedToast = this.toastCtrl.create({
                        message: '余额不足,欠款为:' + newCoin,
                        duration: 2000
                    });
                    buyFailedToast.present();
                }
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

    /**
     * 进入评论页
     */
    commend() {
        this.navCtrl.push(Discuss, this.bid);
    }

    /**
     * 随机生成cid
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
