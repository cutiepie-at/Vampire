<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Dashboard from '@/components/dashboard/Dashboard.vue';
import Name from '@/components/dashboard/components/Name.vue';

@Options({
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
