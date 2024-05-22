<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import Card from '@/components/Bootstrap/Card.vue';
import {ReportStore} from '@/stores/ReportStore';
import {ValueStore} from '@/stores/ValueStore';

@Component({
  name: 'Name',
  components: {
    Card,
  },
})
export default class Name extends Vue {
  readonly reportStore = new ReportStore();
  readonly valueStore = new ValueStore();

  get reports(): { id: string, date: Date, count: number }[] {
    let list = [...this.reportStore.reports];
    list.sort((a, b) => b.date.getTime() - a.date.getTime());
    list = list.slice(0, 5);
    return list.map(e => ({
      id: e.id,
      date: e.date,
      count: this.valueStore.valuesByReportId.get(e.id)?.length ?? 0,
    }));
  }

  async mounted(): Promise<void> {
    await this.reportStore.loadIfAbsent();
    await this.valueStore.loadIfAbsent();
  }
}
</script>

<template>
  <Card>
    <template #body-title>
      {{ $t('dashboard.recentReports') }}
    </template>
    <table class="table table-striped" >
      <thead>
        <tr>
          <td>{{ $t('report.model.date') }}</td>
          <td class="text-end">{{ $t('report.valueCount') }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports">
          <td>
            <a href="#" @click.prevent="$router.push('reports/' + report.id)">{{ $d(report.date, 'datetime') }}</a>
          </td>
          <td class="text-end">{{ report.count }}</td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
