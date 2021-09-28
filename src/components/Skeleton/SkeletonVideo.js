import React from 'react'
import Shimmer from './Shimmer'
import Skeleton from './Skeleton'

function SkeletonVideo() {
    return (
        <div className={`skeleton-wrap skeleton_watch`}>
            <Skeleton type="video" />
            <Shimmer />
        </div>
    )
}

export default SkeletonVideo
