import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Device } from '@ionic-native/device/ngx';
import { ConnectionInfoService } from '../services/connection-info.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private bluetoothSerial: BluetoothSerial,
    private device: Device,
    private connection: ConnectionInfoService,
    public loadingController: LoadingController,) { }

  /**
   * Opens the bluetooth dialog to connect to a device.
   */
  openBluetooth() {
    this.bluetoothSerial.showBluetoothSettings();
  }

  /**
   * Sends the message to the bluetooth device.
   */
  sendText() {
    this.bluetoothSerial.isConnected().then(() => {
      // @ts-ignore
      var content:string = document.getElementById("textbox").value;
      if(content == ""){
        alert("Message field cannot be empty.");
      }else{
        this.bluetoothSerial.write(content).then(() => {
          content = "";
        }, (err) => {
          alert("Error sending message.");
        });
        content = "";
      }
    }, () => {
      alert("You are not connected. Try again.");
    })
  }
  /**
   * Reads a message into the text box.
   */
  receiveText() {
    this.bluetoothSerial.isConnected().then(() => {
      // @ts-ignore
      var content: string = document.getElementById("textbox").value;
      this.bluetoothSerial.readUntil('\r').then((msg) => {
        content = msg;
      }, () => {
        alert("Error receiving message.");
      })
    }, () => {
      alert("You are not connected. Try again.");
    });
  }

  /**
   * Scans for bluetooth devices and populates the dropdown.
   */
  scanDevices() {
    var dropdown = document.getElementById("selectDevice");
    // Clearing out all of the elements in the dropdown.
    while (dropdown.firstChild) {
      dropdown.removeChild(dropdown.firstChild);
    }

    this.loadingController.create({
      message: "Scanning for devices...",
    }).then((res) => {
      res.present();
      if (this.device.platform == "Android") {
        // Search for bluetooth devices
        this.bluetoothSerial.discoverUnpaired().then((val) => {
          this.connection.scanList = val;
          for (var i = 0; i < this.connection.scanList.length; i++) {
            if (this.connection.scanList[i].name != null) {
              var newDevice = document.createElement("ion-select-option");
              newDevice.innerHTML = this.connection.scanList[i].name;
              dropdown.appendChild(newDevice);
            } else if (this.connection.scanList[i].address != null) {
              var newDevice = document.createElement("ion-select-option");
              newDevice.innerHTML = this.connection.scanList[i].address;
              dropdown.appendChild(newDevice);
            }
          }
          res.dismiss();
        }, () => {
          res.dismiss();
          alert("Failed to scan for devices.");
        });
      }
      //TODO: iOS Support
    });
  }

  /**
   * Attempts to connect to the device that was selected on the dropdown.
   */
  connect() {
    this.loadingController.create({
      message: "Connecting to device..."
    }).then((res) => {
      if(this.device.platform == "Android"){
        res.present();
        var identifier:string = "";
        for(var i = 0; i < this.connection.scanList.length; i++){
          //@ts-ignore
          if(this.connection.scanList[i].name == document.getElementById("selectDevice").value
          //@ts-ignore
          || this.connection.scanList[i].address == document.getElementById("selectDevice").value){
            if(this.device.platform == "Android"){
              identifier = this.connection.scanList[i].address;
            }
            //TODO: iOS Support
          }
        }
        this.bluetoothSerial.connect("00:A0:38:50:72:5F").subscribe(() => {
          alert("Successfully connected.");
          res.dismiss();
        }, (err) => {
          alert("Error:\n" + err);
          res.dismiss();
        });
      }else if(this.device.platform == "iOS"){
        //TODO: iOS Support
      }
    })
  }

}
