# 在 iPad 上游玩《甜甜合伙人》

## 最快试玩：同一 Wi-Fi

最简单的方法是右键使用 PowerShell 运行 [Start-iPad-Preview.ps1](./Start-iPad-Preview.ps1)。它会自动显示 iPad 需要打开的局域网地址。

也可以在电脑的 PowerShell 手动运行：

```powershell
cd "C:\Users\sharl\Documents\New project\sweet-merge-cafe"
python -m http.server 8080 --bind 0.0.0.0
```

再运行 `ipconfig`，找到电脑的 IPv4 地址，例如 `192.168.1.10`。iPad 与电脑连到同一 Wi-Fi 后，在 Safari 打开 `http://192.168.1.10:8080`。

这适合试玩；电脑需要保持运行，且存档不会自动与电脑同步。

## 安装成离线网页 App

将整个项目部署到任意支持 HTTPS 的静态网页托管服务。用 iPad Safari 打开网址后，点击分享按钮，选择“添加到主屏幕”。随后从桌面图标启动即可全屏运行；首次打开完成后，游戏资源会离线缓存。

游戏存档仍保存在设备本地。若需要在电脑与 iPad 间转移进度，请使用游戏内的“导出存档”和“导入存档”。
