import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import './gallery.css'

const Gallery = (picData) => {

    let data = (picData.data);


    const [modal, setModal] = useState(false)
    const [selectedImg, setSelectedImg] = useState('');

    const selectPic = (imgSrc) => {
        setModal(!modal);
        setSelectedImg(imgSrc);
    }
    return (
        <>
        <div className={modal ? 'modal open' : 'modal'} onClick={() => setModal(!modal)}>
            <img src={selectedImg} />
            <CloseIcon onClick={() => setModal(!modal)} />
        </div>
        {/* {selectedImg} */}

        {modal}

        <div className='gallery'>
            {data.map((item, index) => {
                return (
                    <div className='photo' key={index} onClick={() => selectPic(item.src)}>
                        <img src={item.src} style={{width: '100%'}}/>
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default Gallery;
