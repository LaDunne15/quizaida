"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react"

export default () => {

    const [user,setUser] = useState({
        _id:"",
        email:"",
        firstname:"",
        lastname:""
    });

    const [message, setMessage] = useState("");
    const [message2, setMessage2] = useState("");
    const [message3, setMessage3] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [passwordToCorfirm, setPasswordToCorfirm] = useState(false);

    const router = useRouter();

    useEffect(()=>{

        fetch("/api/auth/login",{
            method: "GET"
        }).then(i=>{
            if(i.ok) {
                setIsLoading(false);
                return i.json();
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        }).then(result=>{
            setUser(result.user);
        });

    },[]);

    const saveChanges = async (e) => {
        await fetch("/api/auth/login", {
            method: "PUT", 
            body: JSON.stringify({
                user
            })
        }).then(i => {
            if (i.ok) {
                router.push("/user");
                return i.json();
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        })
    }

    const changePassword = async () => {
        await fetch('/api/auth/forgotPassword', {
            method: "PUT",
            body: JSON.stringify({
                email: user.email,
                password,
                password2
            })
        }).then(i => {
            if (i.ok) {
                router.push("/user");
                return i.json();
            } else {
                setMessage2(`${i.status} - ${i.statusText}`);
            }
        })
    }

    const deleteAccount = async () => {
        await fetch('/api/auth/login', {
            method: "DELETE",
            body: JSON.stringify({
                passwordToCorfirm
            })
        }).then(i => {
            if (i.ok) {
                const cookies = new Cookies();
                cookies.remove('token');
                router.push("/");
                return i.json();
            } else {
                setMessage3(`${i.status} - ${i.statusText}`);
            }
        })
    }

    

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <p>My cabinet</p>
            <p>ID: {user._id}</p>
            <p>Email: {user.email}</p>

            <form action={saveChanges}>
                <div>
                    <p>Firstname</p>
                    <input type="text" name="firstname" defaultValue={user.firstname} onChange={(e)=>setUser({...user,firstname:e.target.value})} />
                </div>
                <div>
                    <p>Lastname</p>
                    <input type="text" name="lastname" defaultValue={user.lastname} onChange={(e)=>setUser({...user,lastname:e.target.value})}/>
                </div>
                {
                    message
                }
                <button type="submit">Save</button>
            </form>

            <form action={changePassword}>
                <span>Change password</span>
                <div>
                    <p>Password</p>
                    <input type="password" autoComplete='on' onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <div>
                    <p>Repeat password</p>
                    <input type="password" autoComplete='on' onChange={(e)=>setPassword2(e.target.value)}/>
                </div>
                {
                    message2
                }
                <button type="submit">Change password</button>
            </form>

            <form action={deleteAccount}>
                <span>Delete account</span>
                <div>
                    <span>Input password to delete account:</span>
                    <input type="password" autoComplete='on' onChange={(e)=>setPasswordToCorfirm(e.target.value)} />
                </div>
                {
                    message3
                }
                <button type="submit">Delete</button>
            </form>

        </div>
    )
}