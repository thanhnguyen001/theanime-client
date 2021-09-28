import React, { useEffect } from 'react';
import './Loading.css';

function Loading() {

    useEffect(() => {
        const loadingElement = document.querySelector('.loading-wrap');
        const loadingRotate = loadingElement.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 3000,
            iterations: Infinity
        });
        loadingRotate.play();
    }, []);

    return (
        <div className="loading">
            <div className="loading-wrap">
                <i className="fas fa-spinner loading-icon"></i>
            </div>
        </div>
    )
}

export default Loading
