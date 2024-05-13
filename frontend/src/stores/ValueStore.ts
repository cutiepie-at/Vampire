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
  private _loadingPromise: Promise<Value[]> | null = null;
  private _values: Value[] = [];

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
  }

  get values(): Value[] {
    return this._values;
  }

  get valuesByLabelId(): Map<string, Value[]> {
    return Map.groupBy(this._values, e => e.labelId);
  }

  get valuesByReportId(): Map<string, Value[]> {
    return Map.groupBy(this._values, e => e.reportId);
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

  forgetValuesByReportId(reportId: string): void {
    this._values
      .map((e, i) => e.reportId == reportId ? i : -1)
      .filter(i => i >= 0)
      .reverse()
      .forEach(i => this._values.splice(i, 1));
  }

  async reload(force: boolean = false): Promise<void> {
    if (this._loadingPromise) {
      await this._loadingPromise;
      if (!force) {// when force is true, wait for the current operation to complete, then reload
        return;
      }
    }

    try {
      this._loadingPromise = this.apiStore.valueApi.apiV1ValueGet();
      const values = await this._loadingPromise;
      this.setValues(values);
    } catch (err) {
      this.clear();
    } finally {
      this._loadingPromise = null;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._values.length > 0) {
      return;
    }
    return await this.reload();
  }
}