<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Values from '@/components/values/Values.vue';

@Options({
  name: 'ValuesView',
  components: {Values},
})
export default class ValuesView extends Vue {
}
</script>

<template>
  <Values class="m-2"/>
</template>
