# GitHub Pages 部署说明

## ✅ 已完成的准备工作

1. ✅ 初始化 git 仓库
2. ✅ 创建 gh-pages 分支
3. ✅ 添加部署文件（index.html, oceano-crm-enhanced.html）
4. ✅ 创建初始提交

## 📋 接下来的步骤

### 步骤1：在GitHub创建新仓库

1. 访问 https://github.com/new
2. 仓库名称：`oceano-crm-demo`（或你喜欢的名字）
3. 设置为 **Public**（公开）
4. **不要**勾选 "Add a README file"
5. 点击 "Create repository"

### 步骤2：推送代码到GitHub

在终端中运行以下命令（替换 `你的用户名` 为你的GitHub用户名）：

```bash
cd /Users/MurphyCom/Downloads/Antigravity
git remote add origin https://github.com/你的用户名/oceano-crm-demo.git
git push -u origin gh-pages
```

### 步骤3：启用GitHub Pages

1. 在GitHub仓库页面，点击 "Settings"
2. 在左侧菜单找到 "Pages"
3. 在 "Source" 下拉菜单中选择 `gh-pages` 分支
4. 点击 "Save"
5. 等待1-2分钟，页面会显示访问地址

### 🎉 完成！

你的演示系统将在以下地址可访问：

```
https://你的用户名.github.io/oceano-crm-demo/
```

或者访问完整版：

```
https://你的用户名.github.io/oceano-crm-demo/oceano-crm-enhanced.html
```

## 💡 提示

- 首次部署可能需要等待1-2分钟
- 每次更新代码后，只需 `git push` 即可自动更新网站
- 完全免费，无流量限制
- 支持自定义域名

## 🔄 更新网站

以后如果需要更新演示系统，只需：

```bash
git add .
git commit -m "更新演示内容"
git push
```

等待1-2分钟，网站会自动更新。
