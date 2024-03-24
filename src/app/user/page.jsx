"use client";
import Link from "next/link";
import { useEffect, useState } from "react"

export default () => {

    const [user,setUser] = useState({
        _id:"",
        email:"",
        firstname:"",
        lastname:""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <p>My cabinet</p>
            <p>ID: {user._id}</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.firstname} {user.lastname}</p>
            <Link href="/user/edit">Edit</Link>
            {
                message
            }
        </div>
    )
}