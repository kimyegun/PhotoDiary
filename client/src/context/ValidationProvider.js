import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const ValidationContext = createContext();

let timeoutId;

export default function ValidationProvider({children}){

  const [validation, setValidation] = useState({
    type:'',
    value:''
  });
  const [backgroundColor, setBackgroundColor] = useState('bg-red-400');
  const validationRef = useRef();
  
  const updateValidation = (type, value) => {
    if(timeoutId) return clearTimeout(timeoutId);
    if(!type || !value) return; 
    switch(type){
        case 'error':
            setBackgroundColor('bg-red-400');
        break;
        case 'warning':
            setBackgroundColor('bg-orange-400');
        break;
        case 'success':
            setBackgroundColor('bg-green-400');
        break;
        default:
            setBackgroundColor('bg-red-400');
    }

    setValidation({type, value});
    timeoutId = setTimeout(()=>{
        setValidation({type:'', value:''});
    }, 2500);
  }

  useEffect(()=>{
    validationRef.current?.classList.remove('bottom-1', 'opacity-0')
    validationRef.current?.classList.add('bottom-16', 'opacity-1')
    return ()=>{ //3초 지나면 다시 사라지도록
        validationRef.current?.classList.add('bottom-16', 'opacity-1')
        validationRef.current?.classList.remove('bottom-1', 'opacity-0')
    }
  }, [validation.value]);

  return (
    <>
        <ValidationContext.Provider value={{updateValidation}}>
            {children}
        </ValidationContext.Provider>
        {
            validation.value 
            ? <p 
                ref={validationRef}
                className={backgroundColor + ' rounded-full px-4 py-2 text-white fixed bottom-16 left-1/2 -translate-x-1/2 opacity-0 transition-bottom duration-300 ease-linear'}>
                    {validation.value}
               </p> 
            : null
        }
    </>
  )
}

export const useValidation = () => useContext(ValidationContext);