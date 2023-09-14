import React from 'react'
import Markdown from 'markdown-to-jsx'

const DeviceView = ({onClose, thumbnail, title, content}) => {
  return (
    <div 
        onClick={onClose}
        className='bg-gray-500 bg-opacity-50 fixed inset-0 backdrop-blur-sm flex justify-center items-center'>
        <div className='bg-white overflow-auto border-2 border-dashed border-black rounded-md p-4' style={{width:360, height:640}}>
            <img src={thumbnail || undefined} alt={title || undefined} className='aspect-video object-contain' />
            <div className='px-2 py-4'>
                <h1 className="font-semibold text-gray-700 text-xl">{title || undefined}</h1>
                <Markdown>{content}</Markdown>
            </div>
        </div>
    </div>
  )
}

export default DeviceView