<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import CenterOnParent from '@/components/CenterOnParent.vue';
import Spinner from '@/components/Spinner.vue';

@Options({
  name: 'Loading',
  components: {Spinner, CenterOnParent},
})
export default class Loading extends Vue {
}
</script>

<template>
  <CenterOnParent>
    <Spinner/>
  </CenterOnParent>
</template>
