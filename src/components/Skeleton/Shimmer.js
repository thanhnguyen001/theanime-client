import React from 'react'

function Shimmer({ theme }) {
    return (
        <div className={`shimmer ${theme}`}>
            <div className="shimmer-wrap"></div>
        </div>
    )
}

export default Shimmer
