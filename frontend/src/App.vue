<script lang="ts">
import {RouterView} from 'vue-router';
import {Options, Vue} from 'vue-class-component';
import SiteNavBar from '@/components/navbar/SiteNavBar.vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';
import LocaleSaver from '@/components/locale/LocaleSaver.vue';

@Options({
  name: 'App',
  components: {
    DocumentLocaleSetter,
    LocaleSaver,
    RouterView,
    SiteNavBar,
    SideBar,
  },
})
export default class App extends Vue {
  toggle(toggled: boolean): void {
    (this.$refs.sidebar as SideBar).toggle(toggled);
  }
}
</script>

<template>
  <div class="d-flex flex-column w-100 h-100">
    <LocaleSaver/>
    <DocumentLocaleSetter/>
    <SiteNavBar class="flex-grow-0" @toggle="toggle"></SiteNavBar>
    <div class="flex-grow-1 overflow-hidden">
      <div class="d-flex flex-row w-100 h-100">
        <SideBar ref="sidebar" class="flex-grow-0 flex-shrink-0"></SideBar>
        <RouterView class="flex-grow-1 overflow-auto"/>
      </div>
    </div>
  </div>
</template>
