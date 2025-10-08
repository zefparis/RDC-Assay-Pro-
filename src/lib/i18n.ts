export type Locale = 'fr' | 'en';

export interface Translations {
  // Navigation
  nav: {
    services: string;
    tracking: string;
    submit: string;
    reports: string;
    dashboard: string;
    login: string;
    logout: string;
    inspection?: string;
  };
  
  // Hero section
  hero: {
    title: string;
    subtitle: string;
    submitSample: string;
    trackSample: string;
    features: string;
  };
  
  // Services
  services: {
    title: string;
    sampling: {
      title: string;
      description: string;
    };
    analysis: {
      title: string;
      description: string;
    };
    certification: {
      title: string;
      description: string;
    };
    supervision: string;
  };
  
  // Sample tracking
  tracking: {
    title: string;
    subtitle: string;
    placeholder: string;
    search: string;
    noResults: string;
    viewStatus: string;
    loadingDetails: string;
    mineral: string;
    site: string;
    status: string;
    timeline: string;
    qrTraceability: string;
  };
  
  // Sample submission
  submission: {
    title: string;
    subtitle: string;
    mineralType: string;
    unit: string;
    miningSite: string;
    mass: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
    success: string;
    error: string;
    initialStatus: string;
  };
  
  // Reports
  reports: {
    title: string;
    subtitle: string;
    filter: string;
    results: string;
    id: string;
    site: string;
    mineral: string;
    grade: string;
    certificate: string;
    hash: string;
    loading: string;
    noReports: string;
    download: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    overview: string;
    active: string;
    analyzing: string;
    reports: string;
    avgTime: string;
    recentSamples: string;
    analytics: string;
  };
  
  // Status
  status: {
    received: string;
    prep: string;
    analyzing: string;
    qaQc: string;
    reported: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    confirm: string;
    close: string;
  };
  
  // Footer
  footer: {
    description: string;
    contact: string;
    api: string;
  };

  // International Inspection
  inspection?: {
    hero: {
      title: string;
      tagline: string;
    };
    why: {
      title: string;
      items: string[];
    };
    process: {
      title: string;
      steps: string[];
    };
    pricing: {
      title: string;
      columns: { service: string; range: string; variables: string };
      items: Array<{ service: string; variables: string }>;
      note: string;
    };
    conditions: {
      title: string;
      items: string[];
    };
    form: {
      title: string;
      companyContact: string;
      location: string;
      mineralType: string;
      estimatedVolume: string;
      serviceType: string;
      serviceOptions: { inspectionOnly: string; samplingAnalysis: string; portSupervision: string };
      datePeriod: string;
      notes: string;
      attachments: string;
      submit: string;
      success: string;
      error: string;
      required: string;
    };
    faq: {
      title: string;
      items: Array<{ q: string; a: string }>;
    };
  };
}

