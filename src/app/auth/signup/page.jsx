"use client";
import { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';
export default function SignUp() {

    const [email, setEmail] = useState();
    const [message, setMessage] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isInputData, setIsInputData] = useState(false);
    const [isVerifiedCode, setIsVerifiedCode] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastName] = useState("");
    const [testCode, setTestCode] = useState("");
    const [testCode2, setTestCode2] = useState("");

    const [message2, setMessage2] = useState("");
    const [message3, setMessage3] = useState("");

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    function generateSixDigitCode() {
        var code = Math.floor(Math.random() * 900000) + 100000;
        return code;
    }


    const signUp = async () => {
        
        await fetch(`/api/auth/signup?email=${email}`,{
            method: "GET"
        }).then(i=>{
            if(i.ok) {
                setIsValidEmail(true);
                setMessage(`${i.statusText}`);
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        });
    }

    const sendCode = async () => {
        const code = generateSixDigitCode();
        setTestCode(code);

        var templateParams = {
            to: email,
            name: `${firstname} ${lastname}`,
            code
        };
          
        await emailjs.init({publicKey: "PFqKWVGooprH7zAPm"});
        await emailjs.send("service_vg7m5um","template_f18t9xb", templateParams).then(
            (response) => {
              console.log('SUCCESS!', response.status, response.text);
            },
            (error) => {
              console.log('FAILED...', error);
            },
        );
        setIsInputData(true);
    }

    const checkCode = async () => {
        setMessage2("");
        if(testCode == testCode2) {
            setIsVerifiedCode(true);
        } else {
            setMessage2("Incorect code");
        }
    }

    const createUser = async () => {
        await fetch('/api/auth/signup',{
            method: "POST",
            body: JSON.stringify({
                email,
                firstname,
                lastname,
                password,
                password2
            })
        }).then(i=>{
            if(i.ok) {
                setMessage3(`${i.statusText}`);
            } else {
                setMessage3(`${i.status} - ${i.statusText}`);
            }
        });
    }

    return (
        <div>
            {   
                !isValidEmail &&
                <form action={signUp}>
                    <label>Input email</label>
                    <p>
                        <input type="text" name="email" id="" onChange={(e)=>{ setEmail(e.target.value)}}/>
                        <input type="submit" value="Check"/>
                    </p>
                    <span>{message}</span>
                </form>
            }
            {
                isValidEmail && !isInputData &&
                <form action={sendCode}>
                    <p>Email: {email}</p>
                    <span>Input your data</span>
                    <p>
                        <label>firstname</label>
                        <input type="text" name="firstname" onChange={(e)=>{setFirstname(e.target.value)}}/>
                    </p>
                    <p>
                        <label>lastname</label>
                        <input type="text" name="lastname" onChange={(e)=>{setLastName(e.target.value)}}/>
                    </p>
                    <input type="submit" value="Next"/>
                </form>
            }
            {
                isInputData && !isVerifiedCode &&
                <form action={checkCode}>
                    <p>Email: {email}</p>
                    <p>Firstname: {firstname}</p>
                    <p>Lastname: {lastname}</p>
                    <span>We are sending 6-digit code in email</span>
                    <input type="number" onChange={(e)=>{setTestCode2(e.target.value)}}/>
                    { message2.length>0 && <p>Incorect code</p> }
                    <input type="button" value="Regenerate Code" onClick={sendCode}/>
                    <input type="submit" value="Check"/>
                </form>
            }
            {
                isVerifiedCode &&
                <form action={createUser}>
                    <p>Email: {email}</p>
                    <p>Firstname: {firstname}</p>
                    <p>Lastname: {lastname}</p>
                    <p>Create password</p>
                    <input type="password" autoComplete="on" onChange={(e)=>{setPassword(e.target.value)}}/>
                    <p>Confirm password</p>
                    <p>{ message3 }</p>
                    <input type="password" autoComplete="on" onChange={(e)=>{setPassword2(e.target.value)}}/>
                    <input type="submit" value="Create Account" />
                </form>
            }
        </div>
    )
}