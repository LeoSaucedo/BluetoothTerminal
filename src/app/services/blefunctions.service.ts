import { Injectable } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Device } from '@ionic-native/device/ngx';
import { LoadingController } from '@ionic/angular';
import { UiElementsService } from './/ui-elements.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BLEFunctionsService {

  constructor(private ble: BluetoothLE,
    private device: Device,
    private loadingController: LoadingController,
    private ui: UiElementsService,
  ) { }

  /**
   * Global variables
   */
  public scanList = [];
  public currentDevice;

  /**
   * Enables then initializes BLE on the device.
   */
  initialize() {
    // Check for location permissions.

    if (this.ble.isEnabled()) {
      if (this.device.platform == "Android") {
        if(parseFloat(this.device.version) >= 6){
          // If API > 23
          this.ble.hasPermission().then(hasPermission => {
            if(!hasPermission){
              this.ble.requestPermission();
            }
          });
          this.ble.isLocationEnabled().then(isLocationEnabled => {
            if(!isLocationEnabled){
              this.ble.requestLocation();
            }
          });
        }
        this.ble.enable();
        this.ui.presentToast("Bluetooth enabled.");
      } else {
        alert("Please enable Bluetooth.");
      }
    }
    this.ble.initialize({
      "request": true,
      "statusReceiver": false,
      "restoreKey": "terminal"
    }).subscribe(success => {
      this.ui.presentToast("Bluetooth activated.");
    }, error => {
      this.ui.presentToast("Bluetooth failed.");
    });
  }

  /**
   * Checks to see if the device is connected.
   * @param deviceId The address of the device.
   */
  isConnected(deviceId: string) {
    return new Promise(function (resolve, reject) {
      this.ble.isConnected({
        "address": deviceId
      }).then(success => {
        resolve(JSON.stringify(success));
      }, error => {
        reject(error)
      })
    });
  }

  /**
   * Scans for devices to connect to.
   * @param scanLength The length, in seconds, to scan for.
   * @returns Returns a promise.
   */
  scan(scanLength: number) {
    var that = this;
    that.scanList = []; // Clearing the scanList.
    return new Promise(function (resolve, reject) {
      that.loadingController.create({
        "message": "Scanning for devices..."
      }).then(loading => {
        loading.present();
        that.ble.startScan({
          "allowDuplicates": true,
        }).subscribe(scan => {
          // Add each scan result to the scanList.
          if (scan.name) {
            var unique = true;
            for (var i = 0; i < that.scanList.length; i++) {
              if (scan.name == that.scanList[i].name) {
                unique = false;
              }
            }
            if (unique) {
              that.scanList.push(scan);
            }
          }
        });
        setTimeout(function () {
          that.ble.stopScan().then(success => {
            loading.dismiss();
            that.ui.presentToast("Scan complete.");
            resolve(that.scanList);
          });
        }, scanLength * 1000);
      });
    });
  }

  /**
   * Connects to the specified device.
   * @param identifier The device's address.
   * @returns Returns a promise.
   */
  connect(identifier: string) {
    var that = this;
    var isConnected = null;
    return new Promise(function (resolve, reject) {
      that.loadingController.create({
        "message": "Connecting..."
      }).then(loading => {
        loading.present();
        that.ble.connect({
          "address": identifier,
          "autoConnect": true
        }).subscribe(currentDevice => {
          that.currentDevice = currentDevice;
          loading.dismiss();
          isConnected = true;
          that.ble.discover({
            "address": identifier,
            "clearCache": true,
          }).then(result => {
            resolve(currentDevice);
          });
        });
        setTimeout(function () {
          if (!isConnected) {
            that.ble.disconnect({
              "address": identifier
            });
            that.ble.close({
              "address": identifier
            });
            loading.dismiss();
            alert("Could not connect.");
            reject();
          }
        }, 10000)
      });
    });
  }

  /**
   * Disconnects from the specified device,
   * then closes the connection.
   * @param identifier The device's address.
   */
  disconnect(identifier: string) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.loadingController.create({
        "message": "Disconnecting..."
      }).then(loading => {
        loading.present();
        that.ble.disconnect({
          "address": identifier
        });
        that.ble.close({
          "address": identifier
        });
        loading.dismiss();
        resolve();
      });
    });
  }

  /**
   * Reads information from the device.
   * @param deviceId Device UUID
   * @param serviceId Service UUID
   * @param charId Characteristic UUID
   * 
   * @returns A promise with the data that is read
   */
  read(deviceId: string, serviceId: string, charId: string) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.loadingController.create({
        "message": "Reading..."
      }).then(loading => {
        loading.present();
        that.ble.read({
          "address": deviceId,
          "service": "1801",
          "characteristic": "2A05"
        }).then(result => {
          loading.dismiss();
          alert(JSON.stringify(result));
          resolve(result.value);
        }, error => {
          reject(error);
        });
      });
    });
  }

  /**
   * Writes data to the device.
   * @param deviceId Device UUID
   * @param serviceId Service UUID
   * @param charId Characteristic UUID
   * @param message Message to write
   */
  write(deviceId: string, serviceId: string, charId: string, message: string) {
    var that = this;
    var encodedMsg = btoa(message + "\r");
    return new Promise(function (resolve, reject) {
      that.ble.writeQ({
        "address": deviceId,
        "service": serviceId,
        "characteristic": charId,
        "value": encodedMsg,
        "type": "noResponse"
      }).then(success => {
        that.ui.presentToast("Successfully wrote to device.");
        var string = atob(success.value);
        resolve(string);
      }, error => {
        that.ui.presentToast("Error writing to device.");
        alert(JSON.stringify(error));
        reject(error);
      });
    });
  }

  /**
   * Starts listening in to a response.
   * @param deviceId Device UUID.
   * @param serviceId Service UUID.
   * @param charId Characteristic UUID.
   * @returns Returns an Observable called every time the
   * characteristic changes in value, containing the decoded
   * string sent by the BT device.
   */
  subscribe(deviceId: string, serviceId: string, charId: string) {
    var that = this;
    function sub(observer) {
      that.ble.subscribe({
        "address": deviceId,
        "service": serviceId,
        "characteristic": charId
      }).subscribe(result => {
        if (result.value) {
          observer.next(atob(result.value));
        }
      });
    }
    return new Observable(sub);
  }

  /**
   * Discovers the services/characteristics of the device.
   * @param address The address of the device.
   * @param clearCache Whether to re-discover services.
   */
  discover(address: string) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.ble.discover({
        "address": address,
        "clearCache": true
      }).then(result => {
        resolve(result);
      });
    });
  }
}