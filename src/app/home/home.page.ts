import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private bluetoothSerial: BluetoothSerial) {}

  /**
   * Opens the bluetooth dialog to connect to a device.
   */
  openBluetooth(){
    this.bluetoothSerial.showBluetoothSettings();
  }
  sendText(){
    this.bluetoothSerial.isConnected().then(() => {
    // @ts-ignore
    var content:string = document.getElementById("textbox").value;
    this.bluetoothSerial.write(content).then(() => {
      content = "";
    }, (err) => {
      alert("Error sending message.");
    });
    content = "";
    }, () => {
      alert("You are not connected. Try again.");
    })
  }
  receiveText(){
    this.bluetoothSerial.isConnected().then(() => {
      // @ts-ignore
      var content:string = document.getElementById("textbox").value;
      this.bluetoothSerial.readUntil('/r').then((msg) => {
        content = msg;
      }, () => {
        alert("Error receiving message.");
      })
    }, () =>{
      alert("You are not connected. Try again.");
    });
  }
}
