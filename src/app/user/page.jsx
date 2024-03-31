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
            <div className="data">
                <ul>
                    <li>
                        <label>ID:</label>
                        <span>{user._id}</span>
                    </li>
                    <li>
                        <label>Name:</label>
                        <span>{user.firstname} {user.lastname}</span>
                    </li>
                    <li>
                        <label>Email:</label>
                        <Link href={`mailto:${user.email}`}><span>{user.email}</span></Link>
                    </li>
                </ul>
                <Link href="/user/edit" className="edit-link">Change data</Link>
            </div>
            <span>{ message }</span>
            
            <input type="button" onClick={Logout} value="Log Out"/>
        </div>
    )
}