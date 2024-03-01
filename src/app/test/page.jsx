"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import TestMini from "../../components/testMini";

export default function Tests() {

    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/test/getUsersTest',{
            method: "GET"
        }).then(i=>{
            if(i.ok) {
                return i.json();
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        }).then(result=>{
            setIsLoading(false);
            setTests(result.tests);
        });
    },[]);

    return (
        <div>
            <p>My tests</p>
            <Link href="/test/createTest">Create Test</Link>
                { 
                    isLoading?<p>Loading...</p>:<></>
                }
                {
                    !isLoading && tests.map((i,index)=>
                        <TestMini key={index} data={i}/>
                    )
                }
        </div>
    )
}