import React, { useEffect, useState } from 'react'
import { getPosts, deletePost } from '../api/post'
import PostCard from './PostCard'
import { useSearch } from '../context/SearchProvider'


let pageNo = 0;
const POST_LIMIT = 9;

const Home = () => {
  const {searchResult} = useSearch();
  const [posts, setPosts] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState([]);

  const getPagenationCount = (length) => {
    const devision = length / POST_LIMIT;
    if(devision % 1 !== 0){
      return Math.floor(devision) + 1;
    }
    return devision;
  }
  const paginationCount = getPagenationCount(totalPostCount);
  const paginationArr = new Array(paginationCount).fill(' ');

  const fetchPosts = async () => {
    const {error, posts, postCount} = await getPosts(pageNo, POST_LIMIT);
    if(error) return console.log(error);
    // console.log(postCount);
    setPosts(posts);
    setTotalPostCount(postCount);
  }
  useEffect(()=>{
    fetchPosts();
  }, [])

  const fetchMorePosts = (index) => {
    pageNo = index;
    fetchPosts();
  }

  const handleDelete = async ({id}) => {
    const r = window.confirm('정말로 삭제하시겠습니까?');
    if(!r) return;
    const {error, message} = await deletePost(id);
    if(error) return console.log(error);
    console.log(message);

    const newPosts = posts.filter(p => p.id !== id)
    setPosts(newPosts);
  }


  return (
    <div>
      <div className='grid grid-cols-3 gap-5'>
        {
          searchResult.length ? (
            searchResult.map((post)=>(
              <PostCard post={post} key={post.id} onDeleteClick={()=>handleDelete(post)} />
            ))
          )
          : (
            posts.map((post)=>(
              <PostCard post={post} key={post.id} onDeleteClick={()=>handleDelete(post)} />
            ))
          )
        }
      </div>
      <div className='py-10 flex justify-center items-center'>
        {paginationArr.map((_, index) => {
          return <button 
                     key={index + 1}
                     onClick={()=>fetchMorePosts(index)}
                     className={
                        index === pageNo ? 
                          'text-white bg-black border-black border rounded-full w-6 h-6 pt-px mx-0.5' :
                          'bg-white border-black border rounded-full w-6 h-6 pt-px mx-0.5'
                     }>
                    {index + 1}
                 </button>
        })}
      </div>
    </div>
  )
}

export default Home