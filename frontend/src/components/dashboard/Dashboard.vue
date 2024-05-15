<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import Name from '@/components/dashboard/components/Name.vue';
import Reports from '@/components/dashboard/components/Reports.vue';
import Actions from '@/components/dashboard/components/Actions.vue';
import Diagram from '@/components/diagram/Diagram.vue';

@Options({
  name: 'Dashboard',
  components: {
    Actions,
    Diagram,
    Name,
    Reports,
  },
})
export default class Dashboard extends Vue {
}
</script>

<template>
  <div class="d-flex flex-column dashboard">
    <div class="d-flex flex-row dashboard-row-1">
      <div class="d-flex flex-column">
        <Name class="mb-2"/>
        <Actions/>
      </div>
      <Reports class="flex-grow-1"/>
    </div>
    <Diagram class="flex-grow-1" style="min-height: 10rem" :show-only-one-label-at-a-time="true"/>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

.dashboard .dashboard-row-1 > :not(:last-child) {
  margin-inline-end: map-get($spacers, 2);
}

@include media-breakpoint-down(md) {
  .dashboard {
    overflow-y: auto !important;
  }

  .dashboard .dashboard-row-1 {
    flex-direction: column !important;

    & > :not(:last-child) {
      margin-inline-end: 0;
      margin-block-end: map-get($spacers, 2);
    }
  }
}
</style>
