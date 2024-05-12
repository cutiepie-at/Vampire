import {Pinia, Store} from 'pinia-class-component';
import type {Report} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'ReportStore',
  name: 'ReportStore',
})
export class ReportStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loading: boolean = false;
  private _reports: Report[] = [];

  //getter
  get loading(): boolean {
    return this._loading;
  }

  get reports(): Report[] {
    return this._reports;
  }

  //actions
  clear(): void {
    this._reports.splice(0);
  }

  setReports(reports: Report[]): void {
    this._reports.splice(0);
    this._reports.push(...reports);
  }

  addReport(report: Report): void {
    this._reports.push(report);
  }

  updateReport(report: Report): void {
    const index = this._reports.findIndex(e => e.id == report.id);
    if (index >= 0) {
      this._reports.splice(index, 1, report);
    } else {
      this._reports.push(report);
    }
  }

  forgetReport(report: Report): void {
    const index = this._reports.findIndex(e => e.id == report.id);
    if (index >= 0) {
      this._reports.splice(index, 1);
    }
  }

  async reload(): Promise<void> {
    this._loading = true;
    try {
      const reports = await this.apiStore.reportApi.apiV1ReportGet();
      this.setReports(reports);
    } catch (err) {
      this.clear();
    } finally {
      this._loading = false;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._reports.length > 0) {
      return;
    }
    return await this.reload();
  }
}