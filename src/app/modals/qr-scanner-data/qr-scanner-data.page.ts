import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-qr-scanner-data',
  templateUrl: './qr-scanner-data.page.html',
  styleUrls: ['./qr-scanner-data.page.scss'],
})
export class QrScannerDataPage implements OnInit {

  @Input() qrCodeData: any;

  constructor(
      private navParams: NavParams,
      public modalController: ModalController,
  ) { }


  ngOnInit() {
    /* check whether QR code data is valid */
    this.qrCodeData = this.navParams.get('qrCodeData');
  }


  async closeModal(data) {
    return await this.modalController.dismiss(data);
  }
}
