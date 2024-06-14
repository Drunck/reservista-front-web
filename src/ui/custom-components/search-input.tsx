import React, { useEffect, useRef, useState } from "react";
import { CloseIcon, LongRightArrowIcon, SearchIcon } from "./icons";
import { useDebouncedCallback } from "use-debounce";
import { TRestaurant } from "@/lib/types";
import { getSearchSuggestions } from "@/lib/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./button";
import useMediaQuery from "@/lib/hooks/use-media-query";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const uslSearchQuery = useSearchParams().get("search_query")?.toString();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TRestaurant[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery) {
      setSuggestions(undefined);
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await getSearchSuggestions(searchQuery);

    if (response.status === 200) {
      const data = response.suggestions;
      setSuggestions(data);
    } else {
      setError(response.message || "Failed to fetch suggestions");
    }
    setIsLoading(false);
  };

  const handleDebouncedSearch = useDebouncedCallback(fetchSuggestions, 500);

  const handleClear = () => {
    setQuery("");
    setSuggestions(undefined);
  };

  const handleSuggestionClick = (suggestion: string) => {
    inputRef.current?.blur();
    setQuery(suggestion);
    setSuggestions(undefined);
    router.push(`/search?search_query=${encodeURIComponent(suggestion)}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (query) {
      inputRef.current?.blur();
      router.push(`/search?search_query=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    handleDebouncedSearch(query);
  }, [query, handleDebouncedSearch]);

  useEffect(() => {
    if (uslSearchQuery) {
      setQuery(uslSearchQuery);
    }
  }, [uslSearchQuery]);


  return (
    <div className="relative max-w-full w-full flex flex-row">
      {
        (pathname === "/search" && !isDesktop) && (
          <div className="border border-gray-300 rounded-full p-2 hover:cursor-pointer hover:bg-gray-100/50 active:bg-gray-100/50 mr-2" onClick={() => router.back()} >
            <LongRightArrowIcon className="w-5 h-5 stroke-gray-500 rotate-180" />
          </div>
        )
      }
      <form className="relative gap-x-2 w-full" onSubmit={handleSubmit}>
        <label className="w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 stroke-gray-500" />
          </span>
          <input
            ref={inputRef}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={query}
            className="box-border w-full min-w-full py-1.5 px-4 pl-11 transition rounded-md lg:rounded-l-md lg:rounded-none border border-gray-300 focus:outline focus:outline-1 focus:outline-gray-600"
            type="text" placeholder="Search"
          />
          {query && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={handleClear}
            >
              <CloseIcon className="w-5 h-5 stroke-gray-700" />
            </button>
          )}
        </label>

        {
          suggestions && isFocused && suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg z-10 py-4 text-base">
              {suggestions.slice(0, 9).map((suggestion) => (
                <li
                  onMouseDown={() => handleSuggestionClick(suggestion.name)}
                  key={suggestion.id}
                  className="px-4 hover:bg-gray-200/50 cursor-pointer flex flex-row jus items-center leading-loose" >
                  <SearchIcon className="w-4 h-4 stroke-gray-600 mr-4" />
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )
        }

      </form>

      {isDesktop && <Button className="rounded-l-none border-black" onClick={handleSubmit}>Search</Button>}
    </div>
  )
}
