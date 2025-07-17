/**
 * Image utilities for property management
 * Handles image defaults, placeholders, and validation
 */

/**
 * Default placeholder images for different property types
 */
const DEFAULT_PROPERTY_IMAGES = {
  residential: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop&auto=format",
  commercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format",
  industrial: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop&auto=format",
  land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format",
  villa: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&auto=format",
  apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format",
  default: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format"
};

/**
 * Get default image URL for a property type
 * @param {string} propertyType - Type of property
 * @returns {string} Default image URL
 */
function getDefaultImageForPropertyType(propertyType) {
  const type = (propertyType || 'default').toLowerCase();
  return DEFAULT_PROPERTY_IMAGES[type] || DEFAULT_PROPERTY_IMAGES.default;
}

/**
 * Ensure property has at least one image
 * @param {Object} property - Property object
 * @returns {Object} Property with guaranteed images array
 */
function ensurePropertyImages(property) {
  // If property has no images or empty images array
  if (!property.images || property.images.length === 0) {
    const defaultImage = getDefaultImageForPropertyType(property.property_type);
    
    property.images = [{
      id: null,
      image_url: defaultImage,
      is_primary: true,
      cloudinary_public_id: null,
      isPlaceholder: true
    }];

    // Also set the main image_url if not present
    if (!property.image_url) {
      property.image_url = defaultImage;
    }
  }

  return property;
}

/**
 * Validate image URLs and filter out broken ones
 * @param {Array} images - Array of image objects
 * @returns {Array} Filtered array of valid images
 */
function validateImages(images) {
  if (!Array.isArray(images)) return [];
  
  return images.filter(image => {
    if (!image || !image.image_url) return false;
    
    // Basic URL validation
    try {
      new URL(image.image_url);
      return true;
    } catch (error) {
      console.warn(`Invalid image URL detected: ${image.image_url}`);
      return false;
    }
  });
}

/**
 * Process property images for API response
 * @param {Object} property - Property object
 * @returns {Object} Property with processed images
 */
function processPropertyImages(property) {
  // Validate existing images
  if (property.images) {
    property.images = validateImages(property.images);
  }

  // Ensure property has images (adds placeholder if needed)
  property = ensurePropertyImages(property);

  return property;
}

/**
 * Get placeholder image info for frontend
 * @param {string} propertyType - Type of property
 * @param {string} propertyName - Name of property
 * @returns {Object} Placeholder image info
 */
function getPlaceholderImageInfo(propertyType, propertyName) {
  return {
    showPlaceholder: true,
    placeholderType: propertyType || 'property',
    placeholderName: propertyName || 'Property Image',
    defaultImageUrl: getDefaultImageForPropertyType(propertyType),
    placeholderIcon: getPropertyTypeIcon(propertyType)
  };
}

/**
 * Get icon name for property type
 * @param {string} propertyType - Type of property
 * @returns {string} Icon name for the property type
 */
function getPropertyTypeIcon(propertyType) {
  const icons = {
    residential: 'home',
    commercial: 'building',
    industrial: 'package',
    land: 'map',
    villa: 'home',
    apartment: 'building',
    office: 'briefcase',
    default: 'home'
  };

  const type = (propertyType || 'default').toLowerCase();
  return icons[type] || icons.default;
}

module.exports = {
  DEFAULT_PROPERTY_IMAGES,
  getDefaultImageForPropertyType,
  ensurePropertyImages,
  validateImages,
  processPropertyImages,
  getPlaceholderImageInfo,
  getPropertyTypeIcon
}; 