/**
 * API Configuration for external data sources
 * 
 * In production, these would be environment variables
 * Use .env files and import.meta.env in Vite
 */

export const API_CONFIG = {
  // NOAA Space Weather Prediction Center
  spaceWeather: {
    baseUrl: 'https://services.swpc.noaa.gov',
    endpoints: {
      solarWind: '/json/rtsw/rtsw_mag_1m.json',
      kpIndex: '/json/planetary_k_index_1m.json',
      solarFlares: '/json/goes/primary/xrays-6-hour.json',
      protonFlux: '/json/goes/primary/integral-protons-plot-6-hour.json',
    },
  },

  // Space-Track.org (Requires authentication)
  spaceTrack: {
    baseUrl: 'https://www.space-track.org',
    authEndpoint: '/ajaxauth/login',
    endpoints: {
      cdm: '/basicspacedata/query/class/cdm_public',
      satcat: '/basicspacedata/query/class/satcat',
      tle: '/basicspacedata/query/class/tle_latest',
    },
    // Credentials should be in environment variables
    credentials: {
      username: import.meta.env.VITE_SPACETRACK_USERNAME || '',
      password: import.meta.env.VITE_SPACETRACK_PASSWORD || '',
    },
  },

  // ESA Space Debris Office (public data)
  esaDebris: {
    baseUrl: 'https://sdup.esoc.esa.int',
    endpoints: {
      discos: '/discos/data',
    },
  },

  // Celestrak (TLE data)
  celestrak: {
    baseUrl: 'https://celestrak.org',
    endpoints: {
      active: '/NORAD/elements/gp.php?GROUP=active&FORMAT=json',
      stations: '/NORAD/elements/gp.php?GROUP=stations&FORMAT=json',
    },
  },
}

/**
 * API request timeout (ms)
 */
export const REQUEST_TIMEOUT = 10000

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  spaceTrack: {
    requestsPerMinute: 20,
    requestsPerHour: 200,
  },
  noaa: {
    requestsPerMinute: 60,
  },
}

/**
 * Cache duration (ms)
 */
export const CACHE_DURATION = {
  spaceWeather: 60000, // 1 minute
  conjunction: 300000, // 5 minutes
  tle: 3600000, // 1 hour
}

/**
 * Simulation mode (set to false when using real APIs)
 */
export const USE_SIMULATION = false

/**
 * Threat detection mode
 * 'strict': 仅使用真实数据，无模拟威胁（推荐生产环境）
 * 'demo': 允许少量模拟威胁用于演示（平衡模式）
 * 'development': 较多模拟威胁用于开发测试
 */
export const THREAT_MODE: 'strict' | 'demo' | 'development' = 'demo'

/**
 * Update intervals (ms)
 */
export const UPDATE_INTERVALS = {
  spaceWeather: 20000, // 20 seconds (更频繁的更新)
  threats: 30000, // 30 seconds (更频繁的威胁检测)
  positions: 1000, // 1 second
}


