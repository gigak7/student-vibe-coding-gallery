# 學生 Vibe Coding 作品集

公開展示學生以 AI 生成的 HTML 遊戲作品。靜態網站，可部署於 Vercel／Netlify／Cloudflare Pages。

## 結構

- `index.html` — 作品集首頁（由 `build.py` 自動產生，請勿手改）
- `collections/<主題>/` — 每個作品集主題一個資料夾，內含遊戲檔＋`meta.json`

## 新增一個作品集主題

1. 在 `collections/` 下新增資料夾（例：`wechat-miniprogram-2026/`）
2. 放入遊戲檔，檔名格式：`學號姓名-遊戲標題.html`（例：`S1A26鄧梓浩-太空侵略者.html`）
3. 在該資料夾新增 `meta.json`：`{"title": "主題名稱", "desc": "簡介"}`
4. 執行 `python3 build.py` 重新產生首頁
5. push 後部署平台會自動重新發佈
