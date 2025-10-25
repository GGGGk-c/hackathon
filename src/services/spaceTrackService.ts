import { API_CONFIG, REQUEST_TIMEOUT, CACHE_DURATION } from '../config/api.config'

/**
 * Space-Track.org API Service
 * Handles authentication and data fetching from Space-Track.org
 * 
 * Documentation: https://www.space-track.org/documentation
 */

interface SpaceTrackAuth {
  token: string | null
  expiresAt: number
}

interface CDMData {
  TCA: string // Time of Closest Approach
  MISS_DISTANCE: string // km
  PROBABILITY: string
  OBJECT_NAME: string
  OBJECT_ID: string
  SAT_1_NAME: string
  SAT_1_ID: string
  SAT_2_NAME: string
  SAT_2_ID: string
  CREATION_DATE: string
}

interface TLEData {
  NORAD_CAT_ID: string
  OBJECT_NAME: string
  TLE_LINE1: string
  TLE_LINE2: string
  EPOCH: string
}

class SpaceTrackService {
  private auth: SpaceTrackAuth = {
    token: null,
    expiresAt: 0,
  }
  
  private cache = new Map<string, { data: any; timestamp: number }>()

  /**
   * Authenticate with Space-Track.org
   */
  async authenticate(): Promise<boolean> {
    const { username, password } = API_CONFIG.spaceTrack.credentials

    if (!username || !password) {
      console.warn('⚠️ Space-Track credentials not configured. Using simulation mode.')
      return false
    }

    try {
      const formData = new URLSearchParams()
      formData.append('identity', username)
      formData.append('password', password)

      const response = await fetch(
        `${API_CONFIG.spaceTrack.baseUrl}${API_CONFIG.spaceTrack.authEndpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
          credentials: 'include',
        }
      )

      if (response.ok) {
        // Space-Track uses cookies for auth, token stored in session
        this.auth.expiresAt = Date.now() + 2 * 60 * 60 * 1000 // 2 hours
        console.log('✅ Space-Track authentication successful')
        return true
      } else {
        console.error('❌ Space-Track authentication failed:', response.status)
        return false
      }
    } catch (error) {
      console.error('❌ Space-Track authentication error:', error)
      return false
    }
  }

  /**
   * Check if authentication is valid
   */
  private isAuthenticated(): boolean {
    return this.auth.expiresAt > Date.now()
  }

  /**
   * Get from cache if available and fresh
   */
  private getFromCache<T>(key: string, maxAge: number): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data as T
    }
    return null
  }

  /**
   * Store in cache
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Fetch Conjunction Data Messages (CDM) for a satellite
   * @param noradCatId - NORAD Catalog ID of the satellite
   * @param days - Number of days to look ahead (default: 7)
   */
  async fetchConjunctionData(noradCatId: string, days: number = 7): Promise<CDMData[]> {
    const cacheKey = `cdm_${noradCatId}_${days}`
    
    // Check cache first
    const cached = this.getFromCache<CDMData[]>(cacheKey, CACHE_DURATION.conjunction)
    if (cached) {
      console.log('📦 Using cached CDM data for', noradCatId)
      return cached
    }

    // Authenticate if needed
    if (!this.isAuthenticated()) {
      const success = await this.authenticate()
      if (!success) {
        console.warn('⚠️ Cannot fetch CDM data without authentication')
        return []
      }
    }

    try {
      // Calculate date range
      const now = new Date()
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0]
      
      // Query CDM data
      const query = [
        `${API_CONFIG.spaceTrack.endpoints.cdm}`,
        `/SAT_1_ID/${noradCatId}`,
        `/TCA/>now`,
        `/TCA/<${formatDate(endDate)}`,
        `/orderby/TCA asc`,
        `/format/json`,
      ].join('')

      const url = `${API_CONFIG.spaceTrack.baseUrl}${query}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

      const response = await fetch(url, {
        credentials: 'include',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Space-Track API error: ${response.status}`)
      }

      const data: CDMData[] = await response.json()
      
      // Cache the results
      this.setCache(cacheKey, data)
      
      console.log(`✅ Fetched ${data.length} conjunction events for ${noradCatId}`)
      return data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏱️ Space-Track request timeout')
      } else {
        console.error('❌ Failed to fetch CDM data:', error)
      }
      return []
    }
  }

  /**
   * Fetch TLE (Two-Line Element) data for a satellite
   * @param noradCatId - NORAD Catalog ID
   */
  async fetchTLE(noradCatId: string): Promise<TLEData | null> {
    const cacheKey = `tle_${noradCatId}`
    
    const cached = this.getFromCache<TLEData>(cacheKey, CACHE_DURATION.tle)
    if (cached) {
      return cached
    }

    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      const query = `${API_CONFIG.spaceTrack.endpoints.tle}/NORAD_CAT_ID/${noradCatId}/format/json`
      const url = `${API_CONFIG.spaceTrack.baseUrl}${query}`

      const response = await fetch(url, { credentials: 'include' })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch TLE: ${response.status}`)
      }

      const data: TLEData[] = await response.json()
      
      if (data.length > 0) {
        this.setCache(cacheKey, data[0])
        return data[0]
      }
      
      return null
    } catch (error) {
      console.error('❌ Failed to fetch TLE data:', error)
      return null
    }
  }

  /**
   * Search for satellites by name
   */
  async searchSatellite(name: string): Promise<any[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      const query = `${API_CONFIG.spaceTrack.endpoints.satcat}/OBJECT_NAME/~~${name}/orderby/OBJECT_NAME asc/format/json`
      const url = `${API_CONFIG.spaceTrack.baseUrl}${query}`

      const response = await fetch(url, { credentials: 'include' })
      
      if (!response.ok) {
        throw new Error(`Failed to search satellite: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('❌ Failed to search satellite:', error)
      return []
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    console.log('🗑️ Space-Track cache cleared')
  }
}

// Export singleton instance
export const spaceTrackService = new SpaceTrackService()

