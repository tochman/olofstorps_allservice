/**
 * Import all gallery images to ensure they're bundled by Vite
 * These images are referenced in data-image attributes which Vite doesn't parse automatically
 */

// Import images that are only in data-image attributes
import murat2 from '../../img/olofstorps/murat_2_new.png';
import fasad2 from '../../img/olofstorps/fasad_2.jpg';

// Export for use if needed
export const galleryImages = {
  murat_2_new: murat2,
  fasad_2: fasad2
};
