/**
 * SEO Configuration
 * Anahtar kelimeler ve SEO parametreleri
 * Multi-language support: TR, EN, FR
 */

export type Language = 'tr' | 'en' | 'fr';

export const seoConfig = {
  // Ana Site Bilgileri
  siteName: {
    tr: "Cinema Sphere",
    en: "Cinema Sphere",
    fr: "Cinema Sphere"
  },
  siteUrl: "https://film-search-api.vercel.app", // Production URL
  
  // Dil Bazlı Başlıklar ve Açıklamalar
  defaultTitle: {
    tr: "Cinema Sphere - En İyi Film ve Dizi Arama Sitesi | OMDb API",
    en: "Cinema Sphere - Best Movie and Series Search Site | OMDb API",
    fr: "Cinema Sphere - Meilleur Site de Recherche de Films et Séries | OMDb API"
  },
  defaultDescription: {
    tr: "Ücretsiz film ve dizi bilgileri için en kapsamlı arama motoru. OMDb API ile binlerce film, TV dizisi ve bölüm bilgilerini keşfedin. Yıl, tür ve başlığa göre filtreleme yapın.",
    en: "The most comprehensive search engine for free movie and series information. Discover thousands of movies, TV series and episode information with OMDb API. Filter by year, genre and title.",
    fr: "Le moteur de recherche le plus complet pour les informations gratuites sur les films et séries. Découvrez des milliers de films, séries TV et informations sur les épisodes avec l'API OMDb. Filtrez par année, genre et titre."
  },
  
  // Ana Anahtar Kelimeler (Primary Keywords) - Çoklu Dil
  primaryKeywords: {
    tr: [
      "film arama",
      "dizi arama",
      "film veritabanı",
      "OMDb API",
      "film bilgileri",
      "dizi bilgileri",
      "film detayları",
      "IMDb verileri",
      "ücretsiz film arama",
      "film arşivi"
    ],
    en: [
      "movie search",
      "series search",
      "movie database",
      "OMDb API",
      "movie information",
      "series information",
      "movie details",
      "IMDb data",
      "free movie search",
      "movie archive"
    ],
    fr: [
      "recherche de films",
      "recherche de séries",
      "base de données de films",
      "API OMDb",
      "informations sur les films",
      "informations sur les séries",
      "détails du film",
      "données IMDb",
      "recherche gratuite de films",
      "archives de films"
    ]
  },

  // Uzun Kuyruklu Anahtar Kelimeler (Long-tail Keywords) - Çoklu Dil
  longTailKeywords: {
    tr: [
      "en iyi film arama sitesi",
      "OMDb API film arama",
      "film veritabanı arama",
      "ücretsiz film bilgileri arama",
      "film ve dizi arama motoru",
      "hangi filmler var",
      "popüler filmler listesi",
      "yeni çıkan filmler",
      "IMDb puanlı filmler",
      "türe göre film arama",
      "yıla göre film arama",
      "film detay sayfası",
      "dizi detay sayfası"
    ],
    en: [
      "best movie search site",
      "OMDb API movie search",
      "movie database search",
      "free movie information search",
      "movie and series search engine",
      "what movies are available",
      "popular movies list",
      "new movies",
      "IMDb rated movies",
      "search movies by genre",
      "search movies by year",
      "movie detail page",
      "series detail page"
    ],
    fr: [
      "meilleur site de recherche de films",
      "recherche de films API OMDb",
      "recherche de base de données de films",
      "recherche gratuite d'informations sur les films",
      "moteur de recherche de films et séries",
      "quels films sont disponibles",
      "liste de films populaires",
      "nouveaux films",
      "films notés IMDb",
      "rechercher des films par genre",
      "rechercher des films par année",
      "page de détails du film",
      "page de détails de la série"
    ]
  },

  // Sayfa Bazlı Anahtar Kelimeler - Çoklu Dil
  pageKeywords: {
    home: {
      tr: ["ana sayfa", "film keşfet", "popüler filmler", "yeni filmler", "en iyi diziler", "film kategorileri"],
      en: ["home", "discover movies", "popular movies", "new movies", "best series", "movie categories"],
      fr: ["accueil", "découvrir des films", "films populaires", "nouveaux films", "meilleures séries", "catégories de films"]
    },
    movies: {
      tr: ["film listesi", "tüm filmler", "film katalog", "film arşivi", "sinema filmleri"],
      en: ["movie list", "all movies", "movie catalog", "movie archive", "cinema movies"],
      fr: ["liste de films", "tous les films", "catalogue de films", "archives de films", "films de cinéma"]
    },
    series: {
      tr: ["dizi listesi", "TV dizileri", "dizi katalog", "dizi arşivi", "televizyon dizileri"],
      en: ["series list", "TV series", "series catalog", "series archive", "television series"],
      fr: ["liste de séries", "séries TV", "catalogue de séries", "archives de séries", "séries télévisées"]
    },
    search: {
      tr: ["film ara", "dizi ara", "arama sonuçları", "film bul", "dizi bul"],
      en: ["search movies", "search series", "search results", "find movies", "find series"],
      fr: ["rechercher des films", "rechercher des séries", "résultats de recherche", "trouver des films", "trouver des séries"]
    },
    filter: {
      tr: ["film filtrele", "dizi filtrele", "yıla göre filtrele", "türe göre filtrele", "film keşfet"],
      en: ["filter movies", "filter series", "filter by year", "filter by genre", "discover movies"],
      fr: ["filtrer les films", "filtrer les séries", "filtrer par année", "filtrer par genre", "découvrir des films"]
    },
    category: {
      tr: ["film türleri", "dizi kategorileri", "türe göre filmler", "aksiyon filmleri", "drama dizileri", "komedi filmleri"],
      en: ["movie genres", "series categories", "movies by genre", "action movies", "drama series", "comedy movies"],
      fr: ["genres de films", "catégories de séries", "films par genre", "films d'action", "séries dramatiques", "films comiques"]
    },
    year: {
      tr: ["yıla göre filmler", "yıla göre diziler", "2024 filmleri", "2023 filmleri", "vintage filmler"],
      en: ["movies by year", "series by year", "2024 movies", "2023 movies", "vintage movies"],
      fr: ["films par année", "séries par année", "films 2024", "films 2023", "films vintage"]
    }
  },

  // Sesli Arama İçin Doğal İfadeler - Çoklu Dil
  voiceSearchKeywords: {
    tr: [
      "hangi filmler var",
      "popüler filmler neler",
      "en iyi diziler hangileri",
      "2024 yılı filmleri",
      "aksiyon filmleri listesi",
      "komedi dizileri neler",
      "yüksek puanlı filmler",
      "yeni çıkan diziler"
    ],
    en: [
      "what movies are available",
      "what are popular movies",
      "what are the best series",
      "2024 movies",
      "action movies list",
      "what are comedy series",
      "high rated movies",
      "new series"
    ],
    fr: [
      "quels films sont disponibles",
      "quels sont les films populaires",
      "quelles sont les meilleures séries",
      "films 2024",
      "liste de films d'action",
      "quelles sont les séries comiques",
      "films bien notés",
      "nouvelles séries"
    ]
  },

  // Meta Tags İçin Varsayılan Değerler
  defaultMeta: {
    author: "Cinema Sphere",
    robots: "index, follow",
    languages: {
      tr: "tr_TR",
      en: "en_US",
      fr: "fr_FR"
    },
    ogType: "website",
    twitterCard: "summary_large_image"
  },

  // Open Graph Varsayılan Görseller
  ogImages: {
    default: "/og-image.jpg", // Ana sayfa için
    movies: "/og-movies.jpg",
    series: "/og-series.jpg"
  }
};

