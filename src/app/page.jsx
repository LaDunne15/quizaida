"use client";
import { useAuth } from "./../hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TestMini from "../components/testMini";

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(()=>{
    setIsLoading(true);
        fetch('/api/test',{
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
    <main>
      <h1>Main</h1>
      { 
        isLoading?<p>Loading...</p>:<></>
      }
      {
        !isLoading && tests.map((i,index)=>
          <TestMini key={index} data={i}/>
        )
      }
      {
        message
      }
    </main>
  );
}
