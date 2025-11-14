
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// This slugify function must be identical to the one in the app
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

function getCoursePages() {
  try {
    const constantsPath = path.resolve(projectRoot, 'constants.tsx');
    const constantsContent = fs.readFileSync(constantsPath, 'utf-8');

    // Extract the rawCourses array as a string using a regex
    const rawCoursesMatch = constantsContent.match(/const rawCourses:.*? = (\[[\s\S]*?\]);/);

    if (!rawCoursesMatch || !rawCoursesMatch[1]) {
      console.error('Could not find rawCourses array in constants.tsx.');
      return [];
    }
    
    const rawCoursesString = rawCoursesMatch[1];
    
    // Extract titles from the array string
    const titleRegex = /title:\s*'([^']+)'/g;
    const titles = [];
    let match;
    while ((match = titleRegex.exec(rawCoursesString)) !== null) {
      titles.push(match[1]);
    }
    
    return titles.map(title => `/course/${slugify(title)}`);

  } catch (error) {
    console.error('Error reading or parsing constants.tsx:', error);
    return [];
  }
}


const BASE_URL = 'https://ai-explorers-academy.com';

const staticPages = [
    '/',
    '/privacy-policy',
    '/terms-of-service',
    '/contact',
    '/profile/favorites',
    '/login',
    '/signup'
];

const coursePages = getCoursePages();

if (coursePages.length === 0) {
    console.warn('Warning: No course pages were found. The sitemap might be incomplete.');
}

const allPages = [...staticPages, ...coursePages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
    <url>
      <loc>${`${BASE_URL}${page}`}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>`).join('')}
</urlset>`;

try {
  const publicDir = path.resolve(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
  }
  const sitemapPath = path.resolve(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap.trim());
  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  console.log(`\nThis file is now available to your dev server. You should be able to see it at /sitemap.xml.`);
  console.log(`Remember to run this script ('node scripts/generate-sitemap.mjs') when you add new courses!`);
} catch (error) {
  console.error('Error writing sitemap.xml:', error);
}
