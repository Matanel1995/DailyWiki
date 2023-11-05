import Link from "next/link"

export default function Navbar(){
    return(
        <header className="bg-gray-600 h-fit">
            <nav className="flex justify-between items-center">
                <div className="p-4">
                    <h2>DailyWiki</h2>
                </div>
                <div className="p-4 flex justify-end items-center gap-4">
                    <Link className="rounded-full py-2 px-4 bg-gray-100 hover:bg-green-500" href= '/signin'>Login</Link>
                    <Link className="rounded-full py-2 px-4 bg-gray-200 hover:bg-green-500" href= '/signup'>Sign up</Link>
                    <Link className="rounded-full py-2 px-4 bg-gray-200 hover:bg-green-500" href= 'http://localhost:4000/logout'>Log out</Link>
                </div>
            </nav>
        </header>
    )
}