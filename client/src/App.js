import React, {useState} from 'react'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import UpdatePost from './components/UpdatePost';
import SearchForm from './components/SearchForm';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList'


const App = () => {

  const [closeNav, setCloseNav] = useState(false);
  const toggleNav = () => {
    setCloseNav(!closeNav);
  }
  const getNavWidth = () => (
    closeNav ? 'w-16' : 'w-56'
  )

  return (
    <div className="flex" style={{fontFamily:'AppleSDGothicNeo'}}>
      {/* 네비게이션 */}
      <div className={getNavWidth() + ' min-h-screen transition-width border border-r bg-black'}>
        <div className='sticky top-0'>
          <Navbar closed={closeNav} />
        </div>
      </div>
      {/* 내용 영역 */}
      <div className='flex-1 min-h-screen'>
        <div className='sticky top-0 z-10 bg-white bg-opacity-60'>
          <div className='flex item-center p-2'>
            <button onClick={toggleNav}>
              { closeNav ? <AiOutlineMenuUnfold size={25} /> : <AiOutlineMenuFold size={25} /> }
            </button>
            <SearchForm />
          </div>
        </div>

        <div className='max-w-screen-lg mx-auto p-10'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/calendar' element={<Calendar/>}/>
            <Route path='/todolist' element={<TodoList/>}/>
            <Route path='/create-post' element={<CreatePost closeNav={closeNav} />} />
            <Route path='/update-post/:slug' element={<UpdatePost closeNav={closeNav} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App