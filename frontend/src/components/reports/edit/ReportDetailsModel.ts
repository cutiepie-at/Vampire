import {LabelVmV1, ReportVmV1, ValueVmV1} from 'vampire-oas';

export default class ReportDetailsModel {
  report: ReportVmV1;
  newLabels: LabelVmV1[];
  values: ValueVmV1[];

  constructor(report: ReportVmV1, newLabels: LabelVmV1[], values: ValueVmV1[]) {
    this.report = report;
    this.newLabels = newLabels;
    this.values = values;
  }
}