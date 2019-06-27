import { ToastController, AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UiElementsService {

  constructor(
    public localNotifications: LocalNotifications,
    public toastController: ToastController,
    public alertController: AlertController,) { }

  /**
   * Displays a toast message with a dismiss button.
   * @param msg The message to display in the toast.
   */
    async presentToast(msg: string){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      buttons: [{
        text: 'DISMISS',
        role: 'cancel'
      }
      ]
    });
    toast.present();
  }

  /**
   * Sends a local push notification.
   * @param text The text of the notification.
   * @param title The title of the notification.
   */
  push(text: string, title: string = "TPSPDW"){
    this.localNotifications.schedule({
      title: title,
      text: text,
    })
  }
}
