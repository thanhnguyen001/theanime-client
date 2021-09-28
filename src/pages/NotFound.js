import React from 'react'

function NotFound() {
    localStorage.removeItem('comment');

    return (
        <div className="not-found">
            <h1 style={{color: 'red'}}> 404 Not Found</h1>
            <h4 style={{color: 'green'}}>Oh! Có vẻ bạn đã nhập không chính xác ở đâu đó, hãy thử lại xem sao!!!</h4>
        </div>
    )
}

export default NotFound