/**
 * Dinamik SEO Metadata Oluşturucu - Çoklu Dil Desteği
 */
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  path = "",
  image = seoConfig.ogImages.default,
  type = "website",
  lang = "tr" as Language
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: string;
  lang?: Language;
}) {
  const siteName = seoConfig.siteName[lang];
  const defaultTitle = seoConfig.defaultTitle[lang];
  const defaultDescription = seoConfig.defaultDescription[lang];
  const primaryKeywords = seoConfig.primaryKeywords[lang];
  
  const fullTitle = title 
    ? `${title} | ${siteName}`
    : defaultTitle;
  
  const fullDescription = description || defaultDescription;
  const fullKeywords = [...primaryKeywords, ...keywords].join(", ");
  const canonicalUrl = `${seoConfig.siteUrl}${path}`;
  const ogImageUrl = `${seoConfig.siteUrl}${image}`;
  const locale = seoConfig.defaultMeta.languages[lang];

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: [{ name: seoConfig.defaultMeta.author }],
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl,
      siteName: siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: locale,
      type: type as "website" | "article",
      alternateLocale: Object.values(seoConfig.defaultMeta.languages).filter(l => l !== locale),
    },
    twitter: {
      card: seoConfig.defaultMeta.twitterCard,
      title: fullTitle,
      description: fullDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'tr': `${seoConfig.siteUrl}${path}`,
        'en': `${seoConfig.siteUrl}/en${path}`,
        'fr': `${seoConfig.siteUrl}/fr${path}`,
      }
    },
    robots: "index, follow",
  };
}

