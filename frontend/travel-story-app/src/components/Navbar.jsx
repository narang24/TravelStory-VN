import React from 'react'

import LOGO from '../assets/images/logo.svg'
import { useNavigate } from 'react-router-dom'
import ProfileInfo from './cards/ProfileInfo'
import SearchBar from './input/SearchBar'

const Navbar = ({userInfo, searchQuery, setSearchQuery, handleSearch, handleClearSearch}) => {
    const isToken = localStorage.getItem('token')
    const navigate = useNavigate()

    const onLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    const onSearchNote = () => {
        if(searchQuery) {
            handleSearch(searchQuery)
        }
    }

    const onClearSearch = () => {
        handleClearSearch()
        setSearchQuery("")
    }

    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            <img src={LOGO} alt='travel story' className='h-9'/>
        
            {isToken && 
            (<>
            <SearchBar 
                value={searchQuery} 
                onChange={({target})=>{
                    setSearchQuery(target.value)
                }}
                onSearchNote={onSearchNote}
                onClearSearch={onClearSearch}
            />
            <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
            </>)}
        </div>
    )
}

export default Navbar
