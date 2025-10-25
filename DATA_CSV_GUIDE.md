# 📡 Data.csv 自动加载卫星指南

## ✅ 功能已完成！

系统现在可以**自动从 Data.csv 加载卫星数据**！

---

## 🎯 工作原理

### 1. TLE 数据格式

Data.csv 包含 **TLE (Two-Line Element)** 格式的卫星轨道数据：

```
1 66144U 25239A   25297.52786545 -.00000170  00000-0  55381-3 0  9993
2 66144  26.7778 246.6577 8217377 178.7247 187.6797  1.16854831    22
```

**第1行**：卫星编号、分类、Epoch 等
**第2行**：轨道参数
- 倾角 (Inclination)
- 升交点赤经 (RAAN)
- 偏心率 (Eccentricity)
- 近地点幅角 (Argument of Periapsis)
- 平近点角 (Mean Anomaly)
- 平均运动 (Mean Motion)

### 2. 自动转换

TLE 数据会被自动转换为应用的轨道参数：

```typescript
{
  semiMajorAxis: 计算值 (km),    // 从平均运动计算
  eccentricity: TLE值,
  inclination: TLE值 (度),
  raan: TLE值 (度),
  argumentOfPeriapsis: TLE值 (度),
  trueAnomaly: 平近点角 (度)
}
```

---

## 🚀 使用方法

### 启动应用

```bash
npm run dev
```

### 自动加载流程

1. **显示加载界面**
   ```
   Loading Satellites...
   Parsing TLE data from Data.csv
   ```

2. **解析 TLE 数据**
   - 读取 `public/Data.csv`
   - 解析 TLE 格式
   - 计算轨道参数

3. **加载卫星**
   - 默认加载前 **10 个卫星**
   - 避免系统过载
   - 可在代码中调整数量

4. **显示结果**
   - 卫星列表自动填充
   - 3D 视图显示所有卫星
   - 开始威胁监控

---

## 📊 当前 Data.csv 内容

您的文件包含 **10 个卫星**：

| NORAD ID | 目录号 | 倾角 | 偏心率 | 轨道类型 |
|---------|--------|------|--------|---------|
| 66144 | 25239A | 26.8° | 0.82 | 高偏心轨道 |
| 66143 | 25238B | 16.4° | 0.76 | 高偏心轨道 |
| 66142 | 25238A | 16.4° | 0.78 | 高偏心轨道 |
| 66057 | 25234E | 97.5° | 0.002 | 近极轨道 |
| 66056 | 25234D | 97.5° | 0.001 | 近极轨道 |
| 66055 | 25234C | 97.5° | 0.001 | 近极轨道 |
| 66054 | 25234B | 97.5° | 0.001 | 近极轨道 |
| 66053 | 25234A | 97.5° | 0.001 | 近极轨道 |
| 66032 | 25232AD | 53.2° | 0.0001 | 中倾轨道 |
| 66031 | 25232AC | 53.2° | 0.0001 | 中倾轨道 |

---

## 🎨 加载后的效果

### Satellites 面板
```
☢️ Satellites [10]  [+]

📡 Sat-25239A
   Alt: 6,793 km • Inc: 26.8°

📡 Sat-25238B
   Alt: 6,793 km • Inc: 16.4°

... (8 more satellites)
```

### 3D Visualization
- 显示 **10 个卫星轨道**
- 不同倾角形成不同轨道面
- 近极轨道 (97.5°) 和中倾轨道 (53°)

### Threat Monitor
- 为所有 10 个卫星检测威胁
- 真实的碰撞检测（如果配置了 Space-Track）
- 模拟的威胁生成

---

## ⚙️ 配置选项

### 更改加载数量

编辑 `src/App.tsx`：

```typescript
// 加载前 20 个卫星
const satellitesToLoad = csvSatellites.slice(0, 20)

// 或加载全部
const satellitesToLoad = csvSatellites
```

### 添加更多卫星到 CSV

在 `public/Data.csv` 中添加 TLE 数据：

```
1 12345U 25001A   25297.00000000 ...
2 12345  98.0000 180.0000 0010000 ...
```

