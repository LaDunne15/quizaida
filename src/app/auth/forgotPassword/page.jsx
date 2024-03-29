"use client";
import emailjs from '@emailjs/browser';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generationService } from "../../../libs/generationService";
import Link from 'next/link';


export default () => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const [userFound, setUserFound] = useState(false);
    const [sendedCode, setSendedCode] = useState(false);
    const [isVerifiedCode, setIsVerifiedCode] = useState(false);
    
    const [testCode, setTestCode] = useState("");
    const [testCode2, setTestCode2] = useState("");
    
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    
    const router = useRouter();

    const checkEmail = async () => {
        try {

            const response = await fetch(`/api/auth/forgotPassword?email=${email}`, { method: "GET" });
            const data = await response.json();

            if(!response.ok) throw new Error(data.statusText);

            setUserFound(true);
            setMessage("");
            sendCode();

        } catch (err) {
            setMessage(err.message);
        }
    }

    const sendCode = async () => {

        try {

            const code = generationService.generateSixDigitCode();
            setTestCode(code);

            var templateParams = {
                to: email,
                name: `Qwerty`,
                code
            };
          
            await emailjs.init({publicKey: "PFqKWVGooprH7zAPm"});
            await emailjs.send("service_vg7m5um","template_f18t9xb", templateParams).then(
                (response) => { setSendedCode(true); },
                (error) => { throw new Error(error); }
            );
            setMessage("");

        } catch (err) {
            setMessage(err.message);
        }
    }

    const checkCode = async () => {
        const correctCode = testCode == testCode2;
        setMessage(correctCode ? "" : "Incorect code");
        setIsVerifiedCode(correctCode);
    }

    const changePassword = async () => {

        try {

            const response = await fetch('/api/auth/forgotPassword', {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    password2
                })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.statusText);

            setMessage("");
            router.push("/");

        } catch (err) {
            setMessage(err.message);
        }

    }

    return (
        <div className='forgot-password'>
            <h1 className="title">Renewing Password</h1>
            {
                !userFound &&
                <form action={checkEmail} className='section'>
                    <div className="input-data">
                        <p>
                            <label>Enter your email</label>
                            <input type="text" name="email" onChange={(e)=>setEmail(e.target.value)} required/>
                        </p>
                    </div>
                    <span>{ message }</span>
                    <div className="buttons">
                        <input type="submit" value="Submit"/>
                    </div>
                </form>
            }
            {
                userFound && !isVerifiedCode && 
                <form  action={checkCode} className='section'>
                    <div className='data'>
                        <p>
                            <label>Email:</label>
                            <label>{email}</label>
                        </p>
                    </div>
                    <div className='input-data'>
                        <p>
                            <label>Enter your code</label>
                            <input type="text" name="code" onChange={(e)=>setTestCode2(e.target.value)}/>
                        </p>
                    </div>
                    <span>{ message }</span>
                    <div className="buttons">
                        <input type="submit" value="Submit"/>
                    </div>
                </form>
            }
            {
                isVerifiedCode && 
                <form action={changePassword} className="section">
                    <div className='data'>
                        <p>
                            <label>Email:</label>
                            <label>{email}</label>
                        </p>
                    </div>
                    <div className='input-data'>
                        <p>
                            <label>New Password</label>
                            <input type="password" autoComplete='on' onChange={(e)=>setPassword(e.target.value)}/>
                        </p>
                        <p>
                            <label>Confirm Password</label>
                            <input type="password" autoComplete='on' onChange={(e)=>setPassword2(e.target.value)}/>
                        </p>
                    </div>
                    <span>{ message }</span>
                    <div className="buttons">
                        <input type="submit" value="Submit"/>
                    </div>
                </form>
            }
            <ul className="links">
                <li><Link href="/auth/login">I remember my password</Link></li>
            </ul>
        </div>
    )
}