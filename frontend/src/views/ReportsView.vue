<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Reports from '@/components/reports/Reports.vue';

@Options({
  name: 'ReportsView',
  components: {Reports},
})
export default class ReportsView extends Vue {
}
</script>

<template>
  <Reports class="m-2"/>
</template>
