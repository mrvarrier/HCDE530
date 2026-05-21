// Enhanced Information Architecture Generator
// Creates realistic, varied site structures based on URL and site type

export const generateRealisticIA = (url, siteType, rng) => {
  // Extract domain name for realistic page names
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('.')[0];
  const brandName = capitalize(domain);

  const generators = {
    ecommerce: () => generateEcommerceIA(brandName, rng),
    marketing: () => generateMarketingIA(brandName, rng),
    saas: () => generateSaaSIA(brandName, rng),
    blog: () => generateBlogIA(brandName, rng),
    portfolio: () => generatePortfolioIA(brandName, rng),
    documentation: () => generateDocsIA(brandName, rng)
  };

  const generator = generators[siteType] || generators.marketing;
  return generator();
};

// E-commerce site structure
const generateEcommerceIA = (brandName, rng) => {
  const categories = rng.pickMultiple([
    'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
    'Toys', 'Beauty', 'Automotive', 'Jewelry', 'Pet Supplies',
    'Health', 'Office', 'Outdoor', 'Kitchen', 'Tools'
  ], rng.nextInt(3, 6));

  const accountPages = ['Orders', 'Wishlist', 'Addresses', 'Payment Methods', 'Account Settings'];
  const selectedAccountPages = rng.pickMultiple(accountPages, rng.nextInt(3, 5));

  const hasDeals = rng.nextInt(0, 100) > 30;
  const hasBlog = rng.nextInt(0, 100) > 60;

  const children = [
    {
      name: 'Shop',
      children: categories.map(cat => ({ name: cat, children: [] }))
    },
    { name: 'Cart', children: [] },
    { name: 'Checkout', children: [] }
  ];

  if (hasDeals) {
    children.push({ name: 'Deals', children: [] });
  }

  children.push({
    name: 'My Account',
    children: selectedAccountPages.map(page => ({ name: page, children: [] }))
  });

  if (hasBlog) {
    children.push({ name: 'Blog', children: [] });
  }

  children.push({ name: 'Customer Service', children: [
    { name: 'Contact Us', children: [] },
    { name: 'Shipping Info', children: [] },
    { name: 'Returns', children: [] }
  ]});

  return {
    home: {
      name: 'Home',
      children
    },
    depth: 3,
    complexity: categories.length > 4 ? 'complex' : 'moderate',
    pageCount: 12 + categories.length + selectedAccountPages.length,
    issues: categories.length > 5 ? ['Too many top-level categories may overwhelm users'] : []
  };
};

// Marketing/Corporate site structure
const generateMarketingIA = (brandName, rng) => {
  const hasMultipleProducts = rng.nextInt(0, 100) > 50;
  const hasBlog = rng.nextInt(0, 100) > 40;
  const hasResources = rng.nextInt(0, 100) > 60;

  const children = [
    { name: 'About Us', children: [
      { name: 'Our Story', children: [] },
      { name: 'Team', children: [] },
      { name: 'Careers', children: [] }
    ]},
  ];

  if (hasMultipleProducts) {
    const products = rng.pickMultiple([
      'Enterprise', 'Professional', 'Starter', 'Premium', 'Basic',
      'Cloud', 'On-Premise', 'Mobile', 'Desktop'
    ], rng.nextInt(2, 4));

    children.push({
      name: 'Products',
      children: products.map(p => ({ name: p, children: [] }))
    });
  } else {
    children.push({ name: 'Product', children: [] });
  }

  children.push({
    name: 'Solutions',
    children: rng.pickMultiple([
      'For Enterprise', 'For Small Business', 'For Developers',
      'For Marketing', 'For Sales', 'For Support'
    ], rng.nextInt(2, 4)).map(s => ({ name: s, children: [] }))
  });

  children.push({ name: 'Pricing', children: [] });

  if (hasResources) {
    children.push({
      name: 'Resources',
      children: [
        { name: 'Documentation', children: [] },
        { name: 'Case Studies', children: [] },
        { name: 'Whitepapers', children: [] }
      ]
    });
  }

  if (hasBlog) {
    children.push({ name: 'Blog', children: [] });
  }

  children.push({ name: 'Contact', children: [] });

  return {
    home: {
      name: 'Home',
      children
    },
    depth: hasMultipleProducts || hasResources ? 3 : 2,
    complexity: hasMultipleProducts && hasResources ? 'moderate' : 'simple',
    pageCount: 8 + (hasMultipleProducts ? 3 : 0) + (hasResources ? 3 : 0),
    issues: []
  };
};

// SaaS application structure
const generateSaaSIA = (brandName, rng) => {
  const features = rng.pickMultiple([
    'Dashboard', 'Analytics', 'Reports', 'Projects', 'Tasks',
    'Calendar', 'Messages', 'Files', 'Contacts', 'Workflows'
  ], rng.nextInt(4, 7));

  const settingsSections = rng.pickMultiple([
    'Profile', 'Team', 'Billing', 'Integrations', 'Security',
    'Notifications', 'API Keys', 'Webhooks'
  ], rng.nextInt(4, 6));

  const children = features.map(feature => ({ name: feature, children: [] }));

  children.push({
    name: 'Settings',
    children: settingsSections.map(section => ({ name: section, children: [] }))
  });

  const hasHelp = rng.nextInt(0, 100) > 40;
  if (hasHelp) {
    children.push({
      name: 'Help & Support',
      children: [
        { name: 'Documentation', children: [] },
        { name: 'Tutorials', children: [] },
        { name: 'Contact Support', children: [] }
      ]
    });
  }

  return {
    home: {
      name: 'Home',
      children
    },
    depth: 2,
    complexity: features.length > 5 ? 'moderate' : 'simple',
    pageCount: features.length + settingsSections.length + 3,
    issues: features.length > 6 ? ['Navigation may be overwhelming for new users'] : []
  };
};

