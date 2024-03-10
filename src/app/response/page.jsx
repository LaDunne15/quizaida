"use client";

import { set } from "mongoose";
import Link from "next/link";
import { useEffect, useState } from "react"

export default function Response () {

    const [responses, setResponses] = useState([{
        _id: "",
        test: {
            theme: ""
        },
        status: "",
        started: "",
        completed: ""
    }]);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        fetch(`/api/response`,{
            method: "GET"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            console.log(data);
            setResponses(data.response);
        });
    },[]);


    return (
        <div>
            {   
                responses.map((i)=><div key={i._id}>
                    {
                        i.test?<div>
                            <Link href={`response/${i._id}`}>{i.test.theme}</Link>
                            <span>{i.status} {i.started}</span>
                        </div>:
                        <div>No Data</div>
                    }
                </div>)
            }
            {
                message
            }
        </div>
    )
}