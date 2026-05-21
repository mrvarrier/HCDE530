// Finding templates for different audit categories and website types

export const accessibilityFindings = {
  ecommerce: [
    {
      title: 'Missing alt text on product images',
      severity: 'critical',
      category: 'accessibility',
      impact: 'Screen reader users cannot identify products',
      recommendation: 'Add descriptive alt text to all product images describing the item, color, and key features.'
    },
    {
      title: 'Checkout form lacks proper labels',
      severity: 'critical',
      category: 'accessibility',
      impact: 'Users with screen readers cannot complete purchases',
      recommendation: 'Ensure all form inputs have associated labels using <label> elements or aria-label attributes.'
    },
    {
      title: 'Low contrast on price text',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Users with visual impairments struggle to read pricing',
      recommendation: 'Increase contrast ratio to at least 4.5:1 for normal text, 3:1 for large text (WCAG AA).'
    },
    {
      title: 'Product filter buttons too small',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Mobile users and those with motor impairments have difficulty tapping',
      recommendation: 'Increase touch target size to minimum 44x44px as per WCAG 2.1 guidelines.'
    }
  ],
  marketing: [
    {
      title: 'Hero section images missing alt text',
      severity: 'critical',
      category: 'accessibility',
      impact: 'Screen reader users miss key visual messaging',
      recommendation: 'Add descriptive alt text to hero images that conveys the message and purpose.'
    },
    {
      title: 'CTA buttons have insufficient contrast',
      severity: 'high',
      category: 'accessibility',
      impact: 'Visually impaired users cannot distinguish call-to-action buttons',
      recommendation: 'Ensure button text has 4.5:1 contrast ratio with background.'
    },
    {
      title: 'Heading hierarchy skipped',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Screen reader navigation is confusing',
      recommendation: 'Use proper heading order (H1 → H2 → H3) without skipping levels.'
    },
    {
      title: 'Video content lacks captions',
      severity: 'high',
      category: 'accessibility',
      impact: 'Deaf and hard-of-hearing users cannot access video content',
      recommendation: 'Add closed captions or transcripts for all video content.'
    }
  ],
  saas: [
    {
      title: 'Dashboard lacks keyboard navigation',
      severity: 'critical',
      category: 'accessibility',
      impact: 'Keyboard-only users cannot access key features',
      recommendation: 'Implement full keyboard navigation with visible focus indicators and logical tab order.'
    },
    {
      title: 'Form validation errors not announced',
      severity: 'critical',
      category: 'accessibility',
      impact: 'Screen reader users unaware of form errors',
      recommendation: 'Use aria-live regions to announce validation errors dynamically.'
    },
    {
      title: 'Data visualizations inaccessible',
      severity: 'high',
      category: 'accessibility',
      impact: 'Visually impaired users cannot access chart data',
      recommendation: 'Provide text alternatives, data tables, or ARIA labels for all charts and graphs.'
    },
    {
      title: 'Modal dialogs trap keyboard focus',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Keyboard users cannot navigate modals properly',
      recommendation: 'Implement proper focus management: trap focus within modal and return to trigger on close.'
    }
  ],
  blog: [
    {
      title: 'Article images lack descriptive alt text',
      severity: 'high',
      category: 'accessibility',
      impact: 'Screen reader users miss visual context in articles',
      recommendation: 'Add descriptive alt text to inline images that adds context to the content.'
    },
    {
      title: 'Comment form not accessible',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Users with disabilities cannot participate in discussions',
      recommendation: 'Ensure proper form labels, error messages, and keyboard accessibility.'
    },
    {
      title: 'Text contrast issues in code blocks',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Developers with visual impairments struggle to read code examples',
      recommendation: 'Choose syntax highlighting themes with WCAG AA compliant contrast ratios.'
    }
  ],
  portfolio: [
    {
      title: 'Project images missing descriptions',
      severity: 'high',
      category: 'accessibility',
      impact: 'Screen reader users cannot understand project showcases',
      recommendation: 'Add alt text describing the project, design, and key visual elements.'
    },
    {
      title: 'Image gallery not keyboard accessible',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Keyboard users cannot browse portfolio items',
      recommendation: 'Implement keyboard controls (arrow keys, Enter, Escape) for gallery navigation.'
    },
    {
      title: 'Contact form lacks proper structure',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Assistive technology users struggle with contact form',
      recommendation: 'Use proper form elements with labels, fieldsets, and clear error handling.'
    }
  ],
  documentation: [
    {
      title: 'Code examples not announced to screen readers',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Screen reader users cannot distinguish code from regular text',
      recommendation: 'Use <code> tags with appropriate ARIA labels to identify code blocks.'
    },
    {
      title: 'Navigation skip links missing',
      severity: 'high',
      category: 'accessibility',
      impact: 'Keyboard users must tab through entire navigation',
      recommendation: 'Add "Skip to main content" link at page top for keyboard users.'
    },
    {
      title: 'Search results lack proper structure',
      severity: 'moderate',
      category: 'accessibility',
      impact: 'Screen readers cannot efficiently browse search results',
      recommendation: 'Use semantic HTML (lists, headings) and ARIA roles for search results.'
    }
  ]
};