**TLE 数据来源**：
- [CelesTrak](https://celestrak.org/)
- [Space-Track.org](https://www.space-track.org/)
- [n2yo.com](https://www.n2yo.com/)

### 自定义卫星参数

编辑 `src/utils/tleParser.ts` 中的默认值：

```typescript
return {
  name: tle.name || `Satellite ${noradId}`,
  noradId: noradId,
  orbitalParams: { ... },
  mass: 500,           // 修改默认质量
  crossSection: 10,    // 修改默认横截面积
}
```

---

## 🔍 调试信息

打开浏览器控制台（F12）查看：

### 成功加载：
```
🚀 Loading satellites from Data.csv...
✅ Loaded 10 satellites from Data.csv
✅ Successfully loaded 10 satellites
```

### 失败情况：
```
❌ Failed to fetch Data.csv: 404
⚠️ No satellites loaded from CSV
```

**解决方法**：
1. 确认 `public/Data.csv` 文件存在
2. 重启开发服务器
3. 清除浏览器缓存

---

## 📈 性能考虑

### 建议的卫星数量

| 卫星数量 | 性能 | 3D渲染 | 威胁检测 |
|---------|------|--------|---------|
| 1-10 | ⭐⭐⭐⭐⭐ | 流畅 | 实时 |
| 11-50 | ⭐⭐⭐⭐ | 流畅 | 实时 |
| 51-100 | ⭐⭐⭐ | 较好 | 轻微延迟 |
| 100+ | ⭐⭐ | 可能卡顿 | 明显延迟 |

### 优化建议

如果加载大量卫星：

1. **过滤卫星**
```typescript
// 只加载特定倾角的卫星
const filtered = csvSatellites.filter(sat => 
  sat.orbitalParams.inclination > 90
)
```

2. **分批加载**
```typescript
// 每秒加载 5 个
for (let i = 0; i < satellitesToLoad.length; i += 5) {
  const batch = satellitesToLoad.slice(i, i + 5)
  batch.forEach(sat => addSatellite(sat))
  await new Promise(resolve => setTimeout(resolve, 1000))
}
```

3. **禁用某些卫星的威胁检测**

---

## 🔧 故障排查

### 问题1：无法加载卫星

**症状**：页面一直显示 "Loading..."

**解决方案**：
1. 检查 `public/Data.csv` 是否存在
2. 查看控制台错误信息
3. 确认 CSV 格式正确（TLE 格式）

### 问题2：卫星轨道显示异常

**症状**：3D 视图中卫星位置错误

**可能原因**：
- TLE 数据格式错误
- 偏心率过大（>0.9）
- 半长轴计算错误

**解决方案**：
检查 TLE 数据是否有效

### 问题3：性能问题

**症状**：应用卡顿

**解决方案**：
1. 减少加载的卫星数量
2. 调整威胁检测频率
3. 禁用某些卫星的 3D 渲染

---

## 📝 TLE 格式说明

### 第1行格式
```
1 NNNNNC NNNNNAAA NNNNN.NNNNNNNN ...
```
- 卫星编号
- 分类信息
- Epoch (时间)
- 轨道衰减率

### 第2行格式
```
2 NNNNN NNN.NNNN NNN.NNNN NNNNNNN NNN.NNNN NNN.NNNN NN.NNNNNNNNNNNNNN
```
- 倾角 (inclination)
- 升交点赤经 (RAAN)
- 偏心率 (eccentricity)
- 近地点幅角 (argument of perigee)
- 平近点角 (mean anomaly)
- 平均运动 (mean motion)

---

## 🎯 下一步

### 扩展功能

1. **从在线 API 获取 TLE**
```typescript
// CelesTrak API
const response = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json')
```

2. **定期更新轨道数据**
```typescript
// 每小时更新一次
setInterval(loadSatellitesFromCSV, 3600000)
```

3. **TLE 有效性验证**
```typescript
// 检查 Epoch 是否过期
const epochAge = now - parseEpoch(tle)
if (epochAge > 7 * 24 * 3600) {
  console.warn('TLE data is outdated')
}
```

---

## 🎉 完成！

您的系统现在可以：
- ✅ 自动从 Data.csv 加载卫星
- ✅ 解析 TLE 格式数据
- ✅ 显示加载进度
- ✅ 在 3D 视图中渲染所有卫星
- ✅ 监控所有卫星的威胁

**当前状态**：
- 📡 **10 个卫星**已自动加载
- 🌍 在 3D 视图中可见
- 🚨 威胁监控已激活

刷新页面即可看到效果！🚀



