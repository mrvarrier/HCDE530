// URL classification utility
// Determines the type of website based on domain and URL patterns

export const classifyURL = (url) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname.toLowerCase();
    const path = urlObj.pathname.toLowerCase();

    // Check for specific patterns
    if (domain.includes('shop') || domain.includes('store') || domain.includes('buy') ||
        path.includes('/cart') || path.includes('/checkout') || path.includes('/products')) {
      return 'ecommerce';
    }

    if (domain.includes('blog') || path.includes('/blog') || path.includes('/article')) {
      return 'blog';
    }

    if (domain.includes('doc') || domain.includes('guide') ||
        path.includes('/docs') || path.includes('/documentation')) {
      return 'documentation';
    }

    if (domain.includes('portfolio') || domain.includes('design') ||
        path.includes('/portfolio') || path.includes('/work')) {
      return 'portfolio';
    }

    if (domain.includes('app') || domain.includes('dash') || domain.includes('saas')) {
      return 'saas';
    }

    // Default to marketing/corporate site
    return 'marketing';
  } catch (error) {
    return 'marketing';
  }
};

export const getSiteTypeLabel = (type) => {
  const labels = {
    ecommerce: 'E-commerce',
    blog: 'Blog / Content',
    documentation: 'Documentation',
    portfolio: 'Portfolio',
    saas: 'SaaS Application',
    marketing: 'Marketing / Corporate'
  };

  return labels[type] || 'Unknown';
};