export const designFindings = {
  ecommerce: [
    {
      title: 'Inconsistent button styles across checkout flow',
      severity: 'moderate',
      category: 'design',
      impact: 'Users confused by varied button appearances',
      recommendation: 'Establish a consistent button system with primary, secondary, and tertiary variants.'
    },
    {
      title: 'Typography scale lacks hierarchy',
      severity: 'moderate',
      category: 'design',
      impact: 'Product information difficult to scan',
      recommendation: 'Implement consistent type scale (e.g., 16/18/20/24/32/48px) for clear visual hierarchy.'
    },
    {
      title: 'Color system not accessible',
      severity: 'high',
      category: 'design',
      impact: 'Brand colors fail WCAG contrast requirements',
      recommendation: 'Audit color palette for accessibility; provide darker variants for text use.'
    }
  ],
  marketing: [
    {
      title: 'Too many font families used',
      severity: 'minor',
      category: 'design',
      impact: 'Visual inconsistency across pages',
      recommendation: 'Limit to 2-3 font families: one for headings, one for body text, optionally one for accents.'
    },
    {
      title: 'Spacing inconsistencies throughout',
      severity: 'moderate',
      category: 'design',
      impact: 'Layout appears unprofessional',
      recommendation: 'Adopt a consistent spacing system (e.g., 8px base unit: 8, 16, 24, 32, 48, 64px).'
    },
    {
      title: 'CTA buttons lack visual prominence',
      severity: 'high',
      category: 'design',
      impact: 'Lower conversion rates',
      recommendation: 'Increase button size, add shadows, and use high-contrast colors for primary CTAs.'
    }
  ],
  saas: [
    {
      title: 'Dashboard widgets have inconsistent styling',
      severity: 'moderate',
      category: 'design',
      impact: 'Interface feels disjointed',
      recommendation: 'Create a unified component library with consistent card, button, and input styles.'
    },
    {
      title: 'Icon usage lacks consistency',
      severity: 'moderate',
      category: 'design',
      impact: 'Visual confusion in navigation',
      recommendation: 'Use single icon set (e.g., Lucide, Heroicons) with consistent sizing (16px or 20px).'
    },
    {
      title: 'Form inputs lack visual feedback',
      severity: 'high',
      category: 'design',
      impact: 'Users unsure if interactions registered',
      recommendation: 'Add hover, focus, and active states to all interactive elements with clear visual changes.'
    }
  ],
  blog: [
    {
      title: 'Reading width too wide',
      severity: 'moderate',
      category: 'design',
      impact: 'Difficult to read long-form content',
      recommendation: 'Limit content width to 65-75 characters per line (approximately 650-750px).'
    },
    {
      title: 'Line height insufficient for readability',
      severity: 'moderate',
      category: 'design',
      impact: 'Text appears cramped',
      recommendation: 'Set line-height to 1.6-1.8 for body text to improve readability.'
    },
    {
      title: 'Inconsistent heading styles',
      severity: 'minor',
      category: 'design',
      impact: 'Article structure unclear',
      recommendation: 'Define consistent styles for H1-H6 with clear size and weight differentiation.'
    }
  ],
  portfolio: [
    {
      title: 'Project cards lack visual consistency',
      severity: 'moderate',
      category: 'design',
      impact: 'Portfolio appears unpolished',
      recommendation: 'Standardize project card dimensions, spacing, and hover effects.'
    },
    {
      title: 'Typography hierarchy unclear',
      severity: 'moderate',
      category: 'design',
      impact: 'Project information hard to scan',
      recommendation: 'Establish clear visual hierarchy: project title, role, description, technologies.'
    }
  ],
  documentation: [
    {
      title: 'Code blocks hard to distinguish from text',
      severity: 'moderate',
      category: 'design',
      impact: 'Developers confused between prose and code',
      recommendation: 'Add distinct background color, border, and monospace font to code blocks.'
    },
    {
      title: 'Navigation structure overwhelming',
      severity: 'high',
      category: 'design',
      impact: 'Users cannot find information quickly',
      recommendation: 'Simplify navigation with clear categories, search prominence, and visual hierarchy.'
    }
  ]
};

