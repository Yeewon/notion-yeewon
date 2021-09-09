export const $ = (selector, $target = document) => $target.querySelector(selector);
export const $$ = (selector, $target = document) => $target.querySelectorAll(selector);

export const setClassName = (name, $target) => ($target.className = name);
export const addClassName = (name, $target) => $target.classList.add(name);
export const removeClassName = (name, $target) => $target.classList.remove(name);
export const replaceClassName = (targetName, replaceName, $target) => $target.className.replace(targetName, replaceName);
