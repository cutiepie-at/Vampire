<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Profile from '@/components/profile/Profile.vue';

@Options({
  name: 'ValuesView',
  components: {Profile},
})
export default class ValuesView extends Vue {
}
</script>

<template>
  <Profile class="p-2"/>
</template>
