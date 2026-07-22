# WebMapApp

Web Map Application ที่รวมตัวอย่างการใช้งาน Web Map API ยอดนิยม 3 ตัว ได้แก่ [Leaflet](https://leafletjs.com/), [MapLibre GL JS](https://maplibre.org/) และ [CesiumJS](https://cesium.com/platform/cesiumjs/) ไว้ในที่เดียว พร้อมระบบค้นหา/ไฮไลต์จังหวัดของไทยบนแผนที่ทั้งสามหน้า

## Live Demo

- GitHub Pages: https://sr120899.github.io/WebMapApp/

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- React Router
- Leaflet, MapLibre GL JS, CesiumJS

**Backend**
- FastAPI (Python) — เสิร์ฟไฟล์ frontend build เป็น SPA และมี endpoint `/health`
- ออกแบบไว้สำหรับ deploy ผ่าน Docker บน Google Cloud Run

## Project Structure

```
WebMapApp/
├── frontend/          # React + Vite app (Leaflet / MapLibre / Cesium examples)
├── backend/           # FastAPI app ที่เสิร์ฟ frontend build และ API
└── Example/           # ข้อมูลตัวอย่าง (GeoJSON, shapefile, POI) สำหรับพัฒนา/ทดสอบ
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

เปิดที่ http://localhost:5173

Build production:

```bash
npm run build
```

คำสั่งนี้จะ build ไปที่ `frontend/dist` แล้ว copy ไปไว้ที่ `backend/app/static` โดยอัตโนมัติ (ผ่าน `postbuild` script) เพื่อให้ FastAPI backend เสิร์ฟไฟล์ต่อได้ทันที

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- App: http://127.0.0.1:8000/
- Docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## Deployment

- **Frontend (GitHub Pages)**: build จะถูก deploy ไปที่ branch `gh-pages` และเผยแพร่ที่ https://sr120899.github.io/WebMapApp/
- **Backend (Google Cloud Run)**: ใช้ `backend/Dockerfile` build image แล้ว deploy ผ่าน Cloud Run (ดู `backend/.gcloudignore` สำหรับไฟล์ที่ถูก exclude ตอน source build)

## License

Internal project — ยังไม่ได้กำหนด license
