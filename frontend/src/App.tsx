import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
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
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { TermsAndConditions } from '@/pages/TermsAndConditions'
import { CookiePolicy } from '@/pages/CookiePolicy'
import { About } from '@/pages/About'
import { Contact } from '@/pages/Contact'
import { Blog } from '@/pages/Blog'

function App() {
  return (
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
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Layout>
  )
}

export default App
