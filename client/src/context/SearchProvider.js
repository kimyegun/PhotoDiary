import React, { createContext,useContext, useState } from 'react'
import { searchPost } from '../api/post';

const SearchContext = createContext();

export default function SearchProvider({children}){

  const [searchResult, setSearchResult] = useState([]);
  const handleSearch = async (query) => {
    const {error, posts} = await searchPost(query);
    if(error) return console.log(error);
    setSearchResult(posts);
  }

  const resetSearch = () => {
    setSearchResult([]);
  }

  return (
    <SearchContext.Provider value={{searchResult, handleSearch, resetSearch}}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext);