export function navItemIsVisible(item, counts, defaultMinimum = 1) {
  if (item.always) return true;
  const min = item.minItems ?? defaultMinimum;
  if (item.collections) return item.collections.some((c) => counts[c] >= min);
  if (!item.collection) return true;
  return counts[item.collection] >= min;
}

export function visibleNavigation(nav, counts, defaultMinimum = 1) {
  return nav.filter((item) => navItemIsVisible(item, counts, defaultMinimum));
}

/** Whether `path` is inside a nav section (its `match` prefixes, or its href). */
export function navItemIsActive(item, path) {
  return (item.match ?? [item.href]).some((prefix) => path === prefix || path.startsWith(prefix));
}
