import { OrbitalParameters } from '../types'

/**
 * TLE (Two-Line Element) 数据解析器
 * 将 NORAD TLE 格式转换为轨道参数
 */

interface TLEData {
  name: string
  noradId: string
  line1: string
  line2: string
}

interface ParsedSatellite {
  name: string
  noradId: string
  orbitalParams: OrbitalParameters
  mass: number
  crossSection: number
}

/**
 * 解析 TLE 第二行数据
 * 格式参考: https://en.wikipedia.org/wiki/Two-line_element_set
 */
export function parseTLE(tle: TLEData): ParsedSatellite | null {
  try {
    const line2 = tle.line2.trim()
    
    // 解析轨道参数（从TLE第二行）
    const inclination = parseFloat(line2.substring(8, 16).trim()) // 倾角 (度)
    const raan = parseFloat(line2.substring(17, 25).trim()) // 升交点赤经 (度)
    const eccentricity = parseFloat('0.' + line2.substring(26, 33).trim()) // 偏心率
    const argumentOfPeriapsis = parseFloat(line2.substring(34, 42).trim()) // 近地点幅角 (度)
    const meanAnomaly = parseFloat(line2.substring(43, 51).trim()) // 平近点角 (度)
    const meanMotion = parseFloat(line2.substring(52, 63).trim()) // 平均运动 (圈/天)
    
    // 根据平均运动计算半长轴
    // n = sqrt(GM / a^3) * (86400 / 2π)
    // a = (GM / (n * 2π / 86400)^2)^(1/3)
    const GM = 398600.4418 // 地球引力常数 km^3/s^2
    const meanMotionRadPerSec = meanMotion * 2 * Math.PI / 86400 // 转换为 rad/s
    const semiMajorAxis = Math.pow(GM / (meanMotionRadPerSec * meanMotionRadPerSec), 1/3)
    
    // 从TLE第一行获取NORAD ID
    const line1 = tle.line1.trim()
    const noradId = line1.substring(2, 7).trim()
    
    return {
      name: tle.name || `Satellite ${noradId}`,
      noradId: noradId,
      orbitalParams: {
        semiMajorAxis,
        eccentricity,
        inclination,
        raan,
        argumentOfPeriapsis,
        trueAnomaly: meanAnomaly, // 使用平近点角作为真近点角的近似
      },
      mass: 500, // 默认质量 (kg)
      crossSection: 10, // 默认横截面积 (m²)
    }
  } catch (error) {
    console.error('Error parsing TLE:', error)
    return null
  }
}

/**
 * 从 CSV 内容解析 TLE 数据
 * 支持两种格式：
 * 1. TLE 两行分别在不同行
 * 2. TLE 两行在同一行，用制表符分隔
 */
export function parseTLEFromCSV(csvContent: string): ParsedSatellite[] {
  const satellites: ParsedSatellite[] = []
  const lines = csvContent.split('\n').filter(line => line.trim().length > 0)
  
  // 跳过第一行（表头）
  let i = 1
  while (i < lines.length) {
    const line = lines[i].trim()
    
    // 检查是否包含制表符分隔的 TLE 数据
    if (line.includes('\t') || line.includes('  ')) {
      // 分割行，查找 TLE Line 1 和 Line 2
      const parts = line.split(/\t+/).map(p => p.trim())
      
      let line1 = ''
      let line2 = ''
      
      for (const part of parts) {
        if (part.startsWith('1 ')) {
          line1 = part
        } else if (part.startsWith('2 ')) {
          line2 = part
        }
      }
      
      if (line1 && line2) {
        // 从第一行提取 NORAD ID 作为名称
        const noradId = line1.substring(2, 7).trim()
        const catalogNumber = line1.substring(9, 17).trim()
        
        const tleData: TLEData = {
          name: `Sat-${catalogNumber}`,
          noradId: noradId,
          line1: line1,
          line2: line2,
        }
        
        const satellite = parseTLE(tleData)
        if (satellite) {
          satellites.push(satellite)
          console.log(`✓ Parsed satellite: ${satellite.name}`)
        }
      }
      
      i += 1
    }
    // TLE 第一行以 "1 " 开头（传统格式）
    else if (line.startsWith('1 ')) {
      const line1 = line
      const line2 = i + 1 < lines.length ? lines[i + 1].trim() : ''
      
      // TLE 第二行以 "2 " 开头
      if (line2.startsWith('2 ')) {
        // 从第一行提取 NORAD ID 作为名称
        const noradId = line1.substring(2, 7).trim()
        const catalogNumber = line1.substring(9, 17).trim()
        
        const tleData: TLEData = {
          name: `Sat-${catalogNumber}`,
          noradId: noradId,
          line1: line1,
          line2: line2,
        }
        
        const satellite = parseTLE(tleData)
        if (satellite) {
          satellites.push(satellite)
          console.log(`✓ Parsed satellite: ${satellite.name}`)
        }
        
        i += 2 // 跳过两行
      } else {
        i += 1
      }
    } else {
      i += 1
    }
  }
  
  return satellites
}

/**
 * 从 Data.csv 文件加载卫星数据
 */
export async function loadSatellitesFromCSV(): Promise<ParsedSatellite[]> {
  try {
    const response = await fetch('/Data.csv')
    if (!response.ok) {
      throw new Error(`Failed to fetch Data.csv: ${response.status}`)
    }
    
    const csvContent = await response.text()
    const satellites = parseTLEFromCSV(csvContent)
    
    console.log(`✅ Loaded ${satellites.length} satellites from Data.csv`)
    return satellites
  } catch (error) {
    console.error('❌ Error loading satellites from CSV:', error)
    return []
  }
}