// Blog site structure
const generateBlogIA = (brandName, rng) => {
  const categories = rng.pickMultiple([
    'Technology', 'Design', 'Business', 'Marketing', 'Development',
    'Product', 'Culture', 'News', 'Tutorials', 'Case Studies',
    'Industry', 'Trends', 'Opinion', 'Reviews'
  ], rng.nextInt(4, 7));

  const hasAuthors = rng.nextInt(0, 100) > 60;
  const hasNewsletter = rng.nextInt(0, 100) > 50;
  const hasArchive = rng.nextInt(0, 100) > 40;

  const children = [
    {
      name: 'Articles',
      children: categories.map(cat => ({ name: cat, children: [] }))
    }
  ];

  if (hasAuthors) {
    children.push({ name: 'Authors', children: [] });
  }

  if (hasArchive) {
    children.push({ name: 'Archive', children: [] });
  }

  children.push({ name: 'About', children: [] });

  if (hasNewsletter) {
    children.push({ name: 'Newsletter', children: [] });
  }

  children.push({ name: 'Contact', children: [] });

  return {
    home: {
      name: 'Home',
      children
    },
    depth: 2,
    complexity: categories.length > 5 ? 'moderate' : 'simple',
    pageCount: 5 + categories.length,
    issues: categories.length > 6 ? ['Too many categories may fragment content discovery'] : []
  };
};

// Portfolio site structure
const generatePortfolioIA = (brandName, rng) => {
  const projectTypes = rng.pickMultiple([
    'Web Design', 'Branding', 'Mobile Apps', 'UI/UX',
    'Illustration', 'Photography', 'Motion Graphics'
  ], rng.nextInt(2, 4));

  const hasDetailedAbout = rng.nextInt(0, 100) > 50;
  const hasTestimonials = rng.nextInt(0, 100) > 60;
  const hasBlog = rng.nextInt(0, 100) > 30;

  const children = [];

  if (projectTypes.length > 2) {
    children.push({
      name: 'Work',
      children: projectTypes.map(type => ({ name: type, children: [] }))
    });
  } else {
    children.push({ name: 'Portfolio', children: [] });
  }

  if (hasDetailedAbout) {
    children.push({
      name: 'About',
      children: [
        { name: 'Bio', children: [] },
        { name: 'Experience', children: [] },
        { name: 'Skills', children: [] }
      ]
    });
  } else {
    children.push({ name: 'About', children: [] });
  }

  if (hasTestimonials) {
    children.push({ name: 'Testimonials', children: [] });
  }

  if (hasBlog) {
    children.push({ name: 'Journal', children: [] });
  }

  children.push({ name: 'Contact', children: [] });

  return {
    home: {
      name: 'Home',
      children
    },
    depth: hasDetailedAbout || projectTypes.length > 2 ? 2 : 1,
    complexity: 'simple',
    pageCount: 4 + projectTypes.length,
    issues: []
  };
};

// Documentation site structure
const generateDocsIA = (brandName, rng) => {
  const apiSections = rng.pickMultiple([
    'Authentication', 'REST API', 'GraphQL', 'Webhooks',
    'Rate Limits', 'Errors', 'Pagination', 'Filtering'
  ], rng.nextInt(4, 6));

  const guideTopics = rng.pickMultiple([
    'Quick Start', 'Installation', 'Configuration', 'Deployment',
    'Best Practices', 'Troubleshooting', 'Migration', 'Security'
  ], rng.nextInt(5, 7));

  const hasSDKs = rng.nextInt(0, 100) > 50;
  const hasCommunity = rng.nextInt(0, 100) > 60;

  const children = [
    { name: 'Overview', children: [] },
    {
      name: 'Getting Started',
      children: [
        { name: 'Installation', children: [] },
        { name: 'Quick Start', children: [] },
        { name: 'Basic Concepts', children: [] }
      ]
    },
    {
      name: 'API Reference',
      children: apiSections.map(section => ({ name: section, children: [] }))
    },
    {
      name: 'Guides',
      children: guideTopics.map(topic => ({ name: topic, children: [] }))
    }
  ];

  if (hasSDKs) {
    children.push({
      name: 'SDKs & Libraries',
      children: [
        { name: 'JavaScript', children: [] },
        { name: 'Python', children: [] },
        { name: 'Ruby', children: [] }
      ]
    });
  }

  children.push({ name: 'Examples', children: [] });

  if (hasCommunity) {
    children.push({
      name: 'Community',
      children: [
        { name: 'Forum', children: [] },
        { name: 'Discord', children: [] },
        { name: 'GitHub', children: [] }
      ]
    });
  }

  return {
    home: {
      name: 'Documentation Home',
      children
    },
    depth: 3,
    complexity: 'moderate',
    pageCount: 10 + apiSections.length + guideTopics.length,
    issues: apiSections.length + guideTopics.length > 12 ?
      ['Large documentation may benefit from improved search and filtering'] : []
  };
};

// Helper function
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
