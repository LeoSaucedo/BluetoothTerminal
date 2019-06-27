import { Component } from '@angular/core';
import { BLEFunctionsService } from '../services/blefunctions.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private bt: BLEFunctionsService,
  ) { }

  /**
   * Sends the message to the bluetooth device.
   */
  sendText() {
    //@ts-ignore
    var serviceId: string = document.getElementById("textboxService").value;
    //@ts-ignore
    var charId: string = document.getElementById("textboxWrite").value;
    //@ts-ignore
    var message = document.getElementById("textbox").value;
    this.bt.write(this.bt.currentDevice.address, serviceId, charId, message).then(success => {
      document.getElementById("textbox").setAttribute("value", "");
    })
  }

  /**
   * Clears the text box contents.
   */
  clearBox(){
    document.getElementById("textbox").setAttribute("value", "");
  }

  /**
   * Scans for bluetooth devices and populates the dropdown.
   */
  scanDevices() {
    // Clearing the dropdown of any old elements.
    var dropDown = document.getElementById("selectDevice");
    while (dropDown.firstChild) {
      dropDown.removeChild(dropDown.firstChild);
    }
    this.bt.scan(10).then(devices => {
      // Fills the array with the new elements.
      for (var i = 0; i < this.bt.scanList.length; i++) {
        var newDevice = document.createElement("ion-select-option");
        newDevice.innerHTML = this.bt.scanList[i].name;
        dropDown.appendChild(newDevice);
      }
    }, error => {
      alert("Failed to scan devices.");
    })
  }

  /**
   * Attempts to connect to the device that was selected on the dropdown.
   */
  connect() {
    //@ts-ignore
    var deviceName: string = document.getElementById("selectDevice").value;
    var identifier: string = null;
    for (var i = 0; i < this.bt.scanList.length; i++) {
      if (deviceName == this.bt.scanList[i].name) {
        identifier = this.bt.scanList[i].address;
      }
    }
    if (identifier != null) {
      this.bt.connect(identifier).then(() => {
        var statusLabel = document.getElementById("badgeStatus");
        statusLabel.setAttribute("color", "success");
        statusLabel.innerHTML = "CONNECTED";
      }).then(() => {
        //@ts-ignore
        var serviceId: string = document.getElementById("textboxService").value;
        //@ts-ignore
        var charId: string = document.getElementById("textboxRead").value;
        this.bt.subscribe(identifier, serviceId, charId).subscribe(val => {
          //@ts-ignore
          document.getElementById("textbox").setAttribute("value", val);
        });
      });
    }
  }

  /**
   * Disconnects from the device.
   */
  disconnect() {
    //@ts-ignore
    var deviceName: string = document.getElementById("selectDevice").value;
    var identifier: string = null;
    for (var i = 0; i < this.bt.scanList.length; i++) {
      if (deviceName == this.bt.scanList[i].name) {
        identifier = this.bt.scanList[i].address;
      }
    }
    if (identifier != null) {
      this.bt.disconnect(identifier);
      var statusLabel = document.getElementById("badgeStatus");
      statusLabel.setAttribute("color", "danger");
      statusLabel.innerHTML = "DISCONNECTED";
    } else {
      alert("Device not found. Try scanning again...");
    }
  }

  /**
   * Toggles whether the BLE settings can be modified.
   */
  toggleEditSettings() {
    var toggle = document.getElementById("toggleEditValues");
    //@ts-ignore
    if (toggle.checked == true) {
      document.getElementById("textboxService").setAttribute("disabled", "false");
      document.getElementById("textboxRead").setAttribute("disabled", "false");
      document.getElementById("textboxWrite").setAttribute("disabled", "false");
    } else {
      document.getElementById("textboxService").setAttribute("disabled", "true");
      document.getElementById("textboxRead").setAttribute("disabled", "true");
      document.getElementById("textboxWrite").setAttribute("disabled", "true");
    }
  }
}
