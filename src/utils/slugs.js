/**
 * Converts a table name to a URL-friendly slug.
 * Example: "olist_order_items_dataset" -> "olist-order-items-dataset"
 */
export const toSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/_/g, '-')      // Replace underscores with hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')       // Trim hyphens from start
    .replace(/-+$/, '');      // Trim hyphens from end
};

/**
 * Converts a slug back to a table name (best effort, assuming hyphens were underscores).
 * Note: This might not be 100% accurate if the original name had both hyphens and underscores,
 * so it's better to store the original name and look it up.
 */
export const fromSlug = (slug, originalNames) => {
  if (originalNames) {
    return originalNames.find(name => toSlug(name) === slug) || slug;
  }
  return slug.replace(/-/g, '_');
};
