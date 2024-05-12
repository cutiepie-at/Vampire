<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {LabelStore} from '@/stores/LabelStore';
import {ValueStore} from '@/stores/ValueStore';
import {Watch} from 'vue-property-decorator';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5locales_en_US from '@amcharts/amcharts5/locales/en_US';
import am5locales_de_DE from '@amcharts/amcharts5/locales/de_DE';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import type {Theme} from '@amcharts/amcharts5/.internal/core/Theme';
import {sharedDarkMode} from '../bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import Loading from '@/components/Loading.vue';
import type {Report} from 'vampire-oas';
import {ReportStore} from '@/stores/ReportStore';

const am5_locales = {
  en: am5locales_en_US,
  de: am5locales_de_DE,
} as any;
const iso_locales = {
  en: 'en-US',
  de: 'de-DE',
} as any;

@Options({
  name: 'Diagram',
  components: {
    Loading,
  },
})
export default class Diagram extends Vue {
  private root: any;
  private chart: any;
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

  get reportsById(): Map<string, Report> {
    return new Map<string, Report>(this.reportStore.reports.map(e => [e.id, e]));
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
    const yAxis = this.chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererY.new(this.root, {}),
          tooltip: am5.Tooltip.new(this.root, {}),
        }),
    );
    const xAxis = this.chart.xAxes.push(
        am5xy.DateAxis.new(this.root, {
          baseInterval: {timeUnit: 'day', count: 1},
          renderer: am5xy.AxisRendererX.new(this.root, {}),
          tooltip: am5.Tooltip.new(this.root, {}),
        }),
    );
  }

  private initSeries(): void {
    this.labelStore.labels.forEach(label => {
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
    });
  }

  private initLegend(): void {
    let legend = this.chart.children.push(am5.Legend.new(this.root, {
      layout: this.root.verticalLayout,
    }));
    legend.data.setAll(this.chart.series.values);
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
