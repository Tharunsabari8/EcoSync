// Application Constants
export const APP_CONFIG = {
  NAME: 'AyuTrace',
  VERSION: '1.0.0',
  DESCRIPTION: 'Blockchain-based Ayurvedic herb traceability system',
  AUTHOR: 'Smart India Hackathon 2025'
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
} as const;

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  NETWORK_NAME: 'AyuTrace Network',
  CHAIN_ID: 'ayutrace-1',
  BLOCK_TIME: 15000, // 15 seconds in milliseconds
  GAS_LIMIT: 500000,
  GAS_PRICE: 20 // in Gwei equivalent
} as const;

// User Roles
export const USER_ROLES = {
  COLLECTOR: 'collector',
  PROCESSOR: 'processor', 
  LABORATORY: 'laboratory',
  MANUFACTURER: 'manufacturer',
  CONSUMER: 'consumer',
  ADMIN: 'admin'
} as const;

// Herb Species
export const HERB_SPECIES = {
  ASHWAGANDHA: {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    season: 'Winter'
  },
  BRAHMI: {
    id: 'brahmi',
    name: 'Brahmi', 
    scientificName: 'Bacopa monnieri',
    season: 'Monsoon'
  },
  TULSI: {
    id: 'tulsi',
    name: 'Tulsi',
    scientificName: 'Ocimum sanctum',
    season: 'All seasons'
  },
  NEEM: {
    id: 'neem',
    name: 'Neem',
    scientificName: 'Azadirachta indica', 
    season: 'Summer'
  }
} as const;

// Quality Grades
export const QUALITY_GRADES = {
  EXCELLENT: 'excellent',
  GOOD: 'good', 
  FAIR: 'fair',
  POOR: 'poor'
} as const;

// Processing Steps
export const PROCESSING_STEPS = {
  CLEANING: 'cleaning',
  DRYING: 'drying',
  GRINDING: 'grinding',
  SIEVING: 'sieving',
  PACKAGING: 'packaging'
} as const;

// Test Types
export const TEST_TYPES = {
  MOISTURE: 'moisture',
  PESTICIDE: 'pesticide',
  DNA_BARCODING: 'dna',
  HEAVY_METALS: 'heavymetals',
  MICROBIAL: 'microbial'
} as const;

// Test Results
export const TEST_RESULTS = {
  PASS: 'pass',
  FAIL: 'fail',
  RETEST: 'retest'
} as const;

// Product Types
export const PRODUCT_TYPES = {
  TABLETS: 'tablets',
  CAPSULES: 'capsules',
  POWDER: 'powder',
  SYRUP: 'syrup',
  OIL: 'oil'
} as const;

// Batch Status
export const BATCH_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
} as const;

// Blockchain Transaction Types
export const TRANSACTION_TYPES = {
  COLLECTION: 'collection',
  BATCH: 'batch',
  PROCESSING: 'processing',
  TEST: 'test',
  PRODUCT: 'product'
} as const;

// Geographic Zones (for geo-fencing)
export const APPROVED_ZONES = {
  MAHARASHTRA: {
    name: 'Maharashtra',
    bounds: {
      north: 22.0,
      south: 15.6,
      east: 80.9,
      west: 72.6
    }
  },
  KERALA: {
    name: 'Kerala',
    bounds: {
      north: 12.8,
      south: 8.2,
      east: 77.4,
      west: 74.9
    }
  }
} as const;

// Certification Standards
export const CERTIFICATIONS = {
  ORGANIC: {
    code: 'NPOP',
    name: 'National Programme for Organic Production',
    authority: 'APEDA'
  },
  AYUSH: {
    code: 'AYUSH',
    name: 'AYUSH Ministry License',
    authority: 'Ministry of AYUSH'
  },
  GMP: {
    code: 'GMP',
    name: 'Good Manufacturing Practice',
    authority: 'WHO'
  },
  FAIR_TRADE: {
    code: 'FT',
    name: 'Fair Trade Certified',
    authority: 'Fairtrade International'
  }
} as const;

// Mobile App Configuration
export const MOBILE_CONFIG = {
  CAMERA_SETTINGS: {
    facingMode: 'environment',
    width: { ideal: 640 },
    height: { ideal: 480 }
  },
  QR_SCANNER: {
    scanInterval: 500,
    timeout: 30000
  },
  GPS_SETTINGS: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  VALIDATION_ERROR: 'Please fill in all required fields correctly.',
  CAMERA_ERROR: 'Camera access denied. Please allow camera permissions.',
  GPS_ERROR: 'Location access denied. Please allow location permissions.',
  BLOCKCHAIN_ERROR: 'Blockchain transaction failed. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.'
} as const;

// Success Messages  
export const SUCCESS_MESSAGES = {
  COLLECTION_CREATED: 'Collection event recorded successfully',
  BATCH_CREATED: 'Batch created successfully',
  PROCESSING_RECORDED: 'Processing step recorded successfully',
  TEST_RECORDED: 'Test results recorded successfully',
  PRODUCT_CREATED: 'Product created successfully',
  QR_SCANNED: 'QR code scanned successfully'
} as const;

// Navigation Routes
export const ROUTES = {
  DASHBOARD: '/dashboard',
  COLLECTOR: '/collector',
  PROCESSOR: '/processor', 
  LABORATORY: '/laboratory',
  MANUFACTURER: '/manufacturer',
  CONSUMER: '/consumer'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ROLE: 'ayutrace_user_role',
  OFFLINE_DATA: 'ayutrace_offline_data',
  SETTINGS: 'ayutrace_settings'
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

// Demo Data Flags
export const DEMO_CONFIG = {
  ENABLE_DEMO_MODE: true,
  DEMO_QR_CODES: [
    'QR-DEMO-001-ASHWAGANDHA',
    'QR-DEMO-002-BRAHMI',
    'QR-DEMO-003-TULSI'
  ],
  DEMO_USER_IDS: {
    COLLECTOR: 'user-1',
    PROCESSOR: 'user-2', 
    LAB: 'lab-1',
    MANUFACTURER: 'mfr-1'
  }
} as const;

// Export all constants as default
export default {
  APP_CONFIG,
  API_CONFIG,
  BLOCKCHAIN_CONFIG,
  USER_ROLES,
  HERB_SPECIES,
  QUALITY_GRADES,
  PROCESSING_STEPS,
  TEST_TYPES,
  TEST_RESULTS,
  PRODUCT_TYPES,
  BATCH_STATUS,
  TRANSACTION_TYPES,
  APPROVED_ZONES,
  CERTIFICATIONS,
  MOBILE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  STORAGE_KEYS,
  NOTIFICATION_TYPES,
  DEMO_CONFIG
} as const;
