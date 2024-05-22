<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import ReportDetails from '@/components/reports/edit/ReportDetails.vue';

@Component({
  name: 'ReportsDetailsView',
  components: {ReportDetails},
})
export default class ReportDetailsView extends Vue {
  @Prop({default: true})
  readonly readonly!: boolean;

  get id(): string {
    return this.$route.params.id as string;
  }
}
</script>

<template>
  <ReportDetails class="m-2" :report-id="id" :readonly="readonly"/>
</template>
