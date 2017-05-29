import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * schema page for settings page
 * @param  {'page-schema'}  {selector   [description]
 * @param  {'schema.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-schema',
  templateUrl: 'schema.html'
})

export class SchemaPage {

  schemaList = ['Individuell', 'Tief', 'Mittel', 'Hoch'];
  schema = this.schemaList[0];

/**
 * get which schema to show
 * @param  {Storage} publicstorage ionic storage from phone
 */
  constructor(public storage: Storage) {

    this.storage.ready().then(() => {
      this.storage.get('Schema').then((val) => {
        if (val) {
          this.schema = val;
        }
      })
    });
  }

  /**
   * store changed schema of measureplan
   */
  schemaChange(){
    this.storage.ready().then(() => {
      this.storage.set('Schema', this.schema);
    });
  }
}
