# PDFHives — Technical Plan

Stack: **Laravel 11 (API backend)** + **React (Vite + TypeScript SPA)**. Fully free/open-source infra, no paid third-party APIs. Monetization: Google AdSense (organic traffic driven).

---

## 1. Architecture Overview

```
┌────────────────────┐        REST + WebSocket        ┌─────────────────────────┐
│  React SPA (Vite)  │ ◄─────────────────────────────► │  Laravel API (Sanctum)  │
│  Tailwind + Framer  │        (Laravel Echo/Reverb)     │  Queue Workers (Redis)  │
│  Motion + shadcn/ui │                                  │  CLI tools (GS/LO/etc.) │
└────────────────────┘                                  └───────────┬─────────────┘
                                                                     │
                                                          ┌──────────▼───────────┐
                                                          │ MySQL + Redis + Disk │
                                                          └───────────────────────┘
```

- **Frontend**: React SPA, talks to Laravel only via JSON API + WebSocket (no Blade/Inertia) — gives full control for a premium, animation-heavy UI.
- **Backend**: Laravel is API-only. Handles upload, job dispatch, queue processing, file lifecycle, cleanup.
- **Realtime**: Laravel Reverb (free, self-hosted, Pusher-protocol compatible) pushes live job progress to the SPA — no polling, no paid Pusher plan.
- **Processing**: Laravel queue workers shell out to free CLI tools (Ghostscript, LibreOffice headless, qpdf, Tesseract, ImageMagick) via `Symfony\Process`.
- **Storage**: local disk (`storage/app/uploads`, `storage/app/processed`), auto-expired by a scheduled cleanup command. Can swap to Cloudflare R2 (free tier) later without app changes (Laravel filesystem abstraction).

---

## 2. Folder Structure

```
corehives-pdf/
├── backend/                              # Laravel app
│   ├── app/
│   │   ├── Console/Commands/
│   │   │   └── CleanupExpiredFiles.php   # scheduled, deletes expired files+rows
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── UploadController.php
│   │   │   │   ├── MergeController.php
│   │   │   │   ├── SplitController.php
│   │   │   │   ├── CompressController.php
│   │   │   │   ├── ConvertController.php   # PDF<->Word/Excel/PPT, JPG<->PDF
│   │   │   │   ├── WatermarkController.php
│   │   │   │   ├── OcrController.php
│   │   │   │   ├── ProtectController.php   # password add/remove
│   │   │   │   ├── SignController.php
│   │   │   │   ├── OrganizeController.php  # reorder/delete/rotate pages
│   │   │   │   └── JobStatusController.php
│   │   │   ├── Middleware/
│   │   │   │   └── RateLimitGuestUploads.php
│   │   │   └── Requests/Tools/...
│   │   ├── Jobs/
│   │   │   ├── ProcessPdfJob.php          # abstract base (updates status/progress)
│   │   │   ├── MergePdfJob.php
│   │   │   ├── SplitPdfJob.php
│   │   │   ├── CompressPdfJob.php
│   │   │   ├── ConvertPdfJob.php
│   │   │   ├── OcrPdfJob.php
│   │   │   ├── WatermarkPdfJob.php
│   │   │   └── ProtectPdfJob.php
│   │   ├── Services/Pdf/
│   │   │   ├── GhostscriptService.php     # compress
│   │   │   ├── LibreOfficeService.php     # office <-> pdf conversion
│   │   │   ├── QpdfService.php            # encrypt/decrypt
│   │   │   ├── TesseractService.php       # OCR
│   │   │   ├── PdfLibService.php          # merge/split/rotate/watermark (FPDI/TCPDF)
│   │   │   └── FileLifecycleService.php   # store, sign URL, expire
│   │   ├── Events/JobProgressUpdated.php  # broadcasts to job.{uuid} channel
│   │   └── Models/
│   │       ├── PdfJob.php
│   │       ├── UploadedFile.php
│   │       ├── ToolUsageStat.php
│   │       ├── ApiKey.php                 # future paid API tier
│   │       └── User.php                   # optional accounts
│   ├── database/migrations/
│   ├── routes/
│   │   ├── api.php
│   │   └── channels.php
│   └── config/reverb.php, queue.php, filesystems.php
│
├── frontend/                              # React (Vite + TS)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── tools/
│   │   │       ├── MergePdf.tsx
│   │   │       ├── SplitPdf.tsx
│   │   │       ├── CompressPdf.tsx
│   │   │       ├── ConvertPdf.tsx
│   │   │       └── ... (one page per tool, shared layout)
│   │   ├── components/
│   │   │   ├── ui/                        # shadcn/ui primitives
│   │   │   ├── FileDropzone.tsx
│   │   │   ├── PdfPreview.tsx             # pdf.js thumbnail render
│   │   │   ├── PageReorder.tsx            # dnd-kit drag-reorder for merge/organize
│   │   │   ├── ProgressTracker.tsx        # websocket-driven progress ring
│   │   │   ├── AdSlot.tsx                 # AdSense placement wrapper
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── hooks/
│   │   │   ├── useJobStatus.ts            # Echo subscription
│   │   │   └── useFileUpload.ts           # chunked upload + progress
│   │   ├── lib/{api.ts, echo.ts}
│   │   ├── i18n/{en.json, ur.json, hi.json}
│   │   ├── store/                         # Zustand
│   │   └── App.tsx
│   └── vite.config.ts
│
├── docker-compose.yml                     # mysql, redis, reverb — free local infra
└── README.md
```

