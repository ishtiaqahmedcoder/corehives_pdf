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
      </Routes>
    </Layout>
  )
}

export default App
