<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Labels from '@/components/labels/Labels.vue';

@Options({
  name: 'LabelsView',
  components: {Labels},
})
export default class LabelsView extends Vue {
}
</script>

<template>
  <Labels class="m-2"/>
</template>
