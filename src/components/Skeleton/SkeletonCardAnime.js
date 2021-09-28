import React from 'react'
import Shimmer from './Shimmer'
import Skeleton from './Skeleton'

function SkeletonCardAnime({ theme }) {

    return (
        <div className={`skeleton-wrap skeleton_card ${theme}`}>
            <Skeleton type="card" />
            <Shimmer />
        </div>
    )
}

export default SkeletonCardAnime
