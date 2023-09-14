import React, { useEffect, useRef } from 'react'


const mdRules = [
    {title: 'From h1 to h6', rule:'# Heading => ######'},
    {title: 'Image', rule:'![alt 내용](http://이미지경로)'},
    {title: 'Link', rule:'[Link 텍스트](http://링크경로)'},
    {title: 'Blockquote', rule:'> Your Quote'}
]

const MarkdownHint = ({closeNav, displayMarkdownHint, setDisplayMarkdownHint}) => {

  const container = useRef();

  useEffect(()=>{
    //nav의 열림/닫힘에 따라 markdown 위치 이동
    if(closeNav) {
      container.current?.classList.remove('bottom-0', '-left-2', '-translate-x-full')
      container.current?.classList.add('bottom-0', '-right-2', 'translate-x-full')
    }else{
      container.current?.classList.remove('bottom-0', '-right-2', 'translate-x-full')
      container.current?.classList.add('bottom-0', '-left-2', '-translate-x-full')
    }
  }, [])

 
  return (
    <div 
        ref={container} 
        className='border border-dashed border-black rounded absolute bg-white overflow-hidden'
        onMouseEnter={()=>setDisplayMarkdownHint(true)}
        onMouseLeave={()=>setDisplayMarkdownHint(false)}
    >
        <h1 className='text-center mt-2 font-semibold text-gray-800'>General Markdown Rules</h1>
        { 
        mdRules.map(({title,rule})=>{
            return (
                <div key={title} className='p-2 list-none'>
                    <p className='font-semibold text-gray-500'>{title}</p>
                    <p className='font-semibold text-gray-700 pl-2 font-mono text-sm'>{rule}</p>
                </div>
            )
        })
        }
        <div className='text-center mt-3 mb-2 hover:underline'>
            <a href='https://www.markdownguide.org/basic-syntax/' target='_blank'>더보기</a>
        </div>
    </div>
  )
}

export default MarkdownHint