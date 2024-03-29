export function createEl(tagName, props = {}) {
  const el = document.createElement(tagName);
  Object.assign(el, props);
  Object.assign(el.style, props.style);
  return el;
}

export function getDataFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setDataToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

export function getTargetedItemId(target) {
  return target.parentElement.id || target.parentElement.parentElement.id;
}

export function delegateEvent(target, selector, type, handler, capture) {
  const dispatchEvent = (e) => {
    const targetElement = e.target;
    const potentialElements = qsAll(selector, target);
    let elementsCount = potentialElements.length;

    while (elementsCount--) {
      if (potentialElements[elementsCount] === targetElement) {
        handler.call(targetElement, e);
      }
    }
  };

  target.addEventListener(type, dispatchEvent, capture);
}

export const escapeForHTML = (s) =>
  s.replace(/[&<]/g, (c) => (c === '&' ? '&amp;' : '&lt;'));

export const escapeForHTMLAttributes = (s) =>
  s.replace(/'/g, '&apos;').replace(/"/g, '&quot;');

export const changeLocationTo = (href) => (window.location.href = href);

export const onReloadPage = () => window.location.reload();

export function outsideClickHandler(target, callbackFn) {
  const handler = (e) => {
    if (e.target !== target) {
      callbackFn();
      window.removeEventListener('click', handler);
    }
  };
  window.addEventListener('click', handler);
}

export function isUserLoggedIn() {
  return !!JSON.parse(localStorage.getItem('userData'))?.token;
}
