import { BrowserRouter, Route, Routes } from 'react-router'
import '../css/reset.css'
import '../css/theme.css'
import '../css/page.css'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Chess1 from '../pages/Chess1'
import Chess2 from '../pages/Chess2'
import Analysis from '../pages/Analysis'
import Online from '../pages/Online'
import Settings from '../pages/Settings'
import Info from '../pages/Info'
import NotFound from '../pages/NotFound'

// add a page: create it in pages, add a <Route> here and an item in Menu.tsx
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chess-1" element={<Chess1 />} />
          <Route path="chess-2" element={<Chess2 />} />
          <Route path="chess-analysis" element={<Analysis />} />
          <Route path="chess-online" element={<Online />} />
          <Route path="settings" element={<Settings />} />
          <Route path="info" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
