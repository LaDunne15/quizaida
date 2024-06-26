"use client";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import { useRouter } from "next/navigation";
import { validationService } from "../../../libs/validationService";
import { generationService } from "../../../libs/generationService";
import Link from "next/link";

export default () => {

    const [email, setEmail] = useState();

    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isInputData, setIsInputData] = useState(false);
    const [isVerifiedCode, setIsVerifiedCode] = useState(false);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastName] = useState("");
    const [testCode, setTestCode] = useState("");
    const [testCode2, setTestCode2] = useState("");

    const [message, setMessage] = useState("");

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    
    const router = useRouter();

    const signUp = async () => {
        try {

            if(!email) throw new Error('Email is required');
            if(!validationService.validateEmail(email)) throw new Error('Invalid email');

            const response = await fetch(`/api/auth/signup?email=${email}`,{ method: "GET" });
            const data = await response.json();

            if (!response.ok) throw new Error(data.statusText);
    
            setIsValidEmail(true);
            setMessage("");

        } catch (err) {
            setMessage(err.message);
        }        
    }

    const sendCode = async () => {
        try {

            if(!firstname) throw new Error('Firstname is required');
            if(!lastname) throw new Error('Lastname is required');

            const code = generationService.generateSixDigitCode();
            setTestCode(code);
    
            var templateParams = {
                to: email,
                name: `${firstname} ${lastname}`,
                code
            };
              
            await emailjs.init({publicKey: "PFqKWVGooprH7zAPm"});
            await emailjs.send("service_vg7m5um","template_f18t9xb", templateParams).then(
                (response) => { setIsInputData(true); },
                (error) => { throw new Error(error); },
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

    const createUser = async () => {
        try {

            const response = await fetch(`/api/auth/signup`,{ 
                method: "POST",
                body: JSON.stringify({
                    email,
                    firstname,
                    lastname,
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
        <div className="sign-up">
            <h1 className="title">Sign Up to Quizaida</h1>
            {   
                !isValidEmail &&
                <form action={signUp} className="section">
                    <div className="input-data">
                        <p>
                            <label>Input email</label>
                            <input type="text" name="email" value={email || ""} onChange={(e)=>{ setEmail(e.target.value)}}/>
                        </p>
                    </div>
                    <span>{ message }</span>
                    <div className="buttons">
                        <input type="submit" value="Check"/>
                    </div>
                </form>
            }
            {
                isValidEmail && !isInputData &&
                <form action={sendCode} className="section">
                    <div className="data">
                        <p>
                            <label>Email:</label>
                            <label>{email}</label>
                        </p>
                    </div>
                    <div className="input-data">
                        <p>
                            <label>Firstname</label>
                            <input type="text" name="firstname" value={firstname || ""} onChange={(e)=>{setFirstname(e.target.value)}} required/>
                        </p>
                        <p>
                            <label>Lastname</label>
                            <input type="text" name="lastname"value={lastname || ""} onChange={(e)=>{setLastName(e.target.value)}} required/>
                        </p>
                    </div>
                    <span>{message}</span>
                    <div className="buttons">
                        <button onClick={()=>{
                            setIsValidEmail(false);
                            setIsInputData(false);
                            setMessage("");
                        }}>Back</button>
                        <input type="submit" value="Next"/>
                    </div>
                </form>
            }
            {
                isInputData && !isVerifiedCode &&
                <form action={checkCode} className="section">
                    <div className="data">
                        <p>
                            <label>Email:</label>
                            <label>{email}</label>
                        </p>
                        <p>
                            <label>Firstname:</label>
                            <label>{firstname}</label>
                        </p>
                        <p>
                            <label>Lastname:</label>
                            <label>{lastname}</label>
                        </p>
                    </div>
                    <div className="input-data">
                        <p>
                            <label>We are sending 6-digit code in your email: {email}</label>
                            <input type="number" onChange={(e)=>{setTestCode2(e.target.value)}}/>
                            <input type="button" value="↻" className="regenerate" onClick={sendCode}/>
                        </p>
                    </div>
                    <span>{message}</span>
                    <div className="buttons">
                        <button onClick={()=>{
                            setIsInputData(false);
                            setIsVerifiedCode(false);
                            setMessage("");
                        }}>Back</button>
                        <input type="submit" value="Check"/>
                    </div>
                </form>
            }
            {
                isVerifiedCode &&
                <form action={createUser} className="section">
                    <div className="data">
                        <p>
                            <label>Email:</label>
                            <label>{email}</label>
                        </p>
                        <p>
                            <label>Firstname:</label>
                            <label>{firstname}</label>
                        </p>
                        <p>
                            <label>Lastname:</label>
                            <label>{lastname}</label>
                        </p>
                    </div>
                    <div className="input-data">
                        <p>
                            <label>Create password</label>
                            <input type="password" autoComplete="on" onChange={(e)=>{setPassword(e.target.value)}} required/>
                        </p>
                        <p>
                            <label>Confirm password</label>
                            <input type="password" autoComplete="on" onChange={(e)=>{setPassword2(e.target.value)}} required/>
                        </p>
                    </div>
                    <span>{message}</span>
                    <div className="buttons">
                        <button onClick={()=>{
                            setIsInputData(true);
                            setIsVerifiedCode(false)
                            setMessage("");
                        }}>Back</button>
                        <input type="submit" value="Create Account" />
                    </div>
                </form>
            }
            <ul className="links">
                <li><Link href="/auth/login">Already have an account?</Link></li>
            </ul>
        </div>
    )
}