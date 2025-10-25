# 🚨 威胁监控配置指南

## ✅ 已完成的改进

威胁监控系统现在有三种工作模式，更符合实际应用场景！

---

## 🎯 三种威胁模式

### 1️⃣ **Strict Mode（严格模式）** ⭐ 推荐生产环境

**配置**：
```typescript
// src/config/api.config.ts
export const THREAT_MODE = 'strict'
export const USE_SIMULATION = false
```

**特点**：
- ✅ **仅使用真实数据**
- ✅ 不生成任何模拟威胁
- ✅ 依赖 Space-Track.org CDM 数据
- ✅ 依赖真实的空间天气数据
- ✅ 更新频率：每60秒检查一次

**威胁来源**：
1. **真实碰撞预警**（来自 Space-Track.org）
2. **真实太阳风暴**（当 Kp ≥ 6 时）

**适用场景**：
- 生产环境
- 实际卫星运营
- 需要可信数据的场合

**显示标识**：
```
🛡️ Threat Monitor 🔰
0 active threats  [Real Data]
```

---

### 2️⃣ **Demo Mode（演示模式）**

**配置**：
```typescript
export const THREAT_MODE = 'demo'
export const USE_SIMULATION = false
```

**特点**：
- ✅ 主要使用真实数据
- 🟡 偶尔生成演示威胁（3%概率，仅当无真实威胁时）
- ✅ 适合展示和演示

**威胁来源**：
1. **真实碰撞预警**（优先）
2. **真实太阳风暴**（优先）
3. **演示威胁**（仅当无真实威胁时，3%概率）

**适用场景**：
- 产品演示
- 功能展示
- 客户演示

**显示标识**：
```
⚠️ Threat Monitor
X active threats  [Demo]
```

---

### 3️⃣ **Development Mode（开发模式）**

**配置**：
```typescript
export const THREAT_MODE = 'development'
export const USE_SIMULATION = true  // 可选
```

**特点**：
- 🟡 较多模拟威胁（15%概率）
- ✅ 便于测试和开发
- ✅ 快速验证功能

**威胁来源**：
1. **真实碰撞预警**
2. **真实太阳风暴**
3. **模拟威胁**（15%概率，最多5个）

**适用场景**：
- 功能开发
- UI 测试
- 调试

**显示标识**：
```
⚠️ Threat Monitor
X active threats  [Dev]
```

---

## ⚙️ 更新频率配置

### Strict Mode（推荐）
```typescript
export const UPDATE_INTERVALS = {
  spaceWeather: 30000,  // 30秒 - 空间天气更新
  threats: 60000,       // 60秒 - 威胁检测
  positions: 1000,      // 1秒 - 位置更新
}
```

### Development Mode
```typescript
export const UPDATE_INTERVALS = {
  spaceWeather: 5000,   // 5秒 - 更频繁
  threats: 10000,       // 10秒 - 更频繁
  positions: 1000,      // 1秒
}
```

---

## 🎨 界面显示

### Strict Mode
```
🚨 Threat Monitor 🛡️           0 active threats  [🟢 Real Data]

┌────────────────────────────────────────────┐
│            All systems nominal              │
│           No threats detected               │
└────────────────────────────────────────────┘
```

### 有真实威胁时
```
🚨 Threat Monitor 🛡️           2 active threats  [🟢 Real Data]

┌────────────────────────────────────────────┐
│ 🛰️ CONJUNCTION                   [CRITICAL]│
│ Target: ISS                                 │
│ Real conjunction detected with              │
│ COSMOS 1408 DEB (ID: 51465)                │
│ Miss distance: 245m                         │
│                                             │
│ Time to Event: 3h 24m                      │
│ Probability: 78.5%                         │
│ Detected: 2 hours ago                      │
└────────────────────────────────────────────┘
```

---

## 🔍 威胁类型说明

### 真实威胁

#### 1. 碰撞预警（CONJUNCTION）
**数据源**：Space-Track.org CDM

**显示**：
```
Real conjunction detected with [Object Name] (ID: [NORAD ID])
Miss distance: XXXm
```

**特征**：
- 包含真实的物体 ID
- 真实的碰撞概率
- 精确的错过距离
- 真实的 TCA（最接近时间）

#### 2. 太阳风暴（SOLAR-STORM）
**数据源**：NOAA 空间天气数据

**显示**：
```
[REAL DATA] High solar activity detected.
Kp=6.5, Solar Wind=650 km/s
```

**触发条件**：
- Kp 指数 ≥ 6
- 或太阳活动等级为 "storm"

---

### 模拟威胁（仅 Demo/Dev 模式）

#### 1. 模拟碰撞
```
[SIMULATED] Close approach detected.
Object 45382. Miss distance: 523m
```

