<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Reports from '@/components/reports/Reports.vue';

@Component({
  name: 'ReportsView',
  components: {Reports},
})
export default class ReportsView extends Vue {
}
</script>

<template>
  <Reports class="m-2"/>
</template>
