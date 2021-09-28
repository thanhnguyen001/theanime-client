import React from 'react'
import Shimmer from './Shimmer'
import Skeleton from './Skeleton'

function SkeletonSlider({ theme }) {

    return (
        <div className={`skeleton-wrap skeleton_slider ${theme}`}>
            <Skeleton type="slider" />
            <Shimmer />
        </div> 
    )
}

export default SkeletonSlider
