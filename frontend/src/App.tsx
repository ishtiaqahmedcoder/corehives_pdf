import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DevelopersLanding } from '@/pages/developers/DevelopersLanding'
import { DeveloperRegister } from '@/pages/developers/Register'
import { DeveloperLogin } from '@/pages/developers/Login'
import { DeveloperDashboard } from '@/pages/developers/Dashboard'
import { DeveloperDocs } from '@/pages/developers/Docs'
import { Home } from '@/pages/Home'
import { Images } from '@/pages/Images'
import { CompressImage } from '@/pages/images/CompressImage'
import { ResizeImage } from '@/pages/images/ResizeImage'
import { RotateImage } from '@/pages/images/RotateImage'
import { ConvertToJpg } from '@/pages/images/ConvertToJpg'
import { CropImage } from '@/pages/images/CropImage'
import { ConvertFromJpg } from '@/pages/images/ConvertFromJpg'
import { WatermarkImage } from '@/pages/images/WatermarkImage'
import { MemeGenerator } from '@/pages/images/MemeGenerator'
import { PhotoEditor } from '@/pages/images/PhotoEditor'
import { HtmlToImage } from '@/pages/images/HtmlToImage'
import { MergePdf } from '@/pages/tools/MergePdf'
import { SplitPdf } from '@/pages/tools/SplitPdf'
import { RemovePages } from '@/pages/tools/RemovePages'
import { ExtractPages } from '@/pages/tools/ExtractPages'
import { Watermark } from '@/pages/tools/Watermark'
import { PageNumbers } from '@/pages/tools/PageNumbers'
import { JpgToPdf } from '@/pages/tools/JpgToPdf'
import { CompressPdf } from '@/pages/tools/CompressPdf'
import { RotatePdf } from '@/pages/tools/RotatePdf'
import { ProtectPdf } from '@/pages/tools/ProtectPdf'
import { UnlockPdf } from '@/pages/tools/UnlockPdf'
import { WordToPdf } from '@/pages/tools/WordToPdf'
import { PptToPdf } from '@/pages/tools/PptToPdf'
import { ExcelToPdf } from '@/pages/tools/ExcelToPdf'
import { OcrPdf } from '@/pages/tools/OcrPdf'
import { CropPdf } from '@/pages/tools/CropPdf'
import { SignPdf } from '@/pages/tools/SignPdf'
import { PdfToWord } from '@/pages/tools/PdfToWord'
import { PdfToPpt } from '@/pages/tools/PdfToPpt'
import { PdfToExcel } from '@/pages/tools/PdfToExcel'
import { BatchProcessing } from '@/pages/tools/BatchProcessing'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { TermsAndConditions } from '@/pages/TermsAndConditions'
import { CookiePolicy } from '@/pages/CookiePolicy'
import { About } from '@/pages/About'
import { Contact } from '@/pages/Contact'
import { Blog } from '@/pages/Blog'

const OrganizePdf = lazy(() => import('@/pages/tools/OrganizePdf').then((m) => ({ default: m.OrganizePdf })))
const EditPdf = lazy(() => import('@/pages/tools/EditPdf').then((m) => ({ default: m.EditPdf })))

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<MergePdf />} />
        <Route path="/split" element={<SplitPdf />} />
        <Route path="/remove-pages" element={<RemovePages />} />
        <Route path="/extract-pages" element={<ExtractPages />} />
        <Route path="/watermark" element={<Watermark />} />
        <Route path="/page-numbers" element={<PageNumbers />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/compress" element={<CompressPdf />} />
        <Route path="/rotate" element={<RotatePdf />} />
        <Route path="/protect" element={<ProtectPdf />} />
        <Route path="/unlock" element={<UnlockPdf />} />
        <Route path="/word-to-pdf" element={<WordToPdf />} />
        <Route path="/ppt-to-pdf" element={<PptToPdf />} />
        <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
        <Route path="/ocr" element={<OcrPdf />} />
        <Route path="/crop" element={<CropPdf />} />
        <Route path="/sign" element={<SignPdf />} />
        <Route path="/pdf-to-word" element={<PdfToWord />} />
        <Route path="/pdf-to-ppt" element={<PdfToPpt />} />
        <Route path="/pdf-to-excel" element={<PdfToExcel />} />
        <Route path="/batch" element={<BatchProcessing />} />
        <Route path="/images" element={<Images />} />
        <Route path="/images/compress" element={<CompressImage />} />
        <Route path="/images/resize" element={<ResizeImage />} />
        <Route path="/images/rotate" element={<RotateImage />} />
        <Route path="/images/convert-to-jpg" element={<ConvertToJpg />} />
        <Route path="/images/crop" element={<CropImage />} />
        <Route path="/images/convert-from-jpg" element={<ConvertFromJpg />} />
        <Route path="/images/watermark" element={<WatermarkImage />} />
        <Route path="/images/meme" element={<MemeGenerator />} />
        <Route path="/images/editor" element={<PhotoEditor />} />
        <Route path="/images/html-to-image" element={<HtmlToImage />} />
        <Route
          path="/organize"
          element={
            <Suspense fallback={<div className="py-20 text-center opacity-60">Loading…</div>}>
              <OrganizePdf />
            </Suspense>
          }
        />
        <Route
          path="/edit"
          element={
            <Suspense fallback={<div className="py-20 text-center opacity-60">Loading…</div>}>
              <EditPdf />
            </Suspense>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/developers" element={<DevelopersLanding />} />
        <Route path="/developers/register" element={<DeveloperRegister />} />
        <Route path="/developers/login" element={<DeveloperLogin />} />
        <Route path="/developers/docs" element={<DeveloperDocs />} />
        <Route
          path="/developers/dashboard"
          element={
            <ProtectedRoute>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
