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
    },
    hero: {
      title: 'Certifier la vérité du minerai — en RDC',
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
      subtitle: 'Formulaire rapide. Le backend peut être branché plus tard.',
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
    },
    hero: {
      title: 'Certifying mineral truth — in DRC',
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
      subtitle: 'Quick form. Backend can be connected later.',
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
  },
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.fr;
}
