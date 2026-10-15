# Tilt Ball

A black-and-gold Ionic + Angular + Capacitor app. Tilt your phone and the ball moves, driven by the device motion sensor (`@capacitor/motion`).

## Features
- Start / Stop motion sensor
- Live X and Y acceleration readings
- Ball moves with phone tilt, with Reset Ball
- Movement status (Moving left / right / up / down / Stable)

## Tech stack
- Ionic 9 (Angular, standalone components)
- Capacitor (Android)
- @capacitor/motion

## Requirements
- Node.js (LTS) and npm
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio (with Android SDK) for native builds
- An Android phone with USB debugging enabled

## Run it on a phone (from this repo)

1. Clone and install:
```
   git clone https://github.com/schlverde/TiltBall.git
cd TiltBall
   npm install
```
2. Build the web app and sync it to Android:
```
   ionic build
   npx cap sync android
```
   If sync says `index.html` is missing, set `webDir` in `capacitor.config.ts` to `'www/browser'` and build again.
3. Open in Android Studio:
```
   npx cap open android
```
   (Or open the `android` folder manually in Android Studio.)
4. If Android Studio asks for a Gradle JVM, choose **Use JVM 21**, then wait for Gradle sync.
5. Connect the phone by USB (USB debugging on), pick it in the device dropdown, press **Run**.
6. In the app, tap **Start Sensor** and tilt the phone.

## Install without Android Studio (APK)
Build a debug APK in Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
The file is at `android/app/build/outputs/apk/debug/app-debug.apk`.
Send it to another phone, allow "Install unknown apps", and install.

## Notes
- The motion sensor does not work on most PCs, so test on a real phone.
- Sensors are blocked on non-HTTPS pages in mobile browsers, so use the native app build.
- On Windows PowerShell, if scripts are blocked, run:
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`