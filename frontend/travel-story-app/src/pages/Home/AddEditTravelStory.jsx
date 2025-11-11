import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteOutline } from 'react-icons/md'
import DateSelector from '../../components/input/DateSelector'
import ImageSelector from '../../components/input/ImageSelector'
import TagInput from '../../components/input/TagInput'
import axiosInstance from '../../utils/axiosInstance'
import { toast } from 'react-toastify'
import uploadImage from '../../utils/uploadImage'
import moment from 'moment'

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories}) => {
    
    const [error, setError] = useState("")

    const [title, setTitle] = useState(storyInfo?.title || "")
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null)
    const [story, setStory] = useState(storyInfo?.story || "")
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || [])
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)

    //Add Travel story
    const addTravelStory = async () => {
        try {
            let imageUrl=""
            //Upload Image if present
            if(storyImg) {
                const imgUploadRes = await uploadImage(storyImg)
                //Get image URL
                imageUrl = imgUploadRes.imageUrl || ""
            }

            const response = await axiosInstance.post('/add-travel-story',{
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
            })
            if(response.data && response.data.story)
                toast.success('Story Added Successfully')
            //Refresh stories
            getAllTravelStories()
            //Close modal or form
            onClose()
        } catch(error) {
            if(error.response && error.response.data && error.response.data.message)
                //Handle unexpected errors
                setError(error.response.data.message)
            else
                setError('An unexpected error occured. Please try again')
        }
    }

    //Update Travel story
    const updateTravelStory = async () => {
        let imageUrl = storyImg
        try {
            if(typeof storyImg === 'object') {
            // Upload New Image
            const imgUploadRes = await uploadImage(storyImg)
            imageUrl = imgUploadRes.imageUrl || ""
            }
            const id = storyInfo._id
            const response = await axiosInstance.put(`/edit-story/${id}`, {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
            })
            console.log(response)
            if(response.data && response.data.story)
                toast.success('Story Updated Successfully')
            //Refresh stories
            getAllTravelStories()
            //Close modal or form
            onClose()
        } catch(error) {
            console.log(error)
            if(error.response && error.response.data && error.response.data.message)
                //Handle unexpected errors
                setError(error.response.data.message)
            else
                setError('An unexpected error occured. Please try again')
        }
    }

    const handleAddOrUpdateClick = () => {
        if(!title) {
            setError('Please enter the title')
            return
        }
        if(!story) {
            setError('Please enter the story')
            return
        }
        setError("")

        if(type === 'edit')
            updateTravelStory()
        else
            addTravelStory()
    }

    //Delete story image and Update the story
    const handleDeleteImage = async () => {
        //Deleting the image
       const deleteImgRes = await axiosInstance.delete('/delete-image',{
        params: {
            imageUrl: storyInfo.imageUrl,
        },
       })

       if(deleteImgRes.data) {
        const id = storyInfo._id

        //Updating story
        const response = await axiosInstance.put(`/edit-story/${id}`,{
            title,
            story,
            visitedLocation,
            visitedDate: moment().valueOf(),
            imageUrl:"",
        })
        setStoryImg(null)
       }
    }
  
    return (
    <div className='relative'>
        <div className='flex items-center justify-between'>
        <h5 className='text-xl font-medium text-slate-700'>
            {type==='add'?'Add Story':'Update Story'}
        </h5>
        <div>
            <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                {type==='add'? 
                (<button className='btn-small' onClick={handleAddOrUpdateClick}>
                    <MdAdd className='text-lg'/> ADD STORY
                </button>)
                :
                (
                <>
                <button className='btn-small' onClick={handleAddOrUpdateClick}>
                    <MdAdd className='text-lg'/> UPDATE STORY
                </button>
                {/* <button className='btn-small btn-delete' onClick={onClose}>
                    <MdDeleteOutline className='text-lg'/> DELETE
                </button> */}
                </>
                ) 
            }

                <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400'/>
                </button>
            </div>

            {error && (<p className='text-red-500 text-xs pt-2 text-right'>{error}</p>)}

        </div>
        </div>

        <div>
            <div className='flex-1 flex flex-col gap-2 pt-4'>
            <label className='input-label'>TITLE</label>
            <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='A Day at the Grand Wall' value={title} onChange={({ target })=>setTitle(target.value)}/>
            
            <div className='my-3'>
                <DateSelector date={visitedDate} setDate={setVisitedDate}/>
            </div>

            <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImage={handleDeleteImage}/>
            
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>STORY</label>
                <textarea 
                type='text' 
                className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='Your Story'
                rows={10}
                value={story}
                onChange={({ target }) => setStory(target.value)}
                />
            </div>

            <div className='pt-3'>
                <label className='input-label'>VISITED LOCATIONS</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
            </div>

            </div>
        </div>
    </div>
  )
}

export default AddEditTravelStory
