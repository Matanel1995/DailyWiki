'use client'

import { useRouter } from "next/navigation";

  export default function Home() {

    const router = useRouter()

    const authTest = async (req, res) => {
        const response = await fetch('http://localhost:4000/jwt/test',{credentials:"include"});
        if(response.status === 403){
          router.push('/forbiden');
        }
      }


    authTest();
    return (
      <main className='bg-gray-100'>
        <h1> AUTH ONLY</h1>
      </main>
    )
  }