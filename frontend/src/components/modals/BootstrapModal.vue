<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {Modal} from 'bootstrap';

@Options({
  name: 'BootstrapModal',
  components: {},
})
export default class BootstrapModal extends Vue {
  //props
  @Prop({default: true})
  readonly closeOnOutsideClick!: boolean;
  @Prop({default: true})
  readonly closeOnKeyboardEsc!: boolean;
  @Prop({default: false})
  readonly scrollable!: boolean;
  @Prop({default: false})
  readonly centerVertically!: boolean;
  @Prop({default: undefined})
  readonly size!: 'sm' | 'lg' | 'xl' | null | undefined;

  //runtime
  private shownPromiseChain: Promise<void> | null = null;
  private hiddenPromiseChain: Promise<void> | null = null;

  //props
  get modalDialogClasses() {
    return {
      'modal-dialog-scrollable': this.scrollable,
      'modal-dialog-centered': this.centerVertically,
      'modal-sm': this.size === 'sm',
      'modal-lg': this.size === 'lg',
      'modal-xl': this.size === 'xl',
    };
  }

  //vue life cycle
  mounted(): void {
    this.addListeners();
  }

  updated(): void {
    this.removeListeners();
    this.addListeners();
  }

  beforeDestroy(): void {
    this.removeListeners();
  }

  //public functions
  open(): Promise<void> {
    if (!this.shownPromiseChain) {
      this.shownPromiseChain = new Promise(_ => {
      });
    }
    const ret = new Promise<void>(_ => {
    });
    this.shownPromiseChain.then(_ => ret);

    this.getModal().show();
    return ret;
  }

  dismiss(): Promise<void> {
    if (!this.hiddenPromiseChain) {
      this.hiddenPromiseChain = new Promise(_ => {
        console.log('hidden root');
      });
    }
    const ret = new Promise<void>(resolve => {
      console.log('hidden tail');
    });
    this.hiddenPromiseChain.then(_ => ret);

    this.getModal().hide();
    return ret;
  }

  //internal
  private getModalElement(): HTMLElement {
    return this.$refs.modal as HTMLElement;
  }

  private getModal(): Modal {
    return Modal.getOrCreateInstance(this.getModalElement())!;
  }

  private addListeners() {
    this.getModalElement().addEventListener('shown.bs.modal', this.onShown.bind(this));
    this.getModalElement().addEventListener('hidden.bs.modal', this.onHidden.bind(this));
  }

  private removeListeners() {
    this.getModalElement().removeEventListener('shown.bs.modal', this.onShown.bind(this));
    this.getModalElement().removeEventListener('hidden.bs.modal', this.onHidden.bind(this));
  }

  private onShown(): void {
    if (this.shownPromiseChain) {
      //trigger promise chain
      Promise.resolve().then(_ => {
        const ret = this.shownPromiseChain;
        this.shownPromiseChain = null;
        return ret;
      });
    }
  }

  private onHidden(): void {
    if (this.hiddenPromiseChain) {
      //trigger promise chain
      Promise.resolve().then(_ => {
        const ret = this.hiddenPromiseChain;
        this.hiddenPromiseChain = null;
        return ret;
      });
    }
  }
}
</script>

<template>
  <div ref="modal" :data-bs-backdrop="closeOnOutsideClick" :data-bs-keyboard="closeOnKeyboardEsc" class="modal"
       tabindex="-1">
    <div :class="modalDialogClasses" class="modal-dialog">
      <div class="modal-content">
        <slot name="modal-content">
          <div class="modal-header">
            <slot name="modal-header">
              <h5 class="modal-title">
                <slot name="modal-title">
                  Modal title
                </slot>
              </h5>
              <button aria-label="Close" class="btn-close" type="button" @click="dismiss"></button>
            </slot>
          </div>
          <div class="modal-body">
            <slot>
              <p>Modal body text goes here.</p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="modal-footer">
              <button class="btn btn-secondary" type="button" @click="dismiss">{{ $t('general.close') }}</button>
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
