"use client";
import Link from "next/link";
import { useAuth } from "./../hooks/useAuth";
import { redirect } from "next/navigation";
import Cookies from "universal-cookie";

export default function NavBar() {

    const auth = useAuth();

    const Logout = () => {
        
        const cookies = new Cookies();
        cookies.remove('token');

        redirect("/");
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