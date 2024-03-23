"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "universal-cookie";

export default function LogIn () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const router = useRouter();

    const logIn = async () => {
        await fetch("/api/auth/login",{
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        }).then(i=>{
            if(i.ok) {
                router.push("/");
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        })

    }
    
    return (
        <form action={logIn}>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" onChange={(e)=>setEmail(e.target.value)}/>
            <label htmlFor="password">Password</label>
            <input type="password" autoComplete="on" onChange={(e)=>setPassword(e.target.value)}/>
            <input type="submit" value="Log In"/>
            <p>{message}</p>
            <Link href="/auth/signup">Haven`t account?</Link>
            <Link href="/auth/forgotPassword">Forgot password?</Link>
        </form>
    )
}