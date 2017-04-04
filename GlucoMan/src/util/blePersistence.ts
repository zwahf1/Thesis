import { BLE } from '@ionic-native/ble';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

/*----------------------------------------------------------------------------*/
/* Bluetooth Low Energy Persitence
/* zwahf1
/*
/*----------------------------------------------------------------------------*/
@Injectable()
export class BlePersistence {
  private static bp:BlePersistence;
  private ble: BLE;

  private constructor(){
    this.ble = new BLE();
  }

  // Getter for getting the instance
  static getInstance(): BlePersistence {
    if (this.bp == null) {
      this.bp = new BlePersistence();
    }
    return this.bp;
  }

  startScan(services: string[]): Observable<any> {
    return this.ble.startScan(services);
  }

  stopScan(): Promise<any> {
    return this.ble.stopScan();
  }

  connect(id: string): Observable<any> {
    return this.ble.connect(id);
  }

  disconnect(id: string): Promise<any> {
    return this.ble.disconnect(id);
  }

  enable(): Promise<any> {
    return this.ble.enable();
  }

  isEnabled(): Promise<void> {
    return this.ble.isEnabled();
  }

  isConnected(id: string): Promise<any> {
    return this.ble.isConnected(id);
  }
}
