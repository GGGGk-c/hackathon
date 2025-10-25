# 🚀 真实数据快速启动指南

## 📝 5分钟启用真实碰撞检测数据

### 第1步：注册账号 (2分钟)
访问 https://www.space-track.org/auth/register 注册免费账号

### 第2步：配置环境 (1分钟)
1. 复制配置模板：
   ```bash
   copy ENV_CONFIG_TEMPLATE.txt .env
   ```

2. 编辑 `.env`，填入你的凭据：
   ```env
   VITE_SPACETRACK_USERNAME=你的用户名
   VITE_SPACETRACK_PASSWORD=你的密码
   VITE_USE_SIMULATION=false
   ```

### 第3步：修改配置 (30秒)
编辑 `src/config/api.config.ts`：
```typescript
export const USE_SIMULATION = false  // 改为 false
```

### 第4步：运行 (1分钟)
```bash
npm run dev
```

### 第5步：验证 (30秒)
打开浏览器，在 **Threat Monitor** 右上角查看：
- 🟢 **Real Data** = 成功！
- 🟡 **Simulated** = 需要检查配置

---

## 🎯 当前数据源

### ✅ 已使用真实数据：
1. ✅ **空间天气** - NOAA实时数据
   - Kp地磁指数
   - 太阳射电通量
   - 太阳耀斑概率

2. ✅ **碰撞检测** - Space-Track.org CDM数据
   - 未来7天碰撞预警
   - 真实碰撞概率
   - 目标物体信息

### ⚡ 仍在模拟：
- 🔄 **碎片检测** - 需要额外的API（如ESA DISCOS）
- 🔄 **CME（日冕物质抛射）** - 可集成NOAA DONKI API

---

## 📊 测试建议

### 方法1：使用ISS（推荐）
ISS经常有碰撞预警数据：
```typescript
// 在表单中输入：
名称: ISS
NORAD ID: 25544
半长轴: 6793 km
偏心率: 0.0003
倾角: 51.64°
```

### 方法2：查看空间天气威胁
当Kp指数 ≥ 6时，系统会自动生成太阳风暴威胁（基于真实数据）

### 方法3：检查控制台
打开浏览器开发者工具（F12），查看：
```
✅ Space-Track authentication successful
✅ Fetched 3 conjunction events for ISS
📦 Using cached CDM data for 25544
```

---

## 🐛 常见问题

### Q: 显示"Simulated"而不是"Real Data"？
**A:** 检查：
1. `.env` 文件是否存在且配置正确
2. `api.config.ts` 中 `USE_SIMULATION = false`
3. 浏览器控制台的错误信息

### Q: 没有看到碰撞威胁？
**A:** 这很正常！真实世界中：
- 大多数卫星大部分时间是安全的
- 只有检测到潜在碰撞时才会有CDM数据
- 建议使用ISS测试（NORAD: 25544）

### Q: 认证失败（401错误）？
**A:** 
1. 确认用户名/密码正确
2. 登录 https://www.space-track.org 验证账号
3. 检查邮箱是否已验证

---

## 📚 更多信息

- 📖 **完整指南**：`真实碰撞检测数据集成指南.md`
- ⚙️ **配置模板**：`ENV_CONFIG_TEMPLATE.txt`
- 🌐 **API文档**：https://www.space-track.org/documentation

---

## 🎉 完成！

现在你的系统使用**真实的碰撞检测数据**和**空间天气数据**！

需要帮助？查看控制台日志或阅读详细指南。





