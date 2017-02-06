/// <reference path="../tabs/wilddog.d.ts" />
import 'wilddog';
import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import {Login} from './login';
import {imageEditPage} from './imageedit';


@Component({
    templateUrl: 'contact.html'
})
export class ContactPage {

    private userInfo:any;

    constructor(private navCtrl:NavController, private navParams:NavParams, private modalCtrl:ModalController, private alertCtrl:AlertController) {
        this.userInfo = {};
        this.userInfo.username = "";
        this.userInfo.email = "";
        this.userInfo.image = "";
        this.userInfo.coin = "";

        var ref = new Wilddog("https://plant-book.wilddogio.com");
        var authData = ref.getAuth();

        if (authData) {
            console.log('Authenticated user with uid:', authData.uid);

            var userref = new Wilddog("https://plant-book.wilddogio.com/users/" + authData.uid);
            userref.once('value', nameSnapshot => {
                var val = nameSnapshot.val();
                this.userInfo.username = val.username;
                this.userInfo.email = val.email;
                if (val.coin) {
                    this.userInfo.coin = val.coin;
                } else {
                    this.userInfo.coin = 0;
                    userref.child('coin').set(0);
                }
                if (val.image) {
                    this.userInfo.image = val.image;
                } else {
                    this.userInfo.image = 'http://airing.ursb.me/image/avatar/40.png';
                    userref.child('image').set('http://airing.ursb.me/image/avatar/40.png');
                }

            });
        } else {
            let loginModal = this.modalCtrl.create(Login);
            loginModal.onDidDismiss(data => {
                if (data.username) {
                    this.userInfo.username = data.username;
                    this.userInfo.email = data.email;
                } else {
                    this.userInfo.email = data.email;
                    let userNameInput = this.alertCtrl.create({
                        title: '请输入用户名',
                        inputs: [
                            {
                                name: 'username',
                                placeholder: '用户名',
                                type: 'text'
                            }
                        ],
                        buttons: [
                            {
                                text: '确定',
                                role: '确定',
                                handler: data => {
                                    if (data.username) {
                                        this.userInfo.username = data.username;
                                        this.userInfoEdit('username', data.username);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        ]
                    });
                    userNameInput.present();
                }
            });
            loginModal.present();
        }
    }

    /**
     * 注销用户
     */
    loginOut() {
        var ref = new Wilddog("https://plant-book.wilddogio.com");
        // 注销用户
        ref.unauth();

        // 返回登录页
        let loginModal = this.modalCtrl.create(Login);
        loginModal.present();
    }

    userInfoEdit(key, data) {
        var ref = new Wilddog("https://plant-book.wilddogio.com");
        var authData = ref.getAuth();

        if (authData) {
            var userref = new Wilddog("https://plant-book.wilddogio.com/users/" + authData.uid);
            userref.child(key).set(data);
        } else {
            console.log('setting failed');
        }
    }

    userNameEdit() {
        let userNameEdit = this.alertCtrl.create({
            title: '请输入用户名',
            inputs: [
                {
                    name: 'username',
                    placeholder: '用户名',
                    type: 'text'
                }
            ],
            buttons: [
                {
                    text: '确定',
                    role: '确定',
                    handler: data => {
                        if (data.username) {
                            this.userInfo.username = data.username;
                            this.userInfoEdit('username', data.username);
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    text: '取消',
                    role: '取消'
                }
            ]
        });
        userNameEdit.present();
    }

    imageEdit() {
        var ref = new Wilddog("https://plant-book.wilddogio.com");
        var authData = ref.getAuth();

        if (authData) {
            this.navCtrl.push(imageEditPage, authData.uid);
        } else {
            console.log('setting failed');
        }
    }
}
