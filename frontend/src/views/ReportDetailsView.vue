<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import ReportDetails from '@/components/reports/edit/ReportDetails.vue';
import {Prop} from 'vue-property-decorator';

@Options({
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
