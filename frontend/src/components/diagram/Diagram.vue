<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-facing-decorator';
import {LabelStore} from '@/stores/LabelStore';
import {ValueStore} from '@/stores/ValueStore';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5locales_en_US from '@amcharts/amcharts5/locales/en_US';
import am5locales_de_DE from '@amcharts/amcharts5/locales/de_DE';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import type {Theme} from '@amcharts/amcharts5/.internal/core/Theme';
import {sharedDarkMode} from '../bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import Loading from '@/components/Loading.vue';
import type {ReportVmV1} from 'vampire-oas';
import {ReportStore} from '@/stores/ReportStore';

const am5_locales = {
  en: am5locales_en_US,
  de: am5locales_de_DE,
} as any;
const iso_locales = {
  en: 'en-US',
  de: 'de-DE',
} as any;

@Component({
  name: 'Diagram',
  components: {
    Loading,
  },
})
export default class Diagram extends Vue {
  @Prop({default: false})
  readonly showOnlyOneLabelAtATime!: boolean;

  private root: any;
  private chart: any;
  private xAxis: any;
  private yAxis: any;
  readonly labelStore = new LabelStore();
  readonly reportStore = new ReportStore();
  readonly valueStore = new ValueStore();

  private get dat(): ({ date: number } | any)[] {
    const ret = this.valueStore.values.map(e => {
      const ret = {} as any;
      ret[e.labelId] = e.value;
      ret['date'] = this.reportsById.get(e.reportId)?.date.getTime();
      return ret;
    }) as { date: number }[];
    ret.sort((l, r) => l.date - r.date);
    return ret;
  }

  get reportsById(): Map<string, ReportVmV1> {
    return new Map<string, ReportVmV1>(this.reportStore.reports.map(e => [e.id, e]));
  }

  // noinspection JSUnusedLocalSymbols, used in @Watch
  private get sharedDarkMode() {
    return sharedDarkMode;
  }

  async mounted(): Promise<void> {
    await this.labelStore.loadIfAbsent();
    await this.reportStore.loadIfAbsent();
    await this.valueStore.loadIfAbsent();
    this.redrawChart();
  }

  private redrawChart(): void {
    this.disposeChart();
    this.initChart();
  }

  private initChart(): void {
    this.root = am5.Root.new(this.$refs.chart as HTMLElement);
    this.initThemes();
    this.initLocale();
    this.initChart0();
    this.initAxes();
    this.initSeries();
    this.initReferenceRanges();
    this.initLegend();
    this.initCursor();
  }

  private initThemes(): void {
    const themes: Theme[] = [
      am5themes_Animated.new(this.root.root),
    ];
    if (sharedDarkMode.darkMode) {
      themes.push(am5themes_Dark.new(this.root.root));
    }
    this.root.setThemes(themes);
  }

  private initLocale(): void {
    this.root.locale = am5_locales[this.$i18n.locale]! ?? am5locales_en_US;
    this.root.dateFormatter.set('dateFormat', (this.$i18n as any).getDateTimeFormat(this.$i18n.locale).date);
    this.root.dateFormatter.set('intlLocales', iso_locales[this.$i18n.locale]);
  }

  private initChart0(): void {
    this.chart = this.root.container.children.push(
        am5xy.XYChart.new(this.root, {
          layout: this.root.horizontalLayout,
          maxTooltipDistance: 0,
        }),
    );
  }

