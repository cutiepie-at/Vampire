<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import {SessionStore} from '@/stores/SessionStore';
import Card from '@/components/Bootstrap/Card.vue';

@Component({
  name: 'Name',
  components: {
    Card,
  },
})
export default class Name extends Vue {
  readonly store = new SessionStore();

  async mounted(): Promise<void> {
    await this.store.loadIfAbsent();
  }
}
</script>

<template>
  <Card>
    <h4 class="my-0">{{ $t('dashboard.hello', {displayName: store.user?.displayName ?? ''}) }}</h4>
  </Card>
</template>
