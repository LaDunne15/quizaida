"use client";
import emailjs from '@emailjs/browser';
import { useState } from "react";


export default () => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [message2, setMessage2] = useState("");
    const [message3, setMessage3] = useState("");

    const [userFound, setUserFound] = useState(false);
    const [sendedCode, setSendedCode] = useState(false);
    const [isVerifiedCode, setIsVerifiedCode] = useState(false);
    
    const [testCode, setTestCode] = useState("");
    const [testCode2, setTestCode2] = useState("");
    
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const checkEmail = async () => {
        await fetch(`/api/auth/forgotPassword?email=${email}`, {
            method: "GET"
        }).then(i => {
            if (i.ok) {
                setUserFound(true);
                setMessage("");
                sendCode();
            } else {
                setUserFound(false);
                setMessage("User not found");
            }
        });
    }

    function generateSixDigitCode() {
        var code = Math.floor(Math.random() * 900000) + 100000;
        return code;
    }

    const sendCode = async () => {
        
        const code = generateSixDigitCode();
        setTestCode(code);

        var templateParams = {
            to: email,
            name: `Qwerty`,
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
        setSendedCode(true);
    }

    const checkCode = async () => {
        setMessage2("");
        if(testCode == testCode2) {
            setIsVerifiedCode(true);
            setMessage2("Code is correct");
        } else {
            setMessage2("Incorect code");
        }
    }

    const changePassword = async () => {
        await fetch('/api/auth/forgotPassword',{
            method: "POST",
            body: JSON.stringify({
                email,
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
            <span>Renewing Password</span>
            {
                !userFound && <form action={checkEmail}>
                    <span>Enter your email</span>
                    <input type="text" name="email" onChange={(e)=>setEmail(e.target.value)}/>
                    {message}
                    <input type="submit" value="Submit"/>
                </form>
            }
            {
                userFound && !isVerifiedCode && <form  action={checkCode}>
                    <h5>Email: {email}</h5>
                    <span>Enter your code</span>
                    <input type="text" name="code" onChange={(e)=>setTestCode2(e.target.value)}/>
                    <input type="submit" value="Submit"/>
                    {
                        message2
                    }
                </form>
            }
            {
                isVerifiedCode && <form action={changePassword}>
                    <h5>Email: {email}</h5>
                    <span>New Password</span>
                    <input type="password" autoComplete='on' onChange={(e)=>setPassword(e.target.value)}/>
                    <span>Confirm Password</span>
                    <input type="password" autoComplete='on' onChange={(e)=>setPassword2(e.target.value)}/>
                    <input type="submit" value="Submit"/>
                    {
                        message3
                    }
                </form>
            }
        </div>
    )
}