  private initAxes(): void {
    this.yAxis = this.chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererY.new(this.root, {}),
          tooltip: am5.Tooltip.new(this.root, {}),
        }),
    );
    this.xAxis = this.chart.xAxes.push(
        am5xy.DateAxis.new(this.root, {
          baseInterval: {timeUnit: 'day', count: 1},
          renderer: am5xy.AxisRendererX.new(this.root, {}),
          tooltip: am5.Tooltip.new(this.root, {}),
        }),
    );
  }

  private initSeries(): void {
    this.labelStore.labels.forEach((label, i) => {
      const data = this.dat.filter(e => e[label.id] !== undefined);
      if (!data.length) {
        return;
      }
      const series = this.chart.series.push(
          am5xy.LineSeries.new(this.root, {
            name: label.name,
            unit: label.unit,
            legendUnit: label.unit.trim().length > 0 ? ' (' + label.unit + ')' : '',
            xAxis: this.chart.xAxes._values[0],
            yAxis: this.chart.yAxes._values[0],
            valueYField: label.id,
            valueXField: 'date',
            stroke: am5.color(label.color || '#000'),
            fill: am5.color(label.color || '#000'),
            tooltip: am5.Tooltip.new(this.root, {
              labelText: '{name}: {valueX.formatDate()}: {valueY} {unit}',
            }),
            legendLabelText: '{name}{legendUnit}',
          }),
      );
      series.data.setAll(data);
      series.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          sprite: am5.Circle.new(this.root, {
            radius: 3,
            fill: series.get('fill'),
          }),
        });
      });

      if (this.showOnlyOneLabelAtATime && i !== 0) {
        series.hide();
      }
      series.on('visible', (visible: boolean, target: any) => {
        //series
        if (this.showOnlyOneLabelAtATime && visible) {
          (this.chart.series._values as any[]).forEach(s => {
            if (s !== series) {
              s.hide();
            }
          });
        }

        //ranges
        const visibleSeriesIndexes = (this.chart.series._values as any[])
            .map((e, i) => e.get('visible') ? i : -1)
            .filter(i => i >= 0);
        if (visibleSeriesIndexes.length === 1) {
          this.yAxis.axisRanges._values.forEach((e: any, i: number) => {
            if (visibleSeriesIndexes[0] === i) {
              e.show();
            } else {
              e.hide();
            }
          });
        } else {
          this.yAxis.axisRanges._values.forEach((e: any) => e.hide());
        }
      });
    });
  }

  private initReferenceRanges(): void {
    this.labelStore.labels.forEach(label => {
      // Create range axis data item
      let rangeDataItem = this.yAxis.makeDataItem({
        value: label.minReference,
        endValue: label.maxReference,
      });

      // Create a range
      let range = this.yAxis.createAxisRange(rangeDataItem);
      if (this.labelStore.labels.length !== 1) {
        range.hide();
      }

      rangeDataItem.get('grid').setAll({
        visible: false,
      });
      rangeDataItem.get('axisFill').setAll({
        fill: am5.color(label.color || '#000'),
        fillOpacity: 0.2,
        visible: true,
      });
    });
  }

  private initLegend(): void {
    let legend = this.chart.children.push(am5.Legend.new(this.root, {
      centerY: am5.percent(50),
      y: am5.percent(50),
      layout: this.root.verticalLayout,
      height: am5.percent(100),
      verticalScrollbar: am5.Scrollbar.new(this.root, {
        orientation: 'vertical',
        marginRight: -20,
      }),
    }));
    legend.labels.template.setAll({
      oversizedBehavior: 'truncate',
    });
    legend.data.setAll(this.chart.series.values);

    // https://www.amcharts.com/docs/v5/tutorials/pie-chart-with-a-legend-with-dynamically-sized-labels/
    this.chart.onPrivate('width', (width: number) => {
      const availableSpace = Math.max(width * 0.2, 50);
      legend.labels.template.setAll({
        width: availableSpace - 25,
        maxWidth: availableSpace - 25,
      });
      legend.setAll({
        width: availableSpace,
        maxWidth: availableSpace,
      });
    });
  }

  private initCursor(): void {
    this.chart.set('cursor', am5xy.XYCursor.new(this.root, {
      behavior: 'zoomXY',
      xAxis: this.chart.xAxes._values[0],
    }));
  }

  private disposeChart(): void {
    if (this.root) {
      this.root.dispose();
    }
    this.root = null;
  }

  @Watch('dat')
  @Watch('$i18n.locale')
  @Watch('sharedDarkMode.darkMode')
  private onDataChanged(): void {
    this.redrawChart();
  }
}
</script>

<template>
  <div>
    <Loading v-if="labelStore.loading || reportStore.loading || valueStore.loading"/>
    <div v-show="!labelStore.loading && !reportStore.loading && !valueStore.loading" ref="chart" class="h-100 w-100">
    </div>
  </div>
</template>
