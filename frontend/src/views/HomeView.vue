<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Dashboard from '@/components/dashboard/Dashboard.vue';
import Name from '@/components/dashboard/components/Name.vue';

@Component({
  name: 'MainView',
  components: {
    Dashboard,
    Name,
  },
})
export default class MainView extends Vue {
}
</script>

<template>
  <Dashboard class="m-2"/>
</template>
