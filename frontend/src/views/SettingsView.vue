<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'SettingsView',
  components: {},
})
export default class SettingsView extends Vue {
}
</script>

<template>
  <div class="p-2">
    <h1>{{ $t('settings.settings') }}</h1>
    {{ $t('settings.currentlyNoSettings') }}
  </div>
</template>
