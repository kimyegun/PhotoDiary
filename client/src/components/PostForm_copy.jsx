import React, {useState, useEffect} from 'react'
import { ImSpinner11, ImEye, ImFilePicture, ImFileEmpty, ImSpinner3 } from 'react-icons/im'
import { useValidation } from '../context/ValidationProvider'
import MarkdownHint from './MarkdownHint'
import DeviceView from './DeviceView'

export const defaultPost = {
    title:'',
    thumbnail:'',
    featured: false,
    content:'',
    tags:'',
    meta:''
}

const PostForm = ({
    onSubmit, 
    busy, 
    initialPost, 
    postTitle,
    postBtnTitle,
    resetAfterSubmit
}) => {

  const [postInfo, setPostInfo] = useState(defaultPost);
  const [selectedThumbUrl, setSelectedThumbUrl] = useState('');
  const [imageUrlCopy, setImageUrlCopy] = useState('');
  const [displayMarkdownHint, setDisplayMarkdownHint] = useState(false);
  const [visible, setVisible] = useState(false);

  const { updateValidation } = useValidation();

  useEffect(()=>{
    if(initialPost.thumbnail){
        setSelectedThumbUrl('/uploads/' + initialPost.thumbnail.filename);
    }
    setPostInfo({...initialPost}); //수정본이 담긴다.
    return () => {
        if(resetAfterSubmit) resetForm();
    }
  }, [initialPost, resetAfterSubmit]);

  const {title, content, featured, tags, meta} = postInfo;

  /* 이미지 주소 복사해서 markdown rule 적용하고 복사 */
  const imageCopy = () => {
    const rulesTextCopy = `![이미지 설명을 입력하세요.](${imageUrlCopy})`;
    navigator.clipboard.writeText(rulesTextCopy);
  }

  const handleChange = ({target}) => {
    const {value, name, checked} = target;

    if(name === 'thumbnail'){
        const file = target.files[0];
        if(!file.type?.includes('image')){
            return updateValidation('warning', '이미지만 업로드 가능합니다.');
        }
        setPostInfo({...postInfo, thumbnail:file});
        return setSelectedThumbUrl(URL.createObjectURL(file));
    }

    if(name === 'featured'){
        return setPostInfo({...postInfo, [name]: checked});
    }

    if(name === 'meta' && meta.length > 100) {
        return setPostInfo({...postInfo, meta: value.substring(0,100)});
        //meta가 100자를 초과하면 잘라버리기
    }
    
    setPostInfo({...postInfo, [name]:value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content, tags, meta } = postInfo;

    if(!title.trim()) return updateValidation('error', '제목을 입력해주세요.');
    if(!content.trim()) return updateValidation('error', '내용을 입력해주세요.');
    // if(!tags.trim()) return updateValidation('error', '태그를 입력해주세요.');
    // if(!meta.trim()) return updateValidation('error', '간단한 설명을 입력해주세요.');
    
    const newTags = tags.split(',')
                        .map((item)=>item.trim())
                        .splice(0,4);

    const slug = title.toLocaleLowerCase()
                      .replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9]/g, ' ')
                      .split(' ')
                      .filter((item)=>item.trim())
                      .join('-');
        
    const formData = new FormData();
    const finalPost = {...postInfo, tags: JSON.stringify(newTags), slug};
    for(let key in finalPost){
        formData.append(key, finalPost[key]);
    }
    onSubmit(formData);
    if(resetAfterSubmit) resetForm();
  }
  
  const resetForm = () => {
    setPostInfo({...defaultPost});
    localStorage.removeItem('blogPost');
  } 


  return (
    <>
        <form onSubmit={handleSubmit} className='p-2 flex'>
            <div className="w-9/12 space-y-3 h-screen flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-700">
                        {postTitle}
                    </h1>

                    <div className="flex items-center space-x-5">
                        <button 
                            onClick={resetForm}
                            className='flex items-center px-3 ring-1 ring-blue-500 rounded h-10 hover:text-white hover:bg-blue-500'>
                            <ImSpinner11 />
                            <span>reset</span>
                        </button>
                        <button 
                            onClick={()=>setVisible(true)}
                            className='flex items-center px-3 ring-1 ring-blue-500 rounded h-10 hover:text-white hover:bg-blue-500'>
                            <ImEye />
                            <span>view</span>
                        </button>
                        <button
                            className="h-10 w-36 px-5 hover:ring-1 bg-blue-500 rounded text-white hover:text-blue-500 hover:bg-transparent ring-blue-500 transition">
                                { busy ? <ImSpinner3 className='animate-spin mx-auto text-xl' /> : postBtnTitle }
                            </button>
                    </div>
                </div>

                {/* featured checkbox */}
                <div className='flex'>
                    <input 
                        type="checkbox"
                        onChange={handleChange}
                        name='featured' 
                        id="featured" 
                        hidden 
                    />
                    <label htmlFor="featured" className="flex items-center space-x-2 text-gray-700 cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-700 flex items-center justify-center group-hover:border-blue-500">
                            {
                                featured &&
                                <div className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-blue-500" />
                            }
                        </div>
                        <span className='group-hover:text-blue-500'>featured</span>
                    </label>
                </div>

                {/* title input */}
                <input 
                    type="text" 
                    name='title'
                    value={title || undefined}
                    onChange={handleChange}
                    className="text-xl outline-none focus:ring-1 rounded p-2 w-full font-semibold" 
                    placeholder='Post title'
                />

                {/* image link copy */}
                <div className='flex space-x-2'>
                    <div className="flex items-center space-x-2 px-3 ring-1 ring-blue-500 rounded text-blue-500">
                        <ImFilePicture />
                        <span>Place an image</span>
                    </div>
                    <div className="flex flex-1 justify-between bg-gray-400 rounded overflow-hidden h-10">
                        <input 
                            type="text" 
                            value={imageUrlCopy || undefined}
                            onChange={(e)=>setImageUrlCopy(e.target.value)}
                            className='bg-transparent px-2 text-white w-full' />
                        <button 
                            className="text-xs flex flex-col items-center justify-center p-2 self-stretch bg-gray-700 text-white"
                            onClick={imageCopy}>
                            <ImFileEmpty />
                            <span>copy</span>
                        </button>
                    </div>
                </div>

                {/* textarea input */}
                <textarea 
                    className="resize-none outline-none focus:ring-1 rounded p-2 w-full flex-1 font-mono tracking-wide text-sm"
                    placeholder='## Markdown' 
                    name='content'   
                    onChange={handleChange}
                    value={content || undefined}
                    onFocus={()=>setDisplayMarkdownHint(true)}
                    onBlur={()=>setDisplayMarkdownHint(false)}
                />

                {/* tags input */}
                <div>
                    <label htmlFor='tags'>Tags</label>
                    <input
                        id='tags'
                        name='tags'
                        value={tags || undefined}
                        onChange={handleChange}
                        type='text' 
                        className="outline-none focus:ring-1 rounded p-2 w-full"
                        placeholder='tag1, tag2, ...'    
                    />
                </div>

                {/* meta */}
                <div>
                    <label htmlFor='meta'>짧은 설명</label>
                    <textarea 
                        id='meta'
                        name='meta'
                        value={meta || undefined}
                        onChange={handleChange}
                        className="resize-none outline-none focus:ring-1 rounded p-2 w-full h-28"
                        placeholder='## Markdown'    
                    />
                </div>        
            </div>

            <div className='w-1/4 px-2'>
                <h1 className='text-xl font-semibold text-gray-700 mb-2'>이미지</h1>

                {/* thumbnail */}
                <div>
                    <input 
                        type="file" 
                        name='thumbnail' 
                        id='thumbnail' 
                        onChange={handleChange}
                        hidden />
                    <label htmlFor="thumbnail" className='cursor-pointer'>
                        {
                            selectedThumbUrl 
                            ? (
                                <img src={selectedThumbUrl} className='aspect-video shadow-sm object-contain' alt='thumbnail' /> 
                            ) : (
                                <div className="border border-dashed border-gray-500 aspect-video flex flex-col justify-center items-center bg-white">
                                    <span>이미지 선택</span>
                                    <span className='text-xs'>권장 사이즈</span>
                                    <span className='text-xs'>1280 x 720</span>
                                </div>
                            )
                        }
                    </label>
                </div>

                {/* Markdown */}
                <div className="absolute top-1/2 -translate-y-1/2">
                { displayMarkdownHint && <MarkdownHint /> }
            </div>  
            </div>
        </form>
        {
            visible && 
            <DeviceView 
                title={title} 
                content={content} 
                thumbnail={selectedThumbUrl}
                onClose={()=>setVisible(false)} />
        }
    </>
  )
}

export default PostForm