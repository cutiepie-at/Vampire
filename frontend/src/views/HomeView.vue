<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Diagram from '@/components/diagram/Diagram.vue';

@Options({
  name: 'MainView',
  components: {Diagram},
})
export default class MainView extends Vue {
}
</script>

<template>
  <Diagram/>
</template>
