import React, { useState, useEffect } from 'react'
import { createPost } from '../api/post'
import { useValidation } from '../context/ValidationProvider'
import { useNavigate } from 'react-router-dom';

import PostForm, {defaultPost} from './PostForm'

const CreatePost = ({closeNav}) => {

  const [postInfo, setPostInfo] = useState(defaultPost);
  const [busy, setBusy] = useState(false);
  const [resetAfterSubmit, setResetAfterSubmit] = useState(false);

  const { updateValidation } = useValidation();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setBusy(true);
    const {error, post} = await createPost(data);
    setBusy(false);
    if(error) return updateValidation(error);

    setResetAfterSubmit(true);
    // navigate(`/update-post/${post.slug}`);
    navigate('/');
  }

  useEffect(()=>{
    const result = localStorage.getItem('blogPost');
    if(!result) return;

    const oldPost = JSON.parse(result);
    setPostInfo({...defaultPost, ...oldPost});
  }, [])

  return (
    <PostForm 
        closeNav={closeNav}
        onSubmit={handleSubmit} 
        initialPost={postInfo} 
        busy={busy}
        postTitle='새 포스트 작성'
        postBtnTitle='Post'
        resetAfterSubmit={resetAfterSubmit}
    />
  )
}

export default CreatePost