export const performanceFindings = {
  ecommerce: [
    {
      title: 'Product images not optimized',
      severity: 'high',
      category: 'performance',
      impact: 'Slow page load frustrates shoppers, reducing conversion',
      recommendation: 'Use WebP format, lazy loading, and responsive images with srcset.'
    },
    {
      title: 'Heavy JavaScript bundles',
      severity: 'high',
      category: 'performance',
      impact: 'Mobile users experience slow interactivity',
      recommendation: 'Code-split by route, lazy load non-critical features, analyze bundle with webpack-bundle-analyzer.'
    }
  ],
  marketing: [
    {
      title: 'Hero video too large',
      severity: 'high',
      category: 'performance',
      impact: 'Extended load time creates poor first impression',
      recommendation: 'Compress video, provide poster image, or use animated image format (WebP/AVIF).'
    },
    {
      title: 'Render-blocking resources',
      severity: 'moderate',
      category: 'performance',
      impact: 'Content not visible for 2-3 seconds',
      recommendation: 'Defer non-critical CSS/JS, inline critical CSS, use font-display: swap.'
    }
  ],
  saas: [
    {
      title: 'Dashboard data fetched inefficiently',
      severity: 'high',
      category: 'performance',
      impact: 'Users wait for dashboard to load',
      recommendation: 'Implement data pagination, virtual scrolling, and progressive loading patterns.'
    },
    {
      title: 'Large bundle size impacts load time',
      severity: 'moderate',
      category: 'performance',
      impact: 'Initial app load slow on mobile',
      recommendation: 'Split code by route, lazy load admin features, remove unused dependencies.'
    }
  ],
  blog: [
    {
      title: 'Images not lazy loaded',
      severity: 'moderate',
      category: 'performance',
      impact: 'Long articles load slowly',
      recommendation: 'Implement native lazy loading (loading="lazy") for below-the-fold images.'
    },
    {
      title: 'Excessive HTTP requests',
      severity: 'moderate',
      category: 'performance',
      impact: 'Slow page render on slow connections',
      recommendation: 'Combine resources, use HTTP/2, implement resource hints (preconnect, prefetch).'
    }
  ],
  portfolio: [
    {
      title: 'High-resolution images hurt mobile performance',
      severity: 'high',
      category: 'performance',
      impact: 'Portfolio loads slowly on mobile devices',
      recommendation: 'Serve responsive images with appropriate sizes for different viewports.'
    }
  ],
  documentation: [
    {
      title: 'Search index loads synchronously',
      severity: 'moderate',
      category: 'performance',
      impact: 'Page blocks while loading search functionality',
      recommendation: 'Load search index asynchronously, show loading indicator, cache locally.'
    }
  ]
};

export const iaFindings = {
  ecommerce: [
    {
      title: 'Product categories nested too deeply',
      severity: 'high',
      category: 'ia',
      impact: 'Users get lost in navigation, abandon shopping',
      recommendation: 'Flatten category structure to maximum 3 levels, use mega menus for better overview.'
    },
    {
      title: 'Search functionality not prominent',
      severity: 'moderate',
      category: 'ia',
      impact: 'Users cannot quickly find specific products',
      recommendation: 'Place search bar prominently in header, make it larger and more discoverable.'
    }
  ],
  marketing: [
    {
      title: 'Navigation lacks clear hierarchy',
      severity: 'moderate',
      category: 'ia',
      impact: 'Users confused about site structure',
      recommendation: 'Organize navigation by user goals, group related items, limit top-level items to 7±2.'
    },
    {
      title: 'CTA placement inconsistent',
      severity: 'moderate',
      category: 'ia',
      impact: 'Users miss key conversion opportunities',
      recommendation: 'Place primary CTA consistently above fold, secondary CTAs at logical decision points.'
    }
  ],
  saas: [
    {
      title: 'Complex settings buried in navigation',
      severity: 'high',
      category: 'ia',
      impact: 'Users cannot find configuration options',
      recommendation: 'Create dedicated settings section, use search within settings, group logically.'
    },
    {
      title: 'Dashboard navigation overwhelming',
      severity: 'moderate',
      category: 'ia',
      impact: 'New users struggle to get started',
      recommendation: 'Simplify navigation, add onboarding flow, highlight most common tasks.'
    }
  ],
  blog: [
    {
      title: 'Article categorization unclear',
      severity: 'moderate',
      category: 'ia',
      impact: 'Readers cannot discover related content',
      recommendation: 'Implement clear category system, add tags, show related articles.'
    }
  ],
  portfolio: [
    {
      title: 'Project filtering difficult',
      severity: 'moderate',
      category: 'ia',
      impact: 'Visitors cannot find relevant work',
      recommendation: 'Add filterable categories, tags, or project types for easy browsing.'
    }
  ],
  documentation: [
    {
      title: 'Documentation structure too deep',
      severity: 'high',
      category: 'ia',
      impact: 'Developers cannot find API information quickly',
      recommendation: 'Flatten structure, improve search, add breadcrumbs, create getting started path.'
    }
  ]
};
