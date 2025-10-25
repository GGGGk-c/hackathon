/**
 * Real Space Weather Data Service
 * Integrates actual NOAA data from provided JSON files
 */

interface KpIndexData {
  time_tag: string
  k_index: number
}

interface SolarFlux {
  frequency: number
  flux: number
  observed_quality: string
}

interface SolarRadioData {
  time_tag: string
  common_name: string
  details: SolarFlux[]
}

interface SolarProbability {
  date: string
  c_class_1_day: number
  m_class_1_day: number
  x_class_1_day: number
  polar_cap_absorption: string
}

export interface RealSpaceWeather {
  kpIndex: number
  solarFlareLevel: 'quiet' | 'active' | 'storm'
  solarWindSpeed: number
  protonFlux: number
  electronFlux: number
  solarRadioFlux: number
  flareProb ability: {
    cClass: number
    mClass: number
    xClass: number
  }
  lastUpdate: Date
}

class RealSpaceWeatherService {
  private kpData: KpIndexData[] = []
  private solarRadioData: SolarRadioData[] = []
  private solarProbData: SolarProbability[] = []
  public dataLoaded = false // Changed to public to allow manual refresh

  /**
   * Load data from public JSON files
   */
  async loadData(): Promise<void> {
    if (this.dataLoaded) return

    try {
      // Load Kp Index data
      const kpResponse = await fetch('/data/boulder_k_index_1m.json')
      this.kpData = await kpResponse.json()

      // Load Solar Radio Flux data  
      const radioResponse = await fetch('/data/solar-radio-flux.json')
      this.solarRadioData = await radioResponse.json()

      // Load Solar Probabilities
      const probResponse = await fetch('/data/solar_probabilities.json')
      this.solarProbData = await probResponse.json()

      this.dataLoaded = true
      console.log('✅ Real space weather data loaded successfully')
    } catch (error) {
      console.error('Failed to load space weather data:', error)
      throw error
    }
  }

  /**
   * Get current space weather conditions
   */
  getCurrentWeather(): RealSpaceWeather {
    if (!this.dataLoaded) {
      throw new Error('Data not loaded. Call loadData() first.')
    }

    // Get latest Kp index
    const latestKp = this.kpData[this.kpData.length - 1]
    const kpIndex = latestKp?.k_index || 2.0

    // Determine solar flare level from Kp
    const solarFlareLevel: 'quiet' | 'active' | 'storm' = 
      kpIndex >= 6 ? 'storm' :
      kpIndex >= 4 ? 'active' : 'quiet'

    // Get latest solar radio flux (proxy for solar activity)
    const latestRadio = this.solarRadioData[0]
    const flux2800 = latestRadio?.details.find(d => d.frequency === 2695)?.flux || 120
    
    // Estimate solar wind speed from Kp (empirical formula)
    // Kp 0-3: ~400 km/s, Kp 4-6: ~500-600 km/s, Kp 7-9: ~700-800 km/s
    const solarWindSpeed = 350 + (kpIndex * 50)

    // Get solar flare probabilities
    const latestProb = this.solarProbData[0]
    const flareProbability = {
      cClass: latestProb?.c_class_1_day || 50,
      mClass: latestProb?.m_class_1_day || 10,
      xClass: latestProb?.x_class_1_day || 1,
    }

    // Estimate particle flux from Kp and solar flux
    const protonFlux = 10 * Math.pow(1.5, kpIndex - 2)
    const electronFlux = 1000 * Math.pow(1.3, kpIndex - 2)

    return {
      kpIndex: Number(kpIndex.toFixed(1)),
      solarFlareLevel,
      solarWindSpeed: Math.round(solarWindSpeed),
      protonFlux: Math.round(protonFlux * 10) / 10,
      electronFlux: Math.round(electronFlux),
      solarRadioFlux: flux2800,
      flareProbability,
      lastUpdate: new Date(latestKp?.time_tag || new Date()),
    }
  }

  /**
   * Get Kp index history for charting
   */
  getKpHistory(hours: number = 24): Array<{ time: Date; kp: number }> {
    const now = new Date()
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000)
    
    return this.kpData
      .filter(d => new Date(d.time_tag) >= cutoff)
      .map(d => ({
        time: new Date(d.time_tag),
        kp: d.k_index,
      }))
  }

  /**
   * Get solar radio flux by frequency
   */
  getSolarRadioFlux(frequency: number = 2695): number {
    const latestData = this.solarRadioData[0]
    const flux = latestData?.details.find(d => d.frequency === frequency)
    return flux?.flux || 0
  }

  /**
   * Check if current conditions are dangerous for satellites
   */
  isDangerous(): boolean {
    const weather = this.getCurrentWeather()
    return weather.kpIndex >= 6 || weather.solarFlareLevel === 'storm'
  }

  /**
   * Get threat level description
   */
  getThreatLevel(): 'low' | 'medium' | 'high' | 'critical' {
    const weather = this.getCurrentWeather()
    
    if (weather.kpIndex >= 7) return 'critical'
    if (weather.kpIndex >= 6) return 'high'
    if (weather.kpIndex >= 4) return 'medium'
    return 'low'
  }
}

// Export singleton instance
export const realSpaceWeatherService = new RealSpaceWeatherService()





