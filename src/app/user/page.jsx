"use client";
import Link from "next/link";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default () => {

    const [user,setUser] = useState({
        _id:"",
        email:"",
        firstname:"",
        lastname:""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    
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

    const Logout = () => {
        
        const cookies = new Cookies();
        cookies.set('token', "");
        router.push("/");

    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div className="cabinet">
            <h1 className="title">My cabinet</h1>
            <div className="section">
                <div className="data">
                    <p>
                        <label>ID:</label>
                        <label>{user._id}</label>
                    </p>
                    <p>
                        <label>Name:</label>
                        <label>{user.firstname} {user.lastname}</label>
                    </p>
                    <p>
                        <label>Email:</label>
                        <Link href={`mailto:${user.email}`}><span>{user.email}</span></Link>
                    </p>
                </div>
                <span>{ message }</span>
                <ul className="links">
                    <li>
                        <Link href="/user/edit">Change data</Link>
                    </li>
                    <li>
                        <Link href="/" onClick={Logout}>Log Out</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}