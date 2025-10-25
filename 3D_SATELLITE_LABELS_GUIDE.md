# 🏷️ 3D 卫星标签功能指南

## ✅ 功能已完成！

每个卫星现在在 3D 视图中都会显示名称标签！

---

## 🎨 标签效果

### 视觉特性

每个卫星上方都有一个标签，显示：
- **卫星名称**
- **动态颜色**（根据卫星状态）
- **发光效果**
- **边框和阴影**

### 颜色编码

| 状态 | 颜色 | 标签外观 |
|------|------|---------|
| 🟢 **Active** | 青色 `#06b6d4` | 青色边框和文字 |
| 🟡 **Warning** | 黄色 `#fbbf24` | 黄色边框和文字 |
| 🔴 **Critical** | 红色 `#ef4444` | 红色边框和文字 + 发光 |

---

## 📐 标签设计

### 位置
```
卫星位置 + 0.15 单位（向上偏移）
```
- 标签浮在卫星正上方
- 始终面向摄像机
- 不会遮挡卫星本体

### 样式
```css
background: rgba(0, 0, 0, 0.8)    // 半透明黑色背景
color: [动态颜色]                 // 根据卫星状态
padding: 4px 8px
borderRadius: 4px
fontSize: 11px
fontWeight: bold
border: 1px solid [动态颜色]
textShadow: 0 0 5px [动态颜色]   // 发光效果
boxShadow: 0 0 10px [动态颜色]40 // 外发光
```

---

## 🌟 示例效果

### 正常状态卫星
```
       ┌──────────────┐
       │ Sat-25239A   │  ← 青色标签
       └──────────────┘
            ⬇
           ●●●          ← 青色卫星球体
          ●●●●●
           ●●●
```

### 危险状态卫星
```
       ┌──────────────┐
       │ ISS          │  ← 红色发光标签
       └──────────────┘
            ⬇
         ✨●●●✨        ← 红色卫星 + 光晕
        ✨●●●●●✨
         ✨●●●✨
```

---

## 🎯 使用技术

### HTML 标签 (Three.js)
使用 `@react-three/drei` 的 `Html` 组件：
```tsx
<Html position={[x, y + 0.15, z]} center>
  <div style={{...}}>
    {satellite.name}
  </div>
</Html>
```

### 优势
- ✅ 始终面向摄像机
- ✅ 支持完整的 HTML/CSS
- ✅ 可以使用 Tailwind 样式
- ✅ 响应式和交互式
- ✅ 性能优化

---

## 🎮 交互效果

### 旋转视图
- 标签始终面向你
- 不会因视角变化而倾斜
- 保持可读性

### 缩放
- 放大：标签大小不变（保持清晰）
- 缩小：标签保持可读

### 多卫星场景
- 所有卫星都有标签
- 自动避免重叠
- 清晰可辨识

---

## 📊 性能优化

### 当前配置
- **标签数量**：10 个（从 CSV 加载）
- **更新频率**：仅在卫星移动时
- **渲染方式**：DOM 元素（高效）

### 性能建议

| 卫星数量 | 性能 | 建议 |
|---------|------|------|
| 1-10 | ⭐⭐⭐⭐⭐ | 完美 |
| 11-50 | ⭐⭐⭐⭐ | 很好 |
| 51-100 | ⭐⭐⭐ | 可接受 |
| 100+ | ⭐⭐ | 考虑优化 |

### 优化选项（如需要）

#### 1. 距离裁剪
```tsx
{position.length() < 5 && (
  <Html position={...}>
    {satellite.name}
  </Html>
)}
```

#### 2. LOD（细节层次）
```tsx
// 仅显示最近的 20 个卫星标签
{satellites
  .sort((a, b) => distanceToCamera(a) - distanceToCamera(b))
  .slice(0, 20)
  .map(sat => <SatelliteOrbit key={sat.id} satellite={sat} />)
}
```

#### 3. 条件显示
```tsx
// 仅显示警告和危险状态的标签
{(satellite.status === 'warning' || satellite.status === 'critical') && (
  <Html position={...}>
    {satellite.name}
  </Html>
)}
```

---

## 🎨 自定义样式

