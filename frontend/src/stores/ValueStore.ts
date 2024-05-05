import {Pinia, Store} from 'pinia-class-component';
import type {Value} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'ValueStore',
  name: 'ValueStore',
})
export class ValueStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _values: Value[] = [];

  //getter
  get values(): Value[] {
    return this._values;
  }

  //actions
  clear(): void {
    this._values.splice(0);
  }

  setValues(values: Value[]): void {
    this._values.splice(0);
    this._values.push(...values);
  }

  addValue(value: Value): void {
    this._values.push(value);
  }

  addValues(values: Value[]) {
    values.forEach(e => this.addValue(e));
  }

  updateValue(value: Value): void {
    const index = this._values.findIndex(e => e.id == value.id);
    if (index >= 0) {
      this._values.splice(index, 1, value);
    } else {
      this._values.push(value);
    }
  }


  forgetValue(value: Value): void {
    const index = this._values.findIndex(e => e.id == value.id);
    if (index >= 0) {
      this._values.splice(index, 1);
    }
  }

  async reload(): Promise<void> {
    try {
      const values = await this.apiStore.valueApi.apiV1ValueGet();
      this.setValues(values);
    } catch (err) {
      this.clear();
    }
  }


}