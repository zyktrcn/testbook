import {Component, isDevMode} from '@angular/core';
import {NavController, ViewController, NavParams, ToastController} from 'ionic-angular';
import wilddog from 'wilddog';

@Component({
    templateUrl: 'discuss.html',
    styleUrls: ['/pages/home/discuss.scss']
})

export class Discuss {

    private uid:string;
    private bid:string;
    private usercommend:string = "";

    constructor(private navCtrl:NavController, private viewCtrl:ViewController, private navParams:NavParams, private toastCtrl:ToastController) {

        this.bid = navParams.data;
    }

    ionViewWillEnter() {

        var config = {
          syncURL: "https://plant-book.wilddogio.com/",
          authDomain: "plant-book.wilddog.com"
        };
        wilddog.initializeApp(config);
        wilddog.auth().onAuthStateChanged((user) => {
            if (user){
                console.log('User is logined in');
                this.uid = user.uid;
            }else{
                // 用户未登录
            var noLoginToast = this.toastCtrl.create({
                message: '用户尚未登录,请先登录!',
                duration: 2000
            });
            noLoginToast.present();
            }
        })
    }

    /**
     * 添加评论
     */
    comment() {

        var ref = wilddog.sync().ref('comments').push(this.uuid());
        var userref = wilddog.sync().ref('users').child(this.uid);
        userref.once('value', nameSnapshot => {
            var val = nameSnapshot.val();
            //ref.child('fromuserimage').set(val.image);
            ref.set({
                'fromusername' : val.username,
                'fromuid' : this.uid,
                'text' : this.usercommend,
                'bid' : this.bid
            })
        });

        console.log('success');
        this.viewCtrl.dismiss();

    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    /**
     * 随机生成id
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
