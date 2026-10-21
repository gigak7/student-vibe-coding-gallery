# 學生 Vibe Coding 作品集

公開展示學生以 AI 生成的 HTML 遊戲作品。靜態網站，可部署於 Vercel／Netlify／Cloudflare Pages。
網址固定：部署後的新增、改版都不會改變首頁網址。

## 結構

- `index.html` — 作品集首頁（由 `build.py` 自動產生，請勿手改）：
  每個主題顯示 2–3 件精選作品，附「查看全部」連結
- `collections/<主題>/index.html` — 該主題的完整作品清單（自動產生）
- `collections/<主題>/` — 每個作品集主題一個資料夾，內含遊戲檔＋`meta.json`

## 新增一個作品集主題

1. 在 `collections/` 下新增資料夾（例：`wechat-miniprogram-2026/`）
2. 放入遊戲檔，檔名格式：`班級學號-遊戲標題.html`（例：`S1A26-太空侵略者.html`；只用班級學號、不用姓名，隱私考量）
3. 在該資料夾新增 `meta.json`：
   `{"title": "主題名稱", "desc": "簡介", "featured": ["檔名1", "檔名2", "檔名3"]}`
   （`featured` 可選：指定首頁精選的 2–3 件作品檔名；不填則取前 3 件）
4. 執行 `python3 build.py` 重新產生首頁與主題分頁
5. push 後部署平台會自動重新發佈，首頁網址不變
