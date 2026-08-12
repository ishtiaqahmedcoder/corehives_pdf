import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { MergePdf } from '@/pages/tools/MergePdf'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<MergePdf />} />
      </Routes>
    </Layout>
  )
}

export default App
