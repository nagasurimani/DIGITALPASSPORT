import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

export default function PublicLayout() {
  return (
    <div className="app-frame">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
