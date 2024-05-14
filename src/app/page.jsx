"use client";
import { useEffect, useState } from "react";
import TestList from "../components/test-list";

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [top10Completed, setTop10Completed] = useState([]);
  const [top10Rated, setTop10Rated] = useState([]);
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

        setTop10Completed(data.top10Completed);
        setTop10Rated(data.top10Rated);

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
            		<TestList tests={ top10Completed }/>
          		</section>
          		<section className="most-rated">
        			<h2 className="sub-title">Top 10 most rated</h2>
            		<TestList tests={ top10Rated}/>
          		</section></>
      		}
      		{
        	message
      	}
    	</main>
	);
}
