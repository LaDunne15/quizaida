"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TestList from "../../components/test-list"

export default function Tests() {

    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const createTest = () => router.push("test/createTest");

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

    if(isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="my-tests">
            <h1 className="title">My Tests</h1>
            <input type="button" value="Create Test" className="create-btn" onClick={createTest}/>
            <TestList tests={tests}/>
            <span>{ message }</span>
        </div>
    )
}