---

## 3. Database Schema

```sql
-- users (optional accounts, future "saved history" / API access)
users
  id, name, email, password, api_plan, created_at, updated_at

-- one row per tool invocation
pdf_jobs
  id (uuid, pk)
  user_id (nullable, fk -> users)
  tool_type (enum: merge, split, compress, convert, watermark,
             ocr, protect, unlock, sign, rotate, organize)
  status (enum: pending, processing, completed, failed)
  progress (tinyint, 0-100)
  options (json)              -- tool-specific params (e.g. compression level, rotate deg)
  error_message (text, nullable)
  ip_hash (string)            -- sha256(ip+salt), for abuse rate-limiting, not raw IP
  created_at, started_at, completed_at, expires_at

uploaded_files
  id, pdf_job_id (fk), original_name, stored_path, disk,
  mime_type, size_bytes, is_input (bool), created_at, expires_at

tool_usage_stats            -- aggregated daily, drives SEO/ads placement decisions
  id, tool_type, date, usage_count, avg_processing_ms, total_bytes_processed

api_keys                     -- future paid developer-API tier
  id, user_id (fk), key_hash, rate_limit_per_min, active, created_at

-- Laravel defaults (auto-created)
jobs, failed_jobs, job_batches, cache, sessions, password_reset_tokens
```

Indexes: `pdf_jobs(status, expires_at)` for the cleanup sweep, `pdf_jobs(ip_hash, created_at)` for rate limiting.

---

## 4. Queue Design

- **Driver**: Redis (free, self-hosted) — needed anyway for Reverb broadcasting.
- **Queues split by cost**:
  - `light` — merge, split, rotate, watermark, organize (fast, CPU-cheap) → higher worker concurrency (e.g. 6)
  - `heavy` — compress, convert (LibreOffice), OCR (Tesseract) → limited concurrency (e.g. 2) to protect server CPU
  - `default` — misc/cleanup
- **Workers**: `php artisan queue:work redis --queue=heavy,light,default --tries=3 --timeout=300`
- **Flow per job**:
  1. `UploadController` stores file, creates `pdf_jobs` row (`status=pending`), dispatches e.g. `CompressPdfJob::dispatch($jobId)->onQueue('heavy')`, returns `{ job_id }` immediately (202 Accepted).
  2. Job sets `status=processing`, periodically updates `progress`, fires `JobProgressUpdated` → broadcast on private channel `job.{uuid}`.
  3. React (subscribed via Laravel Echo + Reverb) updates the progress ring live, no polling.
  4. On success: `status=completed`, `output_files` stored, signed short-lived download URL returned via the same broadcast event.
  5. On failure: `status=failed`, `error_message` set, job lands in `failed_jobs` after retries exhausted, UI shows retry button.
- **Rate limiting**: Laravel `RateLimiter` keyed on `ip_hash` (e.g. 20 jobs/hour for anonymous users) — protects the server since there's no signup wall.
- **Cleanup**: Laravel Scheduler (`schedule:run` via system cron, every minute) → `CleanupExpiredFiles` every 15 min → deletes disk files + DB rows where `expires_at < now()`. This is also the "privacy" selling point (files auto-delete in 1 hour).

---

## 5. Premium/Interactive Frontend Notes

- Real **websocket-driven** progress (not fake timers) — Reverb + Echo.
- Animated dropzone states (idle/drag-hover/uploading) via Framer Motion.
- PDF thumbnail previews client-side via `pdf.js` before and after processing.
- Drag-to-reorder pages (`dnd-kit`) for merge/organize tools.
- Dark/light theme, Urdu/Hindi/English via `react-i18next` (real differentiator vs competitors).
- Mobile-first responsive — majority of traffic will be mobile.
- `AdSlot.tsx` component isolates ad placements so layout stays clean and doesn't hurt UX/Core Web Vitals (Google penalizes bad ad UX and slow pages both).

---

## 6. Build Order (MVP first)

1. Laravel API skeleton + Redis + Reverb + MySQL wired up locally (Laragon).
2. Upload + `pdf_jobs` pipeline + cleanup command — prove the async flow end-to-end with **one** tool (Merge).
3. React SPA shell + FileDropzone + ProgressTracker wired to that one tool via Echo.
4. Once the pipeline is proven, add remaining tools as new Controller+Job+Service triplets — the architecture doesn't change, only the pair of (Controller, Job) per tool.
5. i18n + theming + ad slots last, once tools work.
