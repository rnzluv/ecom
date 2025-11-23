const mapping = [
  { keywords: ['ring', 'wedding', 'engagement', 'fashion'], file: 'Rings.png' },
  { keywords: ['necklace', 'pendant', 'chain'], file: 'Necklaces.png' },
  { keywords: ['earring', 'hoop', 'stud', 'dangle'], file: 'Earrings.png' },
  { keywords: ['bracelet', 'bangle', 'cuff'], file: 'Bracelets.png' },
  { keywords: ['collection', 'limited', 'seasonal'], file: 'Collection.png' },
  { keywords: ['banner', 'hero'], file: 'banner.png' }
];

export function getFallbackImage(name = '') {
  if (!name) return new URL('../images/placeholder.jpg', import.meta.url).href;
  const lower = name.toLowerCase();
  for (const m of mapping) {
    for (const kw of m.keywords) {
      if (lower.includes(kw)) return new URL(`../images/${m.file}`, import.meta.url).href;
    }
  }
  // pick a neutral default
  return new URL('../images/Collection.png', import.meta.url).href;
}

export default getFallbackImage;
