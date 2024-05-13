import {Pinia, Store} from 'pinia-class-component';
import type {Label} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'LabelStore',
  name: 'LabelStore',
})
export class LabelStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loadingPromise: Promise<Label[]> | null = null;
  private _labels: Label[] = [];

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
  }

  get labels(): Label[] {
    return this._labels;
  }

  //actions
  clear(): void {
    this._labels.splice(0);
  }

  setLabels(labels: Label[]): void {
    this._labels.splice(0);
    this._labels.push(...labels);
  }

  addLabel(label: Label): void {
    this._labels.push(label);
  }

  updateLabel(label: Label): void {
    const index = this._labels.findIndex(e => e.id == label.id);
    if (index >= 0) {
      this._labels.splice(index, 1, label);
    } else {
      this._labels.push(label);
    }
  }

  forgetLabel(label: Label): void {
    const index = this._labels.findIndex(e => e.id == label.id);
    if (index >= 0) {
      this._labels.splice(index, 1);
    }
  }

  async reload(force: boolean = false): Promise<void> {
    if (this._loadingPromise) {
      await this._loadingPromise;
      if (!force) {// when force is true, wait for the current operation to complete, then reload
        return;
      }
    }

    try {
      this._loadingPromise = this.apiStore.labelApi.apiV1LabelGet();
      const labels = await this._loadingPromise;
      this.setLabels(labels);
    } catch (err) {
      this.clear();
    } finally {
      this._loadingPromise = null;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._labels.length > 0) {
      return;
    }
    return await this.reload();
  }
}