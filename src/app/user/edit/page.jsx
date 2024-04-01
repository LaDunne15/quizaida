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

        const fetchData = async () => {
            try {
                const response = await fetch("/api/auth/login",{ method: "GET" });
                const data = await response.json();
                if (!response.ok) throw new Error(data.statusText);
                setIsLoading(false);
                setUser(data.user);
            } catch (err) {
                setMessage(err.message);
            }
        }
        fetchData();

    },[]);

    const saveChanges = async () => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "PUT", 
                body: JSON.stringify({
                    user
                })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.statusText);
            router.push("/user");
        } catch (err) {
            setMessage(err.message);
        }
    }

    const changePassword = async () => {
        try {
            const response = await fetch('/api/auth/forgotPassword', {
                method: "PUT",
                body: JSON.stringify({
                    email: user.email,
                    password,
                    password2
                })
            });
            const data = await response.json();

            if(!response.ok) throw new Error(data.statusText);
            router.push("/user");
        } catch (err) {
            setMessage2(err.message);
        }
    }

    const deleteAccount = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: "DELETE",
                body: JSON.stringify({
                    passwordToCorfirm
                })
            });
            const data = await response.json();

            if(!response.ok) throw new Error(data.statusText);

            const cookies = new Cookies();
            cookies.remove('token');
            router.push("/");
        } catch (err) {
            setMessage3(err.message);
        }
    }

    

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div className="cabinet-edit">
            
            <ul className="links">
                <li>
                    <Link href="/user">Back</Link>
                </li>
            </ul>
            <h1 className="title">Change user profile</h1>
            <form action={saveChanges} className="section">
                <div className="data">
                    <p>
                        <label>ID:</label>
                        <label>{user._id}</label>
                    </p>
                    <p>
                        <label>Email:</label>
                        <label>{user.email}</label>
                    </p>
                </div>
                <h1 className="sub-title">Change users data</h1>
                <div className="input-data">
                    <p>
                        <label>Firstname</label>
                        <input type="text" name="firstname" defaultValue={user.firstname} onChange={(e)=>setUser({...user,firstname:e.target.value})} />
                    </p>
                    <p>
                        <label>Lastname</label>
                        <input type="text" name="lastname" defaultValue={user.lastname} onChange={(e)=>setUser({...user,lastname:e.target.value})}/>
                    </p>
                </div>
                <span>{ message }</span>
                <div className="buttons">
                    <input type="submit" value="Save changes"/>
                </div>
            </form>

            <form action={changePassword} className="section">
                <h1 className="sub-title">Change password</h1>
                <div className="input-data">
                    <p>
                        <label>Password</label>
                        <input type="password" autoComplete='on' onChange={(e)=>setPassword(e.target.value)}/>
                    </p>
                    <p>
                        <label>Repeat password</label>
                        <input type="password" autoComplete='on' onChange={(e)=>setPassword2(e.target.value)}/>
                    </p>
                </div>
                <span>{ message2 }</span>
                <div className="buttons">
                    <input type="submit" value="Save password"/>
                </div>
            </form>

            <form action={deleteAccount} className="section">
                <h1 className="sub-title">Delete Account</h1>
                <div className="input-data">
                    <p>
                        <label>Confirm your password:</label>
                        <input type="password" autoComplete='on' onChange={(e)=>setPasswordToCorfirm(e.target.value)} />
                    </p>
                </div>
                <span>{ message3 }</span>
                <div className="buttons">
                    <input type="submit" value="Delete account"/>
                </div>
            </form>

        </div>
    )
}