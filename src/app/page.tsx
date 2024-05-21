"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setinput] = useState("");
  const [SearchResult, setSearchResult] = useState<{ result: string[]; duration: number }>();

  useEffect(() => {
    const fetchdata= async()=>{
      console.log("hello",input);
      
      if(!input) return setSearchResult(undefined)

      const res= await fetch(`/api/search?q=${input}`)
    }
    fetchdata()
  }, [input])
  
  return (
    <div>
      <input

        className="border-4 border-indigo-500/100"
        type="text"
        value={input}
        onChange={(e) => {
          setinput(e.target.value);
        }}
       
      />
    </div>
  );
}
