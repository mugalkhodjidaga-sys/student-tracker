/**
 * Bundled images from Shivayogi Jnana Mandira (mugalkhodjidagamath.org/sjm).
 * Stored in public/ so GitHub Pages and offline PWA can load them.
 */
const base = import.meta.env.BASE_URL;

export const SJM_WEBSITE_URL = 'https://mugalkhodjidagamath.org/sjm';

const img = (name) => `${base}images/sjm/${name}`;

export const SJM_IMAGES = {
  logo: `${base}sjm-logo.jpg`,
  hero: img('hero.jpeg'),
  campus: img('campus.jpeg'),
  meals: img('meals.jpeg'),
  activities: img('activities.jpeg'),
  cultural: img('cultural.jpeg'),
};

export const SJM_GALLERY = [
  SJM_IMAGES.hero,
  SJM_IMAGES.campus,
  SJM_IMAGES.meals,
  SJM_IMAGES.activities,
  SJM_IMAGES.cultural,
];