#### 2. 模拟碎片
```
[SIMULATED] Space debris detected.
Size: 25.3 cm
```

#### 3. 模拟 CME
```
[SIMULATED] Coronal Mass Ejection.
Density: 850 particles/cm³
```

**标识**：所有模拟威胁都会标记 `[SIMULATED]`

---

## 📊 威胁概率对比

| 模式 | 真实碰撞 | 真实太阳风暴 | 模拟威胁 | 检查频率 |
|------|---------|------------|---------|---------|
| **Strict** | ✅ | ✅ | ❌ | 60秒 |
| **Demo** | ✅ | ✅ | 3% | 60秒 |
| **Development** | ✅ | ✅ | 15% | 10秒 |

---

## 🚀 如何切换模式

### 方法1：修改配置文件

编辑 `src/config/api.config.ts`：

```typescript
// 生产环境 - Strict Mode
export const THREAT_MODE = 'strict'
export const USE_SIMULATION = false
export const UPDATE_INTERVALS = {
  spaceWeather: 30000,
  threats: 60000,
  positions: 1000,
}

// 演示环境 - Demo Mode
export const THREAT_MODE = 'demo'
export const USE_SIMULATION = false

// 开发环境 - Development Mode
export const THREAT_MODE = 'development'
export const USE_SIMULATION = true
export const UPDATE_INTERVALS = {
  spaceWeather: 5000,
  threats: 10000,
  positions: 1000,
}
```

### 方法2：使用环境变量（推荐）

创建不同的 `.env` 文件：

**.env.production**
```env
VITE_THREAT_MODE=strict
VITE_USE_SIMULATION=false
VITE_UPDATE_INTERVAL_THREATS=60000
```

**.env.development**
```env
VITE_THREAT_MODE=development
VITE_USE_SIMULATION=true
VITE_UPDATE_INTERVAL_THREATS=10000
```

---

## 🎯 推荐配置

### 生产部署
```typescript
THREAT_MODE = 'strict'
USE_SIMULATION = false
Space-Track 账号已配置
```

### 客户演示
```typescript
THREAT_MODE = 'demo'
USE_SIMULATION = false
```

### 本地开发
```typescript
THREAT_MODE = 'development'
USE_SIMULATION = true
```

---

## 📈 性能影响

| 模式 | CPU 使用 | API 调用 | 内存占用 |
|------|---------|---------|---------|
| **Strict** | 低 | 中 | 低 |
| **Demo** | 低 | 中 | 低 |
| **Development** | 中 | 高 | 中 |

---

## ✅ 验证清单

### Strict Mode 验证
- [ ] 界面显示 🛡️ 图标
- [ ] 标签显示 "Real Data"
- [ ] 无 `[SIMULATED]` 威胁
- [ ] 仅在 Kp ≥ 6 时显示太阳风暴
- [ ] 仅在有 CDM 数据时显示碰撞

### Demo Mode 验证
- [ ] 标签显示 "Demo"
- [ ] 主要显示真实威胁
- [ ] 偶尔出现 `[SIMULATED]` 标记的威胁
- [ ] 无真实威胁时才可能有模拟

### Development Mode 验证
- [ ] 标签显示 "Dev"
- [ ] 威胁较多（15%概率）
- [ ] 快速更新（10秒）
- [ ] 包含 `[SIMULATED]` 标记

---

## 🐛 故障排查

### 问题：Strict 模式下一直没有威胁

**这是正常的！** 原因：
1. ✅ 大多数时间卫星都是安全的
2. ✅ 真实碰撞风险很罕见
3. ✅ 当前空间天气可能平静（Kp < 6）

**验证方法**：
- 检查 Space Weather Panel：Kp Index < 6 = 正常
- 查看控制台：是否有 CDM 数据查询
- 添加 ISS（NORAD 25544）：更可能有碰撞数据

### 问题：Dev 模式下威胁太多

**解决方案**：
```typescript
// 降低概率
if (Math.random() > 0.95 && threats.length < 3)
```

### 问题：想临时看到威胁效果

**快速切换**：
```typescript
// 临时改为 demo 模式
export const THREAT_MODE = 'demo'
```
然后刷新页面

---

## 🎉 完成！

您的威胁监控系统现在：
- ✅ 默认使用 **Strict Mode**（实际模式）
- ✅ 仅显示真实威胁
- ✅ 更符合生产环境需求
- ✅ 可轻松切换模式
- ✅ 有明确的视觉标识

**当前配置**：
```
模式: Strict (严格)
更新: 每60秒
数据: 仅真实数据
标识: 🛡️ Real Data
```

刷新页面即可看到新的实际模式效果！🚀



