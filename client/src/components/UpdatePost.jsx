import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { updatePost, getPost } from '../api/post'
import { useValidation } from '../context/ValidationProvider'
import { useNavigate } from 'react-router-dom'

import PostForm, { defaultPost } from './PostForm'
import NotFound from './NotFound'

const UpdatePost = ({closeNav}) => {

  const {slug} = useParams();
  const { updateValidation } = useValidation();
  const navigate = useNavigate();

  const [notFound, setNotFound] = useState(false);
  const [postInfo, setPostInfo] = useState({...defaultPost});
  const [busy, setBusy] = useState(false);

  const fetchPost = async () => {
    const { error, post } = await getPost(slug);
    if(error){
      setNotFound(true);
      return updateValidation('error', error);
    }
    setPostInfo({...post, tags:post.tags?.join(', ')});
  }

  useEffect(()=>{
    fetchPost();
  }, [])

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, post} = await updatePost(postInfo.id, data);
    setBusy(false);
    if(error) return updateValidation('error', error);

    setPostInfo({...post});
    // tags: post.tags?.join(', ')
    // console.log(post);
    navigate('/');
  }

  if(notFound) return <NotFound />
  return (
    <PostForm 
        closeNav={closeNav}
        initialPost={postInfo}
        postTitle='포스트 수정'
        postBtnTitle='Update'
        onSubmit={handleSubmit}
        busy={busy} />
  )
}

export default UpdatePost