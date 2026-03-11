/**
 * Local product image registry.
 * Used as fallback when a product has no server-side image URL.
 * Match priority: product name keywords → subcategory → category.
 */

export const LOCAL_PRODUCT_IMAGES = {
  // Sénega'lait — Lait frais pasteurisé (blue label)
  lait_frais: require('../pictures/IMG-20250412-WA0050.jpg'),
  // Sénega'lait — Lait frais pasteurisé (dark navy bg variant)
  lait_frais_alt: require('../pictures/IMG-20250412-WA0051.jpg'),
  // Sénega'lait — Soow piir / lait caillé (red label)
  soow_piir: require('../pictures/IMG-20250412-WA0052.jpg'),
  // Sénega'lait — Soow piir (light bg variant)
  soow_piir_alt: require('../pictures/IMG-20250412-WA0053.jpg'),
};

// Banner / hero image (clean cream background looks great on the green banner)
export const HERO_IMAGE = require('../pictures/IMG-20250412-WA0053.jpg');

/**
 * Returns a local require() source for a product, or null if no match.
 * @param {Object} product - product object from API
 */
export const getLocalProductImage = (product) => {
  if (!product) return null;
  const name = (product.name || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();

  // Soow piir / lait caillé / fermenté
  if (name.includes('soow') || name.includes('piir') || name.includes('caillé') ||
      name.includes('ferment') || sub === 'yogurt') {
    return LOCAL_PRODUCT_IMAGES.soow_piir;
  }

  // Lait frais pasteurisé / lait entier
  if (name.includes('lait') || name.includes('milk') || name.includes('pasteurisé') ||
      name.includes('frais') || sub === 'milk') {
    return LOCAL_PRODUCT_IMAGES.lait_frais;
  }

  // Generic dairy fallback
  if (product.category === 'dairy') {
    return LOCAL_PRODUCT_IMAGES.lait_frais;
  }

  return null;
};
