"use client";
import Link from "next/link";
import { useAuth } from "./../hooks/useAuth";
import { redirect, useRouter } from "next/navigation";
import Cookies from "universal-cookie";

export default function NavBar() {

    const auth = useAuth();
    const router = useRouter();

    const Logout = () => {
        
        const cookies = new Cookies();
        cookies.remove('token');

        router.push("/");
    }

    return (
        <ul>
            <li>
                <Link href="/">Main</Link>
            </li>
            {
                auth &&
                <>
                    <li>
                        <Link href="/test">Tests</Link>
                    </li>
                    <li>
                        <Link href="/response">Response</Link>
                    </li>
                    <li>
                        <button onClick={Logout}>Log Out</button>
                    </li>
                </>
                /*
                { 
                    false &&
                    <>
                        <li>
                            <Link href="/auth/signup">Sign Up</Link>
                        </li>
                        <li>
                            <Link href="/auth/login">Log In</Link>
                        </li>
                    </>
                }*/
            }
        </ul>
    )
}