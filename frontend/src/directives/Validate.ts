//v-visible
import type {Directive, DirectiveBinding} from 'vue';
import type {DirectiveHook} from '@vue/runtime-core';
import type {VueI18n} from 'vue-i18n';

export type ValidatableClass = {
  attributeTypeMap: Array<{
    name: string,
    baseName: string,
    type: string,
    format: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number,
    pattern?: string,
  }>,
};
export type ValidateModel<T extends ValidatableClass> = [T, keyof T, VueI18n];

function applyAttrs(el: HTMLInputElement, cls: ValidatableClass, propName: string) {
  const attrs = cls.attributeTypeMap.find((e: { name: string }) => e.name === propName);
  //required in the model means the prop has to present in json, not that that strings need length > 0
  // if (attrs?.required !== undefined) {
  //   el.ariaRequired = '' + attrs.required;
  //   el.required = attrs.required;
  // }
  if (attrs?.minLength !== undefined) {
    el.minLength = attrs.minLength;

    //also set required in order for input validation to work
    el.ariaRequired = '' + true;
    el.required = true;
  }
  if (attrs?.maxLength !== undefined) {
    el.maxLength = attrs.maxLength;
  }
  if (attrs?.min !== undefined) {
    el.ariaValueMin = '' + attrs.min;
    el.min = '' + attrs.min;
  }
  if (attrs?.max !== undefined) {
    el.ariaValueMax = '' + attrs.max;
    el.max = '' + attrs.max;
  }
  if (attrs?.pattern !== undefined) {
    el.pattern = '' + attrs.pattern;
  }
}

function validate(el: HTMLInputElement, validateEl: HTMLElement, i18n: VueI18n, onlyIfValid: boolean = false) {
  el.reportValidity();
  if (el.validity.valid) {
    el.classList.remove('is-invalid');
    validateEl!.innerText = '';
  } else if (!onlyIfValid) {
    el.classList.add('is-invalid');
    if (el.validity.valueMissing) {
      validateEl!.innerText = i18n.t(`validation.valueMissing`);
    } else if (el.validity.tooShort) {
      validateEl!.innerText = i18n.t(`validation.tooShort`, {minLength: el.minLength});
    } else if (el.validity.tooLong) {
      validateEl!.innerText = i18n.t(`validation.tooLong`, {maxLength: el.maxLength});
    } else if (el.validity.rangeUnderflow) {
      validateEl!.innerText = i18n.t(`validation.rangeUnderflow`, {min: el.min});
    } else if (el.validity.rangeOverflow) {
      validateEl!.innerText = i18n.t(`validation.rangeOverflow`, {max: el.max});
    } else if (el.validity.patternMismatch) {
      validateEl!.innerText = i18n.t(`validation.patternMismatch`, {pattern: el.pattern});
    } else {
      validateEl!.innerText = i18n.t(`validation.unknown`);
    }
  }
}

const update: DirectiveHook<HTMLInputElement, any, ValidateModel<any>> =
  (el: HTMLInputElement, binding: DirectiveBinding<ValidateModel<any>>) => {
    applyAttrs(el, binding.value[0], binding.value[1] as string);
    const i18n = binding.value[2];
    if (el.parentNode) {
      let validateEl = el.parentNode.querySelector('.invalid-feedback') as HTMLElement | null;
      if (!validateEl) {
        validateEl = document.createElement('div');
        validateEl.classList.add('invalid-feedback');
        el.parentNode.appendChild(validateEl);
        el.addEventListener('blur', _ => {
          validate(el, validateEl!, i18n);
        });
        el.addEventListener('keydown', event => {
          if (event.key === 'Enter' && !event.shiftKey) {
            validate(el, validateEl!, i18n);
          }
        });
        el.addEventListener('input', _ => {
          validate(el, validateEl!, i18n, true);
        });
        el.addEventListener('change', _ => {
          validate(el, validateEl!, i18n, true);
        });
      }
    }
  };

export const Validate = {
  mounted: update,
  updated: update,
} as Directive<HTMLElement, ValidateModel<any>>;