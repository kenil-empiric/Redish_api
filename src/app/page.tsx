"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setinput] = useState("");
  const [SearchResult, setSearchResult] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    const fetchdata = async () => {
      console.log("hello", input);

      if (!input) return setSearchResult(undefined);

      const res = await fetch(`https://fastapi.empiric.workers.dev/api/search?q=${input}`);

      const data = (await res.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResult(data);
    };
    fetchdata();
  }, [input]);

  return (
    <main className="h-screen w-screen">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl tracking-tighter"> Speedsearch </h1>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          A high-performance API built with Hono, Next.js and Cloudflare. <br />{" "}
          Type a query below and get your results in miliseconds.
        </p>
        <div className="max-w-md w-full">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              value={input}
              onValueChange={setinput}
              placeholder="Search countries...."
              className="placeholder:text-zinc-500"
            />
            <CommandList>
              {SearchResult?.results?.length === 0 ? (
                <CommandEmpty> No results found.</CommandEmpty>
              ) : null}

              {SearchResult?.results ? (
                <CommandGroup heading="Results">
                  {SearchResult?.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setinput}
                    > 
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {SearchResult?.results ? (
                <>
                  <div className="h-px w-full bg-zinc-200" />

                  <p className="p-2 text-xs text-zinc-500">
                    Found {SearchResult.results.length} results in{" "}
                    {SearchResult?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>

        <input
          className="border-4"
          type="text"
          value={input}
          onChange={(e) => {
            setinput(e.target.value);
          }}
        />
      </div>
    </main>
  );
}
