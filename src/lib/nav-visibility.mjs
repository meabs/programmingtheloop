export function navItemIsVisible(item, counts, defaultMinimum = 1) {
  if (item.always || !item.collection) return true;
  return counts[item.collection] >= (item.minItems ?? defaultMinimum);
}

export function visibleNavigation(nav, counts, defaultMinimum = 1) {
  return nav.filter((item) => navItemIsVisible(item, counts, defaultMinimum))
    .map((item, index) => ({ ...item, num: String(index).padStart(2, '0') }));
}
