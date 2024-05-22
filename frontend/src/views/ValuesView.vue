<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Values from '@/components/values/Values.vue';

@Component({
  name: 'ValuesView',
  components: {Values},
})
export default class ValuesView extends Vue {
}
</script>

<template>
  <Values class="m-2"/>
</template>
