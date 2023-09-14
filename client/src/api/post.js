import client from './client'

/* 게시물 가져오기 */
export const getPosts = async (pageNo, limit) => {
    try{
        const {data} = await client(`/post/posts?pageNo=${pageNo}&limit=${limit}`)
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data){
            return response.data;
        }
        return {error: error.message}
    }
}

/* 게시물 삭제 */
export const deletePost = async (postId) => {
    try{
        const {data} = await client.delete(`/post/${postId}`);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data){
            return response.data;
        }
        return {error: error.message || error}
    }
}

/* 검색 */
export const searchPost = async (query) => {
    try{
        const {data} = await client(`/post/search?title=${query}`);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data){
            return response.data;
        }
        return {error: error.message || error}
    }
}
/* 작성 */
export const createPost = async (formData) => {
    try{
        const {data} = await client.post('/post/create', formData);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data){
            return response.data;
        }
        return {error: error.message || error}
    }
}

/* 수정 */
export const updatePost = async (postId, formData) => {
    try{
        const {data} = await client.put(`/post/${postId}`, formData);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data){
            return response.data;
        }
        return {error: error.message || error}
    }
}

/* 수정 시 기존 게시글 정보 가져오기 */
export const getPost = async (slug) => {
    try{
        const {data} = await client(`/post/single/${slug}`);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data){
            return response.data;
        }
        return {error: error.message || error}
    }
}