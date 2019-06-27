# Bluetooth Terminal

![](screenshots/screenshot_Android.jpg)

## Introduction

This app facilitates the transfer of information to and from BLE devices, such as Arduinos, Bluetooth Chips, heart rate monitors, and more, from a phone, either iOS or Android.

## Building from Source

1. Install dependencies:

```bash
npm install
```

2. Make sure your device is connected to `adb` and on the same network:
```bash
adb devices
```

2. Serve the app:

```bash
ionic cordova run android -l --ssl --no-native-run --address=0.0.0.0
```

## Cordova Plugins

This app uses the following Cordova plugins:
- [BluetoothLE](https://github.com/randdusing/cordova-plugin-bluetoothle)
- [Device](https://github.com/apache/cordova-plugin-device)
- [Local Notifications](https://github.com/katzer/cordova-plugin-local-notifications)
