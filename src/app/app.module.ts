import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//About
import { AboutPage } from '../pages/about/about';
import { UserAttend } from '../pages/about/attend';
import { UserBuild } from '../pages/about/build';
import { BookEdit } from '../pages/about/edit';

//Contact
import { ContactPage } from '../pages/contact/contact';
import { imageEditPage } from '../pages/contact/imageedit';
import { Login } from '../pages/contact/login';
import { Register } from '../pages/contact/register';

//Home
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/home/search';
import { SearchBookPage } from '../pages/home/searchbook';
import { BookDetails } from '../pages/home/bookdetails';
import { bookImageEditPage } from '../pages/home/bookimageedit';
import { ChangePage } from '../pages/home/change';
import { CreatePage } from '../pages/home/create';
import { Discuss } from '../pages/home/discuss';

import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    //about
    AboutPage,
    UserAttend,
    UserBuild,
    BookEdit,
    //Contact
    ContactPage,
    imageEditPage,
    Login,
    Register,
    //Home
    HomePage,
    SearchPage,
    SearchBookPage,
    BookDetails,
    bookImageEditPage,
    ChangePage,
    CreatePage,
    Discuss,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    //about
    AboutPage,
    UserAttend,
    UserBuild,
    BookEdit,
    //Contact
    ContactPage,
    imageEditPage,
    Login,
    Register,
    //Home
    HomePage,
    SearchPage,
    SearchBookPage,
    BookDetails,
    bookImageEditPage,
    ChangePage,
    CreatePage,
    Discuss,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
