import Link from 'next/link';

export default function Home() {
    return (
      <main className='bg-gray-100'>
        <div className="flex items-center justify-center">
            <h1> Not Authorized, Please login into your user and come back</h1>
            <div className=" p-4 m-4">
              <Link href= '/'>Back to HomePage</Link>
            </div>
        </div>
      </main>
    )
  }