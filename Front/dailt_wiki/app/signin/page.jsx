'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


//import icons
import visibility from '../../public/visibility.svg';
import google from '../../public/google.svg';
import linkedIn from '../../public/linkedIn.svg';
import apple from '../../public/apple.svg';


export default function Home(){

    const router = useRouter()

    let error = {email: '', password:'', name:''};

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(error);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const test = {email,password};
        //call backend function to login user
        const res = await fetch('http://localhost:4000/signin',{
            method: "POST",
            headers: {'Content-Type':"application/json"},
            body: JSON.stringify(test),

        });
        if(res.status === 200){
            setIsLoading(true);
            //redirect to main page
            router.push('/');
        }
        else{
            //get the errors from the server
            error = await res.json();
            setErrors(error);
        }
    }

    function navigate(url){
        window.location.href = url
    }

    const googleAuth = async () => {
        console.log('got here');
        const response = await fetch('http://localhost:4000/oauth',{method:'POST'});
        const data =await response.json();
        navigate(data.url);
    }

    return(
        <section className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
                
                
                {/* Login Section */}
                <div className="sm:w-1/2 px-8">
                    <h2 className='font-bold text-2xl text-[#002D74] uppercase pt-4'>Login</h2>
                    <p className='text-sm text-gray-400 pt-3'>Already have an acount? login to use all site pichefkes</p>
                    
                    
                    {/* form */}
                    <form action='' className='flex flex-col gap-4'>
                        <input className='p-2 mt-8 rounded-xl border' 
                            type='String' 
                            name='email' 
                            placeholder='Email'
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                            />
                        <p className='text-red-700 text-xs -mt-3 pl-1'>{errors.email}</p>
                        <div className='relative'>
                            <input className='p-2 rounded-xl border w-full'
                                type={!showPass ? 'password' : 'String'} 
                                name='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}}
                                />
                            <Image className='absolute right-3 top-1/2 -translate-y-1/2 hover:cursor-pointer' src={visibility} alt='' onClick={()=>{setShowPass(!showPass)}}></Image>
                        </div>
                        <p className='text-red-700 text-xs pl-1 -mt-2'>{errors.password}</p>
                        <button onClick={handleLoginSubmit} 
                            className='bg-[#002D74] text-white rounded-xl py-2 hover:scale-105'
                            disabled = {isLoading}
                            >
                            {isLoading ? <span>Login in...</span> : <span>Login</span>}
                            </button>
                        <div className='flex flex-col-2 p-2'>
                            <p className='text-xs text-gray-500 pr-1'>Forgot you password?</p>
                            <Link className='text-blue-600 text-xs' href=''>click here</Link>
                        </div>
                    </form>


                    {/* devidor */}
                    <div className='mt-10 grid grid-cols-3 items-center text-gray-500'>
                        <hr className='border-gray-500'></hr>
                        <p className='text-center text-sm'>Or</p>
                        <hr className='border-gray-500'></hr>
                    </div>


                    {/* google and linkedin */}
                    <div className='flex items-center justify-around pt-4'>
                        <Image className='bg-white border p-2 aspect-square w-12 hover:scale-105' onClick={googleAuth} src={google} alt=''></Image>
                        <Image className='bg-white border p-2 aspect-square w-12 hover:scale-105' onClick='' src={apple} alt=''></Image>
                        <Image className='bg-white border p-2 aspect-square w-12 hover:scale-105' onClick='' src={linkedIn} alt=''></Image>
                    </div>


                    {/* Dont have account section */}
                    <div className='pt-6 flex flex-col-2'>
                        <p className=' text-gray-500 text-sm'>Dont have an account?</p>
                        <Link className='text-blue-500 text-sm pl-2' href='/signup'>Sign up here.</Link>
                    </div>
                </div>

                {/* Image Section */}
                <div className="w-1/2 sm:block hidden">
                    <img className='rounded-2xl ' src='/picture.png' alt=""></img>
                </div>
            </div>
        </section>
            
    )
}