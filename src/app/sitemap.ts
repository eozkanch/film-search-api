import { MetadataRoute } from 'next'
import { seoConfig } from './config/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoConfig.siteUrl

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/filter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = [
    'action', 'adventure', 'comedy', 'drama', 'horror', 
    'thriller', 'sciFi', 'romance', 'fantasy', 'animation', 
    'crime', 'mystery'
  ].map(genre => ({
    url: `${baseUrl}/category/${genre}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Year pages (last 5 years)
  const currentYear = new Date().getFullYear()
  const yearPages: MetadataRoute.Sitemap = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => ({
    url: `${baseUrl}/year/${year}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...yearPages]
}


