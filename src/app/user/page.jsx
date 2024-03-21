"use client";
import { useEffect, useState } from "react"

export default () => {

    const [user,setUser] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(()=>{

        fetch("/api/auth/login",{
            method: "GET"
        }).then(i=>{
            if(i.ok) {
                return i.json();
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        }).then(result=>{
            setUser(result.user);
        });

    },[]);

    return (
        <div>
            Cabinet
            <pre>
            {
                JSON.stringify(user,null,2)
            }
            </pre>
            {
                message
            }
        </div>
    )
}