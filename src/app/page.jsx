"use client";
import { useAuth } from "./../hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TestMini from "../components/testMini";
import TestList from "../components/test-list";

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [message, setMessage] = useState("");
  const [searchString, setSearchString] = useState("");

  const [searchedResults, setSearchedResults] = useState([]);

  useEffect(()=>{

    const fetchData = async () => {
      try {

        const response = await fetch('/api/test', { method: "GET" });
        const data = await response.json();

        if (!response.ok) throw new Error(data.statusText);

        setIsLoading(false);
        setTests(data.tests2);

      } catch(err) {
        setMessage(err.message);
      }
    }
    fetchData();

  },[]);

  const searching = async () => {
    try {
      const response = await fetch('/api/search?searchString='+searchString, { method: "GET" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.statusText);

      setSearchedResults(data.tests);
    } catch(err) {
      setMessage(err.message); 
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  };

	return (
    	<main>
      		<section className="search">
        		<span> Quizaida </span>
        		<form action={searching}>
          			<input type="search" onChange={(e)=>setSearchString(e.target.value)} placeholder="Search"/>
          			<input type="submit" value="Search"/>
        		</form>
				{
					searchedResults.length>0 && <>
					<h2 className="sub-title">Searched tests</h2>
        			<TestList tests={ searchedResults }/></>
				}
      		</section>
      		{
        		searchedResults.length==0 && <>
          		<section className="most-popular">
            		<h2 className="sub-title">Top 10 most popular</h2>
            		<TestList tests={ tests.sort((a,b) => b.completedTimes - a.completedTimes).slice(0,10) }/>
          		</section>
          		<section className="most-rated">
        			<h2 className="sub-title">Top 10 most rated</h2>
            		<TestList tests={ tests.sort((a,b) => b.totalrating - a.totalrating).slice(0,10) }/>
          		</section></>
      		}
      		{
        	message
      	}
    	</main>
	);
}
