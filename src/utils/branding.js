/**
 * Images from https://mugalkhodjidagamath.org/sjm
 * Gallery files live at site root: /imgesjidga/
 */
const SITE_ORIGIN = 'https://mugalkhodjidagamath.org';

export const SJM_WEBSITE_URL = `${SITE_ORIGIN}/sjm`;

export const SJM_IMAGES = {
  logo: `${SITE_ORIGIN}/logo.jpg`,
  /** Students / campus life */
  hero: galleryUrl('Final Print 114-114.jpeg'),
  campus: galleryUrl('Final Print 126-126.jpeg'),
  /** Community meals (Annaprasada) */
  meals: galleryUrl('Final Print 118-118.jpeg'),
  /** Yoga / activities */
  activities: galleryUrl('Final Print 103-103.jpeg'),
  /** Cultural programs */
  cultural: galleryUrl('Final Print 122-122.jpeg'),
  /** Mahaswamiji */
  gurus: galleryUrl('Final Print 100-100.jpeg'),
};

/** All gallery images from the SJM page */
export const SJM_GALLERY = [
  'Final Print 100-100.jpeg',
  'Final Print 103-103.jpeg',
  'Final Print 104-104.jpeg',
  'Final Print 107-107.jpeg',
  'Final Print 109-109.jpeg',
  'Final Print 112-112.jpeg',
  'Final Print 114-114.jpeg',
  'Final Print 115-115.jpeg',
  'Final Print 118-118.jpeg',
  'Final Print 119-119.jpeg',
  'Final Print 122-122.jpeg',
  'Final Print 125-125.jpeg',
  'Final Print 126-126.jpeg',
  'Final Print 131-131.jpeg',
  'Final Print 134-134.jpeg',
  'Final Print 136-136.jpeg',
].map(galleryUrl);

function galleryUrl(filename) {
  return `${SITE_ORIGIN}/imgesjidga/${encodeURIComponent(filename)}`;
}
