"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Tests() {

    const [tests, setTests] = useState();

    useEffect(() => {
        fetch('/api/test',{
            method: "GET"
        }).then(i=>{
            if(i.ok) {
                return i.json();
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        }).then(result=>{
            setTests(result);
        });
    },[]);

    return (
        <div>
            Tests
            <Link href="/test/createTest">Create Test</Link>
            <p>
                {
                    JSON.stringify(tests)
                }
            </p>
        </div>
    )
}