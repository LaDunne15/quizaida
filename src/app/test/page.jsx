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

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/test/getUsersTest', {
                    method: "GET"
                });
                const data = await response.json();
                if(!response.ok) throw new Error(data.statusText);
                setIsLoading(false);
                setTests(data.tests);
            } catch (err) {
                setMessage(err.message);
            }
        }

        fetchData();
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