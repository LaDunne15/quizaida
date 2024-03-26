"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../../../static/styles/log-in.style.scss";

export default function LogIn () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const router = useRouter();

    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };

    const logIn = async () => {
        try {

            if ( !validateEmail(email) ) throw new Error("Invalid email");

            if ( !email || !password ) throw new Error("Login or password is empty");

            const response = await fetch("/api/auth/login",{
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) throw new Error(response.statusText);

            router.push("/");
            
        } catch (err) {
            setMessage(err.message);
        }
    }

    
    return (
        <form action={logIn} className="log-in">
            <h1 className="title">Log In to Quizaida</h1>
            <div className="input">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
            <div className="input">
                <label htmlFor="password">Password</label>
                <input type="password" autoComplete="on" onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <p>{ message }</p>
            <input type="submit" value="Log In"/>
            <ul>
                <li><Link href="/auth/signup">Haven`t account?</Link></li>
                <li><Link href="/auth/forgotPassword">Forgot password?</Link></li>
            </ul>
        </form>
    )
}