export const translations: Record<Locale, Translations> = {
  fr: {
    nav: {
      services: 'Services',
      tracking: 'Suivi',
      submit: 'Soumettre',
      reports: 'Rapports',
      dashboard: 'Tableau de bord',
      login: 'Se connecter',
      logout: 'Se déconnecter',
      inspection: 'Inspection internationale',
    },
    hero: {
      title: 'Analyses et certifications minières professionnelles en RDC',
      subtitle: 'Échantillonnage, analyse, certification et traçabilité numérique. Interface client temps réel. Standards internationaux.',
      submitSample: 'Soumettre un échantillon',
      trackSample: 'Suivre un échantillon',
      features: 'ISO-ready • Hash des rapports • QR traceability',
    },
    services: {
      title: 'Nos Services',
      sampling: {
        title: 'Échantillonnage',
        description: 'Grab, channel, auger, core. Protocoles contrôlés et traçabilité.',
      },
      analysis: {
        title: 'Analyses labo',
        description: 'XRF, AAS, ICP-OES/ICP-MS, LOI, humidité, granulométrie.',
      },
      certification: {
        title: 'Certification',
        description: 'Rapports signés, hashés, QR code et export-ready.',
      },
      supervision: 'Supervision de chargement',
    },
    tracking: {
      title: 'Suivre un échantillon',
      subtitle: 'Tapez l\'ID (ex: RC-0001) ou un site (Kolwezi)',
      placeholder: 'RC-0001 ou site...',
      search: 'Rechercher',
      noResults: 'Aucun résultat',
      viewStatus: 'Voir le statut',
      loadingDetails: 'Chargement des détails...',
      mineral: 'Minerai',
      site: 'Site',
      status: 'Statut',
      timeline: 'Timeline',
      qrTraceability: 'QR traceability',
    },
    submission: {
      title: 'Soumettre un échantillon',
      subtitle: 'Formulaire connecté à l’API. Authentification requise.',
      mineralType: 'Type de minerai',
      unit: 'Unité',
      miningSite: 'Site minier',
      mass: 'Masse (kg)',
      notes: 'Notes',
      notesPlaceholder: 'Conditions de prélèvement, humidité, granulométrie...',
      submit: 'Enregistrer',
      success: 'Échantillon enregistré avec succès',
      error: 'Impossible d\'enregistrer l\'échantillon',
      initialStatus: 'Statut initial',
    },
    reports: {
      title: 'Rapports & certificats',
      subtitle: 'Téléchargeables. Hash et QR inclus.',
      filter: 'Filtrer (ID, site, minerai)',
      results: 'résultats',
      id: 'ID',
      site: 'Site',
      mineral: 'Minerai',
      grade: 'Teneur',
      certificate: 'Certificat',
      hash: 'Hash',
      loading: 'Chargement...',
      noReports: 'Aucun rapport',
      download: 'PDF',
    },
    dashboard: {
      title: 'Tableau de bord',
      overview: 'Vue d\'ensemble',
      active: 'Actifs',
      analyzing: 'En analyse',
      reports: 'Rapports',
      avgTime: 'Temps moyen',
      recentSamples: 'Échantillons récents',
      analytics: 'Analytiques',
    },
    status: {
      received: 'Reçu',
      prep: 'Préparation',
      analyzing: 'Analyse',
      qaQc: 'QA/QC',
      reported: 'Rapporté',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirm: 'Confirmer',
      close: 'Fermer',
    },
    footer: {
      description: 'Plateforme d\'analyse & certification minière.',
      contact: 'Contact',
      api: 'API (mock)',
    },
    inspection: {
      hero: {
        title: 'Inspection internationale et échantillonnage hors RDC',
        tagline: 'Équipe mobile d\'experts, vérification avant expédition et certification à l\'étranger. Transparence des coûts et traçabilité numérique.',
      },
      why: {
        title: 'Pourquoi ce service',
        items: [
          'Crédibilité auprès d\'acheteurs et institutions à l\'étranger',
          'Vérification pré‑expédition (qualité, quantité, conformité)',
          'Inspection neutre par un tiers indépendant',
          'Traçabilité par QR et hash des rapports',
        ],
      },
      process: {
        title: 'Processus',
        steps: ['Demande', 'Devis', 'Planification', 'Inspection sur site', 'Analyses', 'Rapport', 'Suivi'],
      },
      pricing: {
        title: 'Tarification indicative',
        columns: { service: 'Service', range: 'Fourchette estimée', variables: 'Variables' },
        items: [
          { service: 'Inspection locale', variables: 'Ville, durée, sécurité' },
          { service: 'Inspection à l\'étranger', variables: 'Pays, visas, logistique' },
          { service: 'Supervision au port', variables: 'Port, créneau, accès' },
        ],
        note: 'Les coûts finaux dépendent du site, des autorisations, de la sécurité et de la logistique.',
      },
      conditions: {
        title: 'Conditions & contraintes',
        items: [
          'Accès et autorisations fournis par le client',
          'Logistique locale et sécurité à la charge du client',
          'Conformité douanière et portuaire requise',
          'Responsabilité limitée à l\'inspection réalisée',
          'Planification soumise à la disponibilité des équipes',
        ],
      },
      form: {
        title: 'Demande d\'inspection internationale',
        companyContact: 'Société / Contact',
        location: 'Pays / Port / Site',
        mineralType: 'Type de minerai',
        estimatedVolume: 'Volume estimé',
        serviceType: 'Service demandé',
        serviceOptions: {
          inspectionOnly: 'Inspection uniquement',
          samplingAnalysis: 'Échantillonnage + analyses',
          portSupervision: 'Supervision au port',
        },
        datePeriod: 'Date / période',
        notes: 'Notes',
        attachments: 'Pièces jointes (optionnel)',
        submit: 'Envoyer la demande',
        success: 'Demande envoyée. Notre équipe vous recontacte rapidement.',
        error: 'Échec de l\'envoi de la demande.',
        required: 'Champ requis',
      },
      faq: {
        title: 'FAQ',
        items: [
          { q: 'La sécurité est‑elle assurée ?', a: 'Nous opérons selon une évaluation des risques et des protocoles validés. La sécurité locale reste sous responsabilité du client.' },
          { q: 'Quels délais ?', a: 'De 3 à 10 jours selon le pays, les visas et l\'accès au site.' },
          { q: 'Le rapport est‑il valable ?', a: 'Oui, il inclut hash et QR pour vérification et peut être certifié sur demande.' },
          { q: 'Pouvez‑vous accéder aux ports ?', a: 'Oui, sous réserve d\'autorisations du terminal et de l\'armateur.' },
        ],
      },
    },
  },
  en: {
    nav: {
      services: 'Services',
      tracking: 'Tracking',
      submit: 'Submit',
      reports: 'Reports',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
      inspection: 'International Inspection',
    },
    hero: {
      title: 'Professional mineral analysis and certification in DRC',
      subtitle: 'Sampling, analysis, certification and digital traceability. Real-time client interface. International standards.',
      submitSample: 'Submit a sample',
      trackSample: 'Track a sample',
      features: 'ISO-ready • Report hashing • QR traceability',
    },
    services: {
      title: 'Our Services',
      sampling: {
        title: 'Sampling',
        description: 'Grab, channel, auger, core. Controlled protocols and traceability.',
      },
      analysis: {
        title: 'Lab Analysis',
        description: 'XRF, AAS, ICP-OES/ICP-MS, LOI, moisture, granulometry.',
      },
      certification: {
        title: 'Certification',
        description: 'Signed, hashed reports, QR code and export-ready.',
      },
      supervision: 'Loading supervision',
    },
    tracking: {
      title: 'Track a sample',
      subtitle: 'Type ID (e.g: RC-0001) or site (Kolwezi)',
      placeholder: 'RC-0001 or site...',
      search: 'Search',
      noResults: 'No results',
      viewStatus: 'View status',
      loadingDetails: 'Loading details...',
      mineral: 'Mineral',
      site: 'Site',
      status: 'Status',
      timeline: 'Timeline',
      qrTraceability: 'QR traceability',
    },
    submission: {
      title: 'Submit a sample',
      subtitle: 'Form connected to API. Authentication required.',
      mineralType: 'Mineral type',
      unit: 'Unit',
      miningSite: 'Mining site',
      mass: 'Mass (kg)',
      notes: 'Notes',
      notesPlaceholder: 'Sampling conditions, moisture, granulometry...',
      submit: 'Save',
      success: 'Sample registered successfully',
      error: 'Unable to register sample',
      initialStatus: 'Initial status',
    },
    reports: {
      title: 'Reports & certificates',
      subtitle: 'Downloadable. Hash and QR included.',
      filter: 'Filter (ID, site, mineral)',
      results: 'results',
      id: 'ID',
      site: 'Site',
      mineral: 'Mineral',
      grade: 'Grade',
      certificate: 'Certificate',
      hash: 'Hash',
      loading: 'Loading...',
      noReports: 'No reports',
      download: 'PDF',
    },
    dashboard: {
      title: 'Dashboard',
      overview: 'Overview',
      active: 'Active',
      analyzing: 'Analyzing',
      reports: 'Reports',
      avgTime: 'Avg time',
      recentSamples: 'Recent samples',
      analytics: 'Analytics',
    },
    status: {
      received: 'Received',
      prep: 'Prep',
      analyzing: 'Analyzing',
      qaQc: 'QA/QC',
      reported: 'Reported',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
    },
    footer: {
      description: 'Mineral analysis & certification platform.',
      contact: 'Contact',
      api: 'API (mock)',
    },
    inspection: {
      hero: {
        title: 'International Inspection & Off-Site Sampling',
        tagline: 'Mobile team of specialists for abroad verification and certification. Transparent costs and digital traceability.',
      },
      why: {
        title: 'Why this service',
        items: [
          'Credibility with buyers and institutions abroad',
          'Pre‑shipment verification (quality, quantity, compliance)',
          'Neutral third‑party inspection',
          'Traceability via QR and report hashing',
        ],
      },
      process: {
        title: 'Process timeline',
        steps: ['Request', 'Quotation', 'Planning', 'On‑site inspection', 'Analysis', 'Report', 'Follow‑up'],
      },
      pricing: {
        title: 'Illustrative pricing',
        columns: { service: 'Service', range: 'Estimated cost range', variables: 'Variables' },
        items: [
          { service: 'Local inspection', variables: 'City, duration, security' },
          { service: 'Abroad inspection', variables: 'Country, visas, logistics' },
          { service: 'Port supervision', variables: 'Port, time slot, access' },
        ],
        note: 'Final costs depend on site, permits, security and logistics.',
      },
      conditions: {
        title: 'Conditions & constraints',
        items: [
          'Client provides access and permissions',
          'Local logistics and security handled by client',
          'Customs and port compliance required',
          'Liability limited to performed inspection',
          'Scheduling subject to team availability',
        ],
      },
      form: {
        title: 'International Inspection Request',
        companyContact: 'Company / Contact name',
        location: 'Country / Port / Site',
        mineralType: 'Mineral type',
        estimatedVolume: 'Estimated volume',
        serviceType: 'Requested service',
        serviceOptions: {
          inspectionOnly: 'Inspection only',
          samplingAnalysis: 'Sampling + analysis',
          portSupervision: 'Port supervision',
        },
        datePeriod: 'Date / period',
        notes: 'Notes',
        attachments: 'Attachments (optional)',
        submit: 'Submit request',
        success: 'Request sent. Our team will contact you shortly.',
        error: 'Failed to send the request.',
        required: 'This field is required',
      },
      faq: {
        title: 'FAQ',
        items: [
          { q: 'Is security ensured?', a: 'We operate under a risk assessment and validated protocols. Local security remains client responsibility.' },
          { q: 'What timeline?', a: 'From 3 to 10 days depending on country, visas and site access.' },
          { q: 'Is the report valid?', a: 'Yes. It includes hash and QR for verification and can be certified upon request.' },
          { q: 'Can you access ports?', a: 'Yes, subject to terminal and carrier permissions.' },
        ],
      },
    },
  },
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.fr;
}
