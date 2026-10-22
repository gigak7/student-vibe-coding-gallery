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

## 微信小程序作品主題（新：`type: miniprogram`）

微信小程序不能像 HTML 遊戲那樣直接嵌在網頁裡遊玩，所以這類主題改用
「縮圖＋一句簡介＋小程序碼＋演示影片」的卡片版式。版式示範：
`preview/miniprogram-card-preview.html`（本機瀏覽器直接打開即可看）。

做法：

1. 在 `collections/` 下新增資料夾（例：`weapp-whackamole/`）
2. 在該資料夾新增 `meta.json`，格式：
   ```json
   {
     "title": "微信小程序・打地鼠",
     "desc": "第4講作品簡介",
     "type": "miniprogram",
     "featured": ["work-id-1", "work-id-2"],
     "works": [
       {"id": "S1A26-打地鼠", "title": "打地鼠", "student": "S1A26",
        "desc": "一句簡介（學生自己寫或老師代寫）",
        "thumb": "thumbnails/S1A26-打地鼠.jpg",
        "qrcode": "qrcodes/S1A26-打地鼠.png",
        "video": "https://…演示影片連結（選填）"}
     ]
   }
   ```
   - `featured` 可選：首頁精選 2–3 件的 `id`；不填取前 3 件
   - 只用班級學號、不用姓名（和 HTML 遊戲同一隱私規則）
3. 縮圖：從微信小程序教育平台的網頁預覽截圖，16:9 裁好，
   存 `thumbnails/<id>.jpg`（建議 480x270）
4. 小程序碼：正式版發布後的小程序碼，或體驗版二維碼，
   存 `qrcodes/<id>.png`；還沒拿到的先留空，卡片會顯示「小程序碼待補」
5. 執行 `python3 build.py`；構建時會列出缺縮圖／缺小程序碼的提醒
6. push 後自動重新發佈，首頁網址不變

注意：`thumbnails/`、`qrcodes/` 內的圖片檔不用推送——`build.py`
會把圖片以 base64 直接內嵌進 HTML（和 HTML 遊戲縮圖同一機制）。

## 投票功能

- 每張作品卡片有「👍 投票」按鈕；首頁頂部有「🏆 人氣投票 Top 3」即時榜
- 實作：`site/api/vote.js`（POST 投票）、`site/api/votes.js`（GET 票數）、前端 JS（`build.py` 的 `VOTE_JS`）
- 票數存在 Vercel KV（Redis）：**需在 Vercel 後台一次性建立**
  1. Vercel Dashboard → 專案 → Storage → Create Database → KV → 建立
  2. 連接到本專案（會自動注入 `KV_REST_API_*` 環境變數）
  3. 到 Deployments 按 Redeploy 使環境變數生效
- 防刷票規則：
  - 同一裝置對同一作品只能投一票（瀏覽器 localStorage 記錄）
  - 同一 IP 每 60 秒最多投 10 票（`api/vote.js` 的 `RATE_LIMIT_PER_MINUTE`；
    學校 WiFi 共用同一公網 IP，設太嚴會擋住正常投票）
- Top3 榜由前端 JS 按票數即時排序渲染；`build.py` 會把全部作品資訊寫入
  首頁的 `window.GAME_META` 供榜單使用

## 縮圖

- 每件遊戲配一張 480x270 縮圖，放在 `collections/<主題>/thumbnails/<遊戲檔名>.jpg`
- 產生方式：以無頭瀏覽器載入遊戲截圖（見 `/tmp/cdp_shot4.py` 思路：data: URL＋CDP 截圖）
- 注意：GitHub connector 不支援推送二進位檔，`build.py` 會把縮圖以 base64
  直接內嵌進 HTML，推送時 `thumbnails/` 資料夾不列入清單
