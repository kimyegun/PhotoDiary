import React, {useState} from 'react'
import { useSearch } from '../context/SearchProvider'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const SearchForm = () => {

  const [query, setQuery] = useState();
  const {searchResult, handleSearch, resetSearch} = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!query.trim()) return; //아무것도 입력되지 않으면 그냥 return
    handleSearch(query);
  }

  const handleReset = () => {
    resetSearch();
    setQuery('');
  }

  return (
    <form className='relative' onSubmit={handleSubmit}>
        <input placeholder='search'
               className='border border-gray-500 outline-none rounded focus:ring-1 ring-blue-500 w-56 px-1 pt-1'
               value={query||''}
               onChange={({target})=>setQuery(target.value)} />
        {
          searchResult.length ? (
            <button 
              onClick={handleReset} 
              className='absolute top-1/2 -translate-y-1/2 right-1 text-gray-700 '>
                <AiOutlineCloseCircle />
            </button>
          ) : null
        }
    </form>
  )
}

export default SearchForm