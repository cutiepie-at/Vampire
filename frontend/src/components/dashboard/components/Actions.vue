<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import Card from '@/components/Bootstrap/Card.vue';
import EditLabelModal from '@/components/labels/EditLabelModal.vue';

@Component({
  name: 'Actions',
  components: {
    Card,
    EditLabelModal,
  },
})
export default class Actions extends Vue {
}
</script>

<template>
  <Card>
    <button class="btn btn-secondary d-block w-100 mb-2" @click="($refs.labelEditModal as EditLabelModal).open()">
      <i class="fa fa-ribbon"/> {{ $t('dashboard.actions.newLabel') }}
    </button>
    <EditLabelModal ref="labelEditModal" />
    <button class="btn btn-secondary d-block w-100" @click="$router.push('reports/0/edit')">
      <i class="fa fa-file"/> {{ $t('dashboard.actions.newReport') }}
    </button>
  </Card>
</template>
