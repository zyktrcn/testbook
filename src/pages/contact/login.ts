/// <reference path="../tabs/wilddog.d.ts" />
import {Component} from '@angular/core';
import {NavController, ViewController, ToastController, LoadingController, ModalController} from 'ionic-angular';
import {Register} from './register';
import 'wilddog';

@Component({
    templateUrl: 'login.html'
})

export class Login {

    private user:any;

    constructor(private navCtrl:NavController,
                private viewCtrl:ViewController,
                private toastCtrl:ToastController,
                private modalCtrl:ModalController,
                private loadingCtrl:LoadingController) {
        this.user = {};
        this.user.email = "";
        this.user.password = "";
    }

    /**
     * 用户登录
     */
    login() {
        //判断成功则提示“email不能为空”
        if (this.user.username == "") {
            let usernameFormat = this.toastCtrl.create({
                message: "email不能为空",
                duration: 2000
            });

            usernameFormat.present();
        }
        //判断密码是否为空
        //判断成功则提示“密码不能为空”
        else if (this.user.password == "") {
            let passwordFormat = this.toastCtrl.create({
                message: "密码不能为空",
                duration: 2000
            });

            passwordFormat.present();

        }
        //用户名和密码格式正确后处理
        else {
            //登陆Loading
            let loginLoading = this.loadingCtrl.create({
                spinner: "circles",
                content: "正在登陆"
            });

            loginLoading.present();

            this.authWithPasswordByWilddog(this.user.email, this.user.password);

            loginLoading.dismiss();
        }
    }

    /**
     * 跳转至注册页面
     */
    register() {
        let register = this.modalCtrl.create(Register);
        register.present();
    }


    /**
     * Wilddog.authWithPassword()
     * @param email
     * @param password
     */
    authWithPasswordByWilddog(email:string, password:string) {
        var ref = new Wilddog('https://plant-book.wilddogio.com');
        // Log me in
        ref.authWithPassword({
            "email": email,
            "password": password
        }, (error, authData) => {
            if (error) {
                console.log('Login Failed!', error);
            } else {
                console.log('Authenticated successfully with payload:', authData);
                var userdef = new Wilddog('https://plant-book.wilddogio.com/users/' + authData.uid);
                userdef.child('email').set(email);
                userdef.once("value", (data) => {
                    this.viewCtrl.dismiss(data.val());
                });
            }
        });
    }


}