import React from 'react'
import { NavLink } from 'react-router-dom'
import { AiFillHome, AiOutlineHome, AiFillFileAdd, AiOutlineFileAdd, AiFillEdit, AiOutlineEdit } from 'react-icons/ai'


const NavItem = ({to, value, Icon, closed}) => {
    const commonClass = 'flex items-center space-x-2 w-full p-2 block whitespace-nowrap justify-center';
    const activeClass = commonClass + ' bg-white';
    const inactiveClass = commonClass + ' text-white';

    return (
        <NavLink className={({isActive})=> isActive ? activeClass : inactiveClass} to={to}>
            {Icon}
            <span className={closed ? 'w-0 transition-width overflow-hidden hidden' : 'w-full transition-width overflow-hidden'}>{value}</span>
        </NavLink>
    )
}

const Navbar = ({closed}) => {
  return (
    <nav>
        <div className='flex justify-center mt-1'>
            <img src="/logo_white.png" alt="juillet's blog" 
                 className={closed ? 'min-logo transition-width': 'logo transition-width'} />
        </div>
        <ul>
            <li>
                <NavItem 
                    to='/' 
                    value='Home'  
                    Icon={closed?<AiFillHome size={25} />:<AiFillHome size={20} />} 
                    closed={closed} />
            </li>
            <li>
                <NavItem 
                    to='/create-post' 
                    value='New Post' 
                    Icon={closed?<AiFillFileAdd size={25} />:<AiFillFileAdd size={20} />} 
                    closed={closed} />
            </li>
        </ul>
    </nav>
  )
}

export default Navbar