# 瞿林毅 · 个人作品集

React + Vite 个人作品集网站。工业设计工程硕士在读、车辆工程本科，展示设计、工程实践与跨领域综合能力。

包含六个项目、项目详情、软件使用截图、学习成果、实习与项目经历。保留自动轮播与滚轮控制、GSAP 动画、WebGL 背景、加载进度和响应式交互。所有网页必需的媒体与字体均随项目提供。

在线作品集：https://qly-701.github.io/zuopinji/

仓库：https://github.com/qly-701/zuopinji

分享二维码：[PNG](https://qly-701.github.io/zuopinji/downloads/portfolio-qr.png) · [SVG](https://qly-701.github.io/zuopinji/downloads/portfolio-qr.svg)

## Windows 本地开发

安装 [Node.js 22 LTS 或更新的 LTS 版本](https://nodejs.org/)，然后将仓库完整下载并解压。在项目根目录打开 CMD 或 PowerShell：

```bat
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1
```

打开终端打印的地址，通常为 `http://127.0.0.1:5173/`。首次安装依赖需要联网。`npm.cmd` 可避免 PowerShell 对 `npm.ps1` 的执行策略限制。

不要直接双击 HTML 文件；模块及资源路径需要通过 HTTP 服务打开。

## 构建与预览

```bat
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1
```

预览地址通常为 `http://127.0.0.1:4173/`，以终端实际输出为准。

## GitHub Pages

`.github/workflows/deploy-pages.yml` 在推送 `main` 或手动触发时自动构建和发布。仓库需在 Settings → Pages 中将 Source 设置为 **GitHub Actions**。

工作流会自动读取 Pages 域名与子目录，修正页面、图片、视频、字体和动态媒体路径，并生成指向实际作品集页面的二维码：

```text
<作品集网址>/downloads/portfolio-qr.png
<作品集网址>/downloads/portfolio-qr.svg
```

`PORTFOLIO_SITE_URL` 为空时不会生成二维码，避免产生无效链接。源码与完整素材可以从 GitHub 的 **Code → Download ZIP** 下载。

## 主要目录

```text
src/                  React、CSS、内容数据、组件与 GSAP 动效
public/               图片、视频、图标、字体、PDF 及许可证
scripts/              发布准备和原有离线维护脚本
docs/                 性能审查记录
.github/workflows/    GitHub Pages 自动部署
index.html            HTML 入口
vite.config.js        Vite 配置与部署路径
package.json          依赖与运行命令
package-lock.json     依赖锁文件
```

修改 `src/data.js` 更新个人与项目信息，`src/softwareData.js` 和配套 JSON 更新软件信息；页面与视觉样式位于 `src/main.jsx`、`src/styles.css` 和 `src/components/`。

## 运行说明

页面不依赖在线 API；外部来源链接需要网络，邮件及电话链接需要设备上的相应应用。WebGL 不可用或系统开启减少动态效果时使用原有降级逻辑。

Python 维护脚本用于重新生成 PDF 或优化媒体，普通本地开发与 Pages 构建均无需运行。若需要使用它们，应另行安装 PyMuPDF、Pillow、FFmpeg/ffprobe，并将脚本中的原 Linux 字体、报告路径调整为本机路径；已生成资源已包含在仓库中。

本项目保留素材署名与第三方许可证。作品内容及个人资料属于作者；第三方电影剧照、软件界面及相关资料的权利归各自权利人。
