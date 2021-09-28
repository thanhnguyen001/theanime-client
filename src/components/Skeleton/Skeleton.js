import React from 'react';
import './Skeleton.css';

function Skeleton({ type }) {

    return (
        <div className={`skeleton skeleton-${type}`}></div>
    )
}

export default Skeleton
