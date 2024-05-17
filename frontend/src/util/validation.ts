export function checkValidity(el: Element): boolean {
  return [...el.querySelectorAll('input').values()].every(e => e.checkValidity());
}

export function resetValidity(el: Element): boolean {
  return [...el.querySelectorAll('input').values()].every(e => e.classList.remove('is-invalid'));
}