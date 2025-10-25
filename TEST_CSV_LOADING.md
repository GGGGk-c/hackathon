# 🔧 CSV 加载测试指南

## 问题诊断

如果卫星没有自动加载，按以下步骤排查：

---

## 步骤1️⃣：检查文件

```powershell
# 确认文件存在
Test-Path "D:\CODE A\Hackthon2\public\Data.csv"
# 应该返回 True
```

---

## 步骤2️⃣：重启开发服务器

```bash
# 停止当前服务器（Ctrl + C）
# 然后重新启动
npm run dev
```

**重要**：文件更改后必须重启服务器！

---

## 步骤3️⃣：检查浏览器控制台

1. 打开应用（http://localhost:3000）
2. 按 **F12** 打开开发者工具
3. 切换到 **Console** 标签页

### ✅ 成功的日志：
```
🚀 Loading satellites from Data.csv...
✓ Parsed satellite: Sat-25239A
✓ Parsed satellite: Sat-25238B
✓ Parsed satellite: Sat-25238A
✓ Parsed satellite: Sat-25234E
✓ Parsed satellite: Sat-25234D
✓ Parsed satellite: Sat-25234C
✓ Parsed satellite: Sat-25234B
✓ Parsed satellite: Sat-25234A
✓ Parsed satellite: Sat-25232AD
✓ Parsed satellite: Sat-25232AC
✅ Loaded 10 satellites from Data.csv
✅ Successfully loaded 10 satellites
```

### ❌ 失败的日志：
```
❌ Failed to fetch Data.csv: 404
```
**解决**：检查文件是否在 `public/Data.csv`

```
⚠️ No satellites loaded from CSV
```
**解决**：CSV 格式问题，查看下面的格式说明

---

## 步骤4️⃣：验证加载结果

### 检查卫星列表：
- 左侧 **Satellites** 面板应该显示 **[10]**
- 列表中应该有 10 个卫星

### 检查 3D 视图：
- 切换到 **3D Visualization** 标签
- 应该看到 10 个卫星轨道

---

## 🐛 常见问题

### 问题1：404 错误
**症状**：控制台显示 `Failed to fetch Data.csv: 404`

**原因**：文件不在 public 目录

**解决方案**：
```powershell
Copy-Item "D:\CODE A\Hackthon2\Data.csv" "D:\CODE A\Hackthon2\public\Data.csv"
```

### 问题2：没有解析到卫星
**症状**：控制台显示 `No satellites loaded from CSV`

**原因**：TLE 格式不正确

**解决方案**：检查 CSV 文件格式

### 问题3：编码问题
**症状**：看到乱码或解析失败

**解决方案**：
```powershell
# 转换为 UTF-8
Get-Content "Data.csv" | Set-Content "public/Data.csv" -Encoding UTF8
```

---

## 📋 正确的 CSV 格式

Data.csv 应该是这样的：

```
表头行（第1行，会被跳过）
1 66144U 25239A   25297.52786545 ...	2 66144  26.7778 246.6577 ...
1 66143U 25238B   25296.98079824 ...	2 66143  16.4331 273.2361 ...
...
```

**关键点**：
- 第1行是表头（会被跳过）
- 从第2行开始是TLE数据
- 每行包含 TLE Line1 和 Line2，用制表符（Tab）分隔
- Line1 以 `1 ` 开头
- Line2 以 `2 ` 开头

---

## 🔍 手动测试解析器

在浏览器控制台运行：

```javascript
// 测试加载
fetch('/Data.csv')
  .then(r => r.text())
  .then(content => {
    console.log('文件内容:', content.substring(0, 200))
    console.log('文件长度:', content.length)
  })
```

---

## ✅ 验证清单

- [ ] `public/Data.csv` 文件存在
- [ ] 开发服务器已重启
- [ ] 浏览器显示加载动画
- [ ] 控制台显示"✓ Parsed satellite"消息
- [ ] Satellites 面板显示 [10]
- [ ] 3D 视图显示多个轨道

---

## 🚨 仍然不工作？

尝试手动加载：

1. 删除自动加载功能（临时测试）
2. 使用表单手动添加一个卫星
3. 确认系统基本功能正常
4. 然后重新启用自动加载

---

## 📞 Debug 命令

在 PowerShell 中运行：

```powershell
# 1. 检查文件
Get-Content "D:\CODE A\Hackthon2\public\Data.csv" | Select-Object -First 3

# 2. 检查文件大小
(Get-Item "D:\CODE A\Hackthon2\public\Data.csv").Length

# 3. 检查编码
Get-Content "D:\CODE A\Hackthon2\public\Data.csv" -Encoding UTF8 | Select-Object -First 3
```

在浏览器控制台运行：

```javascript
// 测试 TLE 解析器
import { loadSatellitesFromCSV } from './utils/tleParser'

loadSatellitesFromCSV().then(satellites => {
  console.log('加载的卫星数量:', satellites.length)
  console.log('第一个卫星:', satellites[0])
})
```

---

现在重启服务器并刷新页面试试！



