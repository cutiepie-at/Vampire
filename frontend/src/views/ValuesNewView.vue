<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import NewValues from '@/components/values/new/NewValues.vue';

@Options({
  name: 'ValuesView',
  components: {
    NewValues,
  },
})
export default class ValuesView extends Vue {
}
</script>

<template>
  <NewValues class="p-2"/>
</template>
