import useEmitter from '@/composables/emitter';
import {LabelStore} from '@/stores/LabelStore';
import {ReportStore} from '@/stores/ReportStore';
import {ValueStore} from '@/stores/ValueStore';

useEmitter().on('authChanged', () => new LabelStore().reload());
useEmitter().on('authChanged', () => new ReportStore().reload());
useEmitter().on('authChanged', () => new ValueStore().reload());