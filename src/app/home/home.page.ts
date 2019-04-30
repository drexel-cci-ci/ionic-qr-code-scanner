import { Component } from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';


import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import {QrScannerDataPage} from '../modals/qr-scanner-data/qr-scanner-data.page';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isOn = false;
  scannerSub;

  isLightOn = false;
  camera = 0;

  constructor(
      public alertController: AlertController,
      private qrScanner: QRScanner,
      public modalController: ModalController,
  ) {}


  /**
   * ionic life cycle
   */
  ionViewWillEnter() {
    this.startScanner();
  }

  /**
   * ionic life cycle
   */
  ionViewWillLeave() {
    this.stopScanner();
    this.destroyScanner();
  }


  startScanner() {
    this.qrScanner.prepare()
        .then((status: QRScannerStatus) => {
          if (status.authorized) {

            this.isOn = true;

            /* start scanning */
            this.scannerSub = this.qrScanner.scan().subscribe((data: any) => {
              console.log('QR Data', data);
              this.presentModal(data).then();
            });

            this.qrScanner.show().then();


          } else if (status.denied) {
            // camera permission was permanently denied
            this.presentAlertConfirm().then();

          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
          }
        })
        .catch((e: any) => {
          console.log('Error is', e);

          if (e.code === 1) {
            this.presentAlertConfirm().then();
          } else {
            this.presentAlert('Alert', e.name, e._message).then();
          }
        });
  }


  stopScanner() {
    this.isOn = false;
    this.qrScanner.hide().then();
    this.scannerSub.unsubscribe();
  }


  destroyScanner() {
    this.qrScanner.destroy().then();
  }


  reverseCamera() {
    this.camera = (this.camera === 0) ? 1 : 0;
    this.qrScanner.useCamera(this.camera).then();
  }


  enableLight() {
    this.isLightOn = true;
    this.qrScanner.enableLight().then();
  }


  disableLight() {
    this.isLightOn = false;
    this.qrScanner.disableLight().then();
  }


  openSettings() {
    /* go to phone settings */
    this.qrScanner.openSettings();
  }


  async presentModal(qrData) {
    const modal = await this.modalController.create({
      component: QrScannerDataPage,
      componentProps: { qrCodeData: qrData }
    });

    this.disableLight();
    await modal.present();

    /* restart scanner after modal is dismiss */
    const { data } = await modal.onDidDismiss();

    this.startScanner();
  }



  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Permission',
      message: 'Make sure you enable camera access in your settings in order to use QR Code scanner',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Go To Settings',
          handler: () => {
            this.openSettings();
          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlert(header, subHeader, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
