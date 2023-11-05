import Navbar from './componnents/Navbar'
import Link from 'next/link';


export default function Home() {
  return (
    <main className='bg-gray-100'>
      <Navbar/>
      <Link href='/authOnly'>Test auth</Link>
    </main>
  )
}
