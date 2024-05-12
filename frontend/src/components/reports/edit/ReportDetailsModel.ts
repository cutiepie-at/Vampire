import {Label, Report, Value} from 'vampire-oas';

export default class ReportDetailsModel {
  report: Report;
  newLabels: Label[];
  values: Value[];

  constructor(report: Report, newLabels: Label[], values: Value[]) {
    this.report = report;
    this.newLabels = newLabels;
    this.values = values;
  }
}