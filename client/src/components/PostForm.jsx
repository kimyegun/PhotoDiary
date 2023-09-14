import React, {useState, useEffect} from 'react'
import {ImSpinner11, ImEye, ImFileEmpty, ImSpinner3 } from 'react-icons/im'
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
    closeNav,
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
    setSelectedThumbUrl('');
    localStorage.removeItem('blogPost');
  } 
  
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center justify-between px-5'>
          <h1 className='text-xl font-semibold'>
            {postTitle}
          </h1>
          <div className='flex items-center space-x-2'>
            <button
              onClick={resetForm} 
              className='flex flex-col items-center px-3 ring-1 ring-black rounded h-10 text-white bg-black hover:text-black hover:bg-white transition justify-center pt-1'>
              <ImSpinner11 size={14} />
              <span style={{fontSize:'0.7rem'}}>reset</span>
            </button>
            <button 
              onClick={()=>setVisible(true)}
              className='flex flex-col items-center px-3 ring-1 ring-black rounded h-10 text-white bg-black hover:text-black hover:bg-white transition justify-center pt-1'>
              <ImEye />
              <span style={{fontSize:'0.7rem'}}>view</span>
            </button>
            <button 
              type='submit' 
              className='flex w-36 items-center space-x-2 px-3 ring-1 ring-black rounded h-10 text-white bg-black hover:text-black hover:bg-white transition justify-center'>
                  { busy ? <ImSpinner3 className='animate-spin mx-auto text-lg' /> : postBtnTitle}
              </button>
          </div>
        </div>

        {/* featured checkbox */}
        <div className='px-5'> 
          <input 
              type='checkbox' 
              onChange={handleChange} 
              name='featured' 
              id='featured' 
              hidden 
          />
          <label htmlFor='featured' className='flex items-center space-x-2 cursor-pointer group'>
            <div className='w-4 h-4 rounded-full border-2 flex items-center justify-center border-black'>
              {
                featured &&
                  <div className='w-2 h-2 rounded-full bg-black' />
              }
            </div>
            <div className='hover:bg-transparent ring-black transition relative'>
              최근글로 등록
              <div className='hidden group-hover:block absolute bottom-0.5 bg-black' style={{width:87.125, height:2}} />
            </div>
          </label>
        </div>
        
        <div className='px-5 bg-black rounded-full py-5 mt-2'>
            <ul className='mt-12'>
              {/* title input */}
              <li className='mb-1'> 
                <input 
                    type='text' 
                    name='title' 
                    value={title}
                    placeholder='제목'
                    className='border border-gray-800 rounded-md w-full p-1'
                    id='title' 
                    onChange={handleChange} />
              </li>
              
              {/* content textarea */}
              <li className='flex relative mb-2'> 
                <textarea 
                    rows='20' 
                    name='content' 
                    value={content}
                    onChange={handleChange}
                    onFocus={()=>setDisplayMarkdownHint(true)}
                    // onBlur={()=>setDisplayMarkdownHint(false)}
                    id='content' 
                    placeholder='## Markdown'
                    className='border border-gray-800 rounded-md w-full mt-1 p-1 resize-none'  />

                {/* markdown */}
                { 
                  displayMarkdownHint 
                  && <MarkdownHint closeNav={closeNav}
                                   displayMarkdownHint={displayMarkdownHint}
                                   setDisplayMarkdownHint={setDisplayMarkdownHint} />
                }
              </li>

              {/* thumbnail */}
              <li className='border border-black rounded-md mb-1'>
                <div
                  className={selectedThumbUrl ? 'flex flex-row rounded-t-md border border-white overflow-hidden' : 'flex flex-row rounded-md border border-white overflow-hidden'}>
                  <label htmlFor='thumbnail' className='w-32 rounded-l text-white bg-black hover:text-black hover:bg-white hover:border hover:border-black transition cursor-pointer flex items-center justify-center pt-1'>
                    <span>이미지 업로드</span>
                  </label>
                  
                  {/* image link copy */}
                  <div 
                    className='bg-white flex flex-row items-center w-full overflow-hidden'>
                      <button 
                          onClick={imageCopy}
                          className='text-black py-0.5 px-1'
                      >
                        <span className='flex flex-col items-center justify-center'>
                          <ImFileEmpty />
                          <span className='text-xs h-3'>copy</span>
                        </span>
                      </button>
                      <input
                          type='text'
                          value={imageUrlCopy}
                          onChange={(e)=>setImageUrlCopy(e.target.value)}
                          className='p-1 w-full h-8 rounded-md'
                      />
                  </div>
                  
                  <input type='file' name='thumbnail'
                        id='thumbnail'
                        onChange={handleChange}
                        hidden
                  />
                </div>

                  {
                      selectedThumbUrl 
                      ? <div className='bg-white rounded-b-md p-1'>
                          <img src={selectedThumbUrl} 
                              alt='thumbnail'
                              className='shadow-sm mt-1 max-h-40 border border-dashed border-gray-500 rounded overflow-hidden' />
                        </div> 
                      : ''
                  }
              </li>

              {/* tags */}
              <li className='mb-1'> 
                <input type='text' name='tags' placeholder='태그' 
                      className='border border-gray-800 rounded-md w-full mt-1 p-1' 
                      id='tags'
                      value={tags}
                      onChange={handleChange}
                />
              </li>

              {/* meta description */}
              <li> 
                <textarea rows='2' name='meta' placeholder='간단한 설명' 
                          className='border border-gray-800 rounded-md w-full mt-1 p-1 resize-none' 
                          id='meta'
                          onChange={handleChange}
                          value={meta} />
              </li>
            </ul>


            <div className='flex flex-row justify-center items-center my-7'>
              <button type='submit' className='border-2 rounded-full inline-block py-3 px-10 mx-2 hover:bg-white text-white bg-black hover:text-black transition'>등록</button>
              <button className='border-2 rounded-full inline-block py-3 px-10 mx-2 hover:bg-white text-white bg-black hover:text-black transition'>취소</button>
            </div>
        </div>
      </form>

      {
        visible &&
        <DeviceView
            title={title}
            content={content}
            thumbnail={selectedThumbUrl}
            onClose={()=>setVisible(false)}
        />
      }
    </>
  )
}

export default PostForm