import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import {Login} from './login';
import {imageEditPage} from './imageedit';
import wilddog from 'wilddog';


@Component({
    templateUrl: 'contact.html',
    styleUrls: ['/pages/contact/contact.scss']
})
export class ContactPage {

    private userInfo:any;

    constructor(private navCtrl:NavController, private navParams:NavParams, private modalCtrl:ModalController, private alertCtrl:AlertController) {
        this.userInfo = {
            'username' : '',
            'email' : '',
            'image' : '',
            'coin' : ''
        };

        
    }

    ionViewWillEnter() {
        var config = {
          syncURL: "https://plant-book.wilddogio.com/",
          authDomain: "plant-book.wilddog.com"
        };
        wilddog.initializeApp(config);
        var logined:boolean;
        wilddog.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user.uid + ' ' + 'user is logined in');
                var userref = wilddog.sync().ref('users').child(user.uid);
                this.userInfo.username = user.displayName;
                this.userInfo.email = user.email;
                if (userref.coin) {
                    this.userInfo.coin = userref.coin;
                } else {
                    this.userInfo.coin = 0;
                    userref.update({
                        coin : 0,
                        email : user.email,
                        image : 'http://airing.ursb.me/image/avatar/40.png ',
                        username : user.displayName
                    });
                }
                if (user.image) {
                    this.userInfo.image = user.image;
                } else {
                    this.userInfo.image = 'http://airing.ursb.me/image/avatar/40.png';
                    user.updateProfile({
                        'photoURL' : 'http://airing.ursb.me/image/avatar/40.png'
                    });
                }
                logined = true;
            } else {
                logined = false;
            }
        });
        if (logined == false){
            let loginModal = this.modalCtrl.create(Login);
            loginModal.present();
        }
        
        
    }

    /**
     * 注销用户
     */
    loginOut() {
        // 注销用户
        wilddog.auth().signOut();
        // 返回登录页
        let loginModal = this.modalCtrl.create(Login);
        loginModal.present();
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
                            var currentUser = wilddog.auth().currentUser;
                            if(currentUser || currentUser != undefined){
                                console.log('User is logined in');
                                currentUser.updateProfile({
                                    displayName : data.username,
                                })
                                .then(function(user){
                                    console.info('update user ->',user);
                                })
                                .catch(function(err) {
                                    console.info('update user info failed.',err);
                                });
                            }else{
                                console.log('No user is logined in');
                                console.log('UserInfo set failed');
                            }
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