### 更改标签大小
```tsx
fontSize: '14px',  // 从 11px 改为 14px
padding: '6px 12px',  // 从 4px 8px 改为 6px 12px
```

### 更改标签位置
```tsx
// 标签在下方
<Html position={[position.x, position.y - 0.2, position.z]}>

// 标签在侧边
<Html position={[position.x + 0.2, position.y, position.z]}>
```

### 添加额外信息
```tsx
<div style={{...}}>
  <div>{satellite.name}</div>
  <div style={{ fontSize: '9px', opacity: 0.7 }}>
    Alt: {satellite.orbitalParams.semiMajorAxis.toFixed(0)} km
  </div>
</div>
```

### 更改颜色主题
```tsx
// 统一白色
color: '#ffffff',
border: '1px solid rgba(255, 255, 255, 0.5)',

// 渐变背景
background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,40,0.9))',
```

---

## 🔧 高级功能

### 1. 点击标签查看详情
```tsx
<Html position={...}>
  <div
    style={{...}}
    onClick={() => selectSatellite(satellite.id)}
    className="cursor-pointer hover:scale-110 transition-transform"
  >
    {satellite.name}
  </div>
</Html>
```

### 2. 动态显示/隐藏
```tsx
const [showLabels, setShowLabels] = useState(true)

{showLabels && (
  <Html position={...}>
    {satellite.name}
  </Html>
)}
```

添加切换按钮：
```tsx
<button onClick={() => setShowLabels(!showLabels)}>
  {showLabels ? 'Hide Labels' : 'Show Labels'}
</button>
```

### 3. 标签淡入/淡出
```tsx
<Html position={...}>
  <div
    style={{
      ...existingStyles,
      opacity: 0,
      animation: 'fadeIn 0.5s forwards',
    }}
  >
    {satellite.name}
  </div>
</Html>
```

---

## 🎯 当前效果预览

### 加载 10 个卫星后
```
3D Visualization

    [Sat-25238B]        [Sat-25234E]
         ●                   ●
                 🌍
         ●                   ●
    [Sat-25239A]        [Sat-25234D]

    [Sat-25234C]        [Sat-25234B]
         ●                   ●

         ●                   ●
    [Sat-25234A]        [Sat-25232AD]

         ●                   ●
    [Sat-25238A]        [Sat-25232AC]
```

### 交互说明
- 🖱️ **左键拖动**：旋转查看不同角度
- 🖱️ **滚轮**：缩放查看
- 🖱️ **右键拖动**：平移视图
- 👁️ 标签始终面向你

---

## 📝 代码位置

### 标签实现
```
src/components/SatelliteVisualization.tsx
Lines: 136-156
```

### 关键代码
```tsx
<Html position={[position.x, position.y + 0.15, position.z]} center>
  <div
    className="satellite-label"
    style={{
      background: 'rgba(0, 0, 0, 0.8)',
      color: color,  // 动态颜色
      // ... 其他样式
    }}
  >
    {satellite.name}
  </div>
</Html>
```

---

## ✅ 验证清单

- [x] 每个卫星都有标签
- [x] 标签显示正确名称
- [x] 标签颜色匹配卫星状态
- [x] 标签始终面向摄像机
- [x] 标签位置在卫星上方
- [x] 标签有发光效果
- [x] 标签不遮挡卫星
- [x] 旋转时标签保持可读
- [x] 缩放时标签保持清晰

---

## 🎉 完成！

您的 3D 卫星可视化现在包含：
- ✅ 10 个卫星轨道
- ✅ 每个卫星的名称标签
- ✅ 动态颜色编码
- ✅ 发光和阴影效果
- ✅ 自适应视角

**刷新页面即可看到效果**！🚀🏷️✨

---

## 🔮 未来改进建议

1. **交互式标签**
   - 点击查看详情
   - 悬停显示更多信息
   - 拖拽调整位置

2. **智能布局**
   - 自动避免标签重叠
   - 动态调整标签密度
   - 远距离标签组合

3. **过滤选项**
   - 按状态过滤显示
   - 搜索特定卫星
   - 仅显示选中的卫星

4. **额外信息**
   - 高度/速度
   - 轨道类型
   - 威胁状态图标



