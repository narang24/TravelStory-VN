import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'
import Navbar from '../../components/Navbar'
import TravelStoryCard from '../../components/cards/TravelStoryCard'
import AddEditTravelStory from './AddEditTravelStory'
import ViewTravelStory from './ViewTravelStory'
import EmptyCard from '../../components/cards/EmptyCard'
import EmptyImg from '../../assets/images/add-story.svg'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { DayPicker } from 'react-day-picker'
import moment from 'moment'
import FilterInfoTitle from '../../components/cards/FilterInfoTitle'
import { getEmptyCardMessage } from '../../utils/helper'

const Home = () => {
 
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState(null)
  const [allStories, setAllStories] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')

  const [dateRange, setDateRange] = useState({from: null, to: null})

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false, 
    type: 'add', 
    data: null,
  })

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null
  })

  //Get User info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user')
      if(response.data && response.data.user) {
        //set user info if data exists
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if(error.response.status===401) {
        //clear storage if unauthorized
        localStorage.clear()
        navigate('/login') //Redirect to login
      }
    }
  }

  //get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get('/get-all-stories')
      if(response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }

    } catch(error) {
      console.log('An unexpected error occurred. Please try again.')
    }
  }

  //Handle Edit story Click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown:true, type:'edit',data:data})
  }

  //Delete Story
  const deleteStory = async (data) => {
    const id = data._id
    try {
      const response = await axiosInstance.delete(`/delete-story/${id}`)
      if(response.data && !response.data.error) 
        toast.error('Story Deleted Successfully')

    setOpenViewModal((prevState)=>({ ...prevState, isShown:false}))
    getAllTravelStories()
    } catch(error) {
      console.log(error)
    console.log('An unexpected error occured. Please try again')
    }
  }

  //Handle Travel story Click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown:true, data})
  }

  //Handle Update Favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id
    try {
      const response = await axiosInstance.put('/update-is-favourite/'+storyId,{ isFavourite: !storyData.isFavourite })

      if(response.data && response.data.story) {
        toast.success('Story updated successfully!')

        if(filterType === 'search' && searchQuery) {
          onSearchStory(searchQuery)
        } else if (filterType === 'date') {
          filterStoriesByDate(dateRange)
        } else {
          getAllTravelStories
        }
      }
    } catch(error) {
      console.log('An unexpected error occurred. Please try again.')
    }
  }

  //Search Story 
  const handleSearch = async (query) => {
    try {
    const response = await axiosInstance.get('/search', {
      params: {
        query,
      }
    })
    if(response.data && response.data.stories) {
      setFilterType('search')
      setAllStories(response.data.stories)
    }
    } catch(error) {
    //handle unexpected errors
    console.log(error)
    console.log('An unexpected error occured. Please try again.')
    }
  }

  const handleClearSearch = () => {
    setFilterType('')
    getAllTravelStories()
  }

  //Handle Filter Travel Story By Date Range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null
      const endDate = day.to ? moment(day.to).valueOf() : null

      if(startDate && endDate) {
        const response = await axiosInstance.get('/travel-stories/filter',{
          params: {
            startDate,
            endDate
          },
        })
        if(response.data && response.data.stories) {
          setFilterType('date')
          setAllStories(response.data.stories)
        }
      }
    } catch(error) {
      console.log('An unexpected error occured. Please try again.')
    }
  }

  //Handle Date Range select
  const handleDayClick = (day) => {
    setDateRange(day)
    filterStoriesByDate(day)
  }

  const resetFilter = () => {
    setDateRange({ from: null, to: null})
    setFilterType("")
    getAllTravelStories()
  }

  useEffect(()=> {
    getAllTravelStories()
    getUserInfo()

    return () => {}
  },[])

  return (
    <>
     <Navbar 
     userInfo={userInfo} 
     searchQuery={searchQuery} 
     setSearchQuery={setSearchQuery}
     handleSearch={handleSearch}
     handleClearSearch={handleClearSearch}
     />

     <div className='container mx-auto py-10'>
      
      <FilterInfoTitle
        filterType={filterType}
        filterDates={dateRange}
        onClear={()=> {
          resetFilter()
        }}
      />
      
      <div className='flex gap-7'>
        <div className='flex-1'>
          {allStories.length>0?(<div className='grid grid-cols-2 gap-4'>
            {allStories.map((item)=>
              {return(<TravelStoryCard 
                key={item._id} 
                imgUrl={item.imageUrl} 
                title={item.title} 
                story={item.story} 
                date={item.visitedDate}
                visitedLocation={item.visitedLocation}
                isFavourite={item.isFavourite}
                onClick={()=>handleViewStory(item)}
                onFavouriteClick={()=>updateIsFavourite(item)}
                />)}
            )}
            </div>):(<EmptyCard imgSrc={EmptyImg} message={getEmptyCardMessage}/>)}
        </div>

        <div className='w-[320px]'>
            <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
              <div className='p-3'>
              <DayPicker 
                captionLayout='dropdown-buttons'
                mode='range'
                selected={dateRange}
                onSelect={handleDayClick}
                pagedNavigation
              />
              </div>
            </div>
        </div>
      </div>
     </div>

    {/* Add & Edit Travel story Model */}
    <Modal
    isOpen={openAddEditModal.isShown}
    onRequestClose={() => {}}
    style= {{
      overlay: {
        backgroundColor:'rgba(0,0,0,0.2)',
        zIndex: 999,
      }
    }}
    appElement={document.getElementById('root')}
    className='model-box scrollbar'
    >
      <AddEditTravelStory
      type={openAddEditModal.type}
      storyInfo={openAddEditModal.data}
      onClose={()=> {
        setOpenAddEditModal({ isShown:false, type:'add',data:null})
      }}
      getAllTravelStories={getAllTravelStories}
      />
    </Modal>

    {/* View Travel story Model */}
    <Modal
    isOpen={openViewModal.isShown}
    onRequestClose={() => {}}
    style= {{
      overlay: {
        backgroundColor:'rgba(0,0,0,0.2)',
        zIndex: 999,
      }
    }}
    appElement={document.getElementById('root')}
    className='model-box scrollbar outline-none'
    >
    <ViewTravelStory 
    storyInfo={openViewModal.data || null}
    onClose={()=>{
      setOpenViewModal((prevState)=>({...prevState, isShown:false}))
    }}
    onEditClick={()=>{
      setOpenViewModal((prevState)=>({...prevState, isShown:false}))
      handleEdit(openViewModal.data || null)
    }}
    onDeleteClick={()=>deleteStory(openViewModal.data || null)}
    />
    </Modal>

      <button className='w-16 h-16 flex items-center justify-center rounded-full bg-[#05B6D3] hover:bg-cyan-400 fixed right-10 bottom-10 cursor-pointer' onClick={()=>setOpenAddEditModal({isShown:true, type: 'add', data:null})}>
        <MdAdd className='text-[32px] text-white'/>
      </button>

     <ToastContainer/> 
    </>
  )
}

export default Home
