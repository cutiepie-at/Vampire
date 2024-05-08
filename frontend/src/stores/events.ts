import useEmitter from '@/composables/emitter';
import {LabelStore} from '@/stores/LabelStore';
import {ValueStore} from '@/stores/ValueStore';

useEmitter().on('authChanged', () => new LabelStore().reload());
useEmitter().on('authChanged', () => new ValueStore().reload());