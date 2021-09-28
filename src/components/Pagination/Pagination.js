/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './Pagination.css';
import { Link } from 'react-router-dom';


function Pagination(props) {

    const { total, current, quantity = 24, genre } = props;
    // console.info(genre)

    const showPagination = (total, quantity) => {
        const totalPage = Math.ceil(total / quantity);
        let currentPage = Number.parseInt(current);

        let result = [];

        if (totalPage > 7) {
            if (currentPage > 3) {
                // console.info('3')

                for (let i = -3; i <= 1; i++) {
                    const num = (currentPage + i) < totalPage ? (currentPage + i) : totalPage;
                    result.push(<Link to={`/anime/${genre}/trang-${num}`} key={num} className={`page-number ${num === currentPage && 'active'}`}>{num}</Link>);
                    // console.info(num, totalPage)

                    if (num === totalPage) {
                        // console.info('equal');
                        return result;
                    };
                }
                let jump = (currentPage + 5) < totalPage ? (currentPage + 5) : totalPage;
                result.push(<Link to={`/anime/${genre}/trang-${jump}`} key={jump} className={`page-number`}>{jump}</Link>);

                if (jump === totalPage) return result;
                else {
                    jump = (currentPage + 10) < totalPage ? (currentPage + 10) : totalPage;
                    result.push(<Link to={`/anime/${genre}/trang-${jump}`} key={jump} className={`page-number`}>{jump}</Link>);
                    if (jump === totalPage) return result;
                }
                // console.info('3')
            }
            else {
                for (let i = 1; i <= 7; i++) {
                    result.push(<Link to={`/anime/${genre}/trang-${i}`} key={i} className={`page-number ${i === currentPage && 'active'}`}>{i}</Link>);
                }
                // console.info('2')
            }
        }
        else {
            for (let i = 1; i <= totalPage; i++) {
                result.push(<Link to={`/anime/${genre}/trang-${i}`} key={i} className={`page-number ${i === currentPage && 'active'}`}>{i}</Link>);
            }
            // console.info('1')
        }
        // console.info(totalPage);
        return result;
    }

    return (
        <div className="pagination">
            <div className="pagination-wrap">
                <Link to={`/anime/${genre}/trang-1`} className="page-number" style={{display: `${Number.parseInt(current) < 4 ? 'none' : "block"}`}}>
                    <i className="fas fa-angle-double-left first-page"></i>
                    Đầu
                </Link>

                <Link to={`/anime/${genre}/trang-${Number.parseInt(current) - 1}`} className="page-number" style={{display: `${Number.parseInt(current) === 1 ? 'none' : "block"}`}}>
                    <i className="fas fa-chevron-left"></i>
                </Link>

                {total && current && showPagination(total, quantity)}

                <Link to={`/anime/${genre}/trang-${Number.parseInt(current) + 1}`} className="page-number" style={{display: `${Number.parseInt(current) === Math.ceil(total / quantity) ? 'none' : "block"}`}}>
                    <i className="fas fa-chevron-right"></i>
                </Link>

                <Link to={`/anime/${genre}/trang-${Math.ceil(total / quantity)}`} className="page-number" style={{display: `${Number.parseInt(current) === Math.ceil(total / quantity) ? 'none' : "block"}`}}>
                    Cuối
                    <i className="fas fa-angle-double-right last-page"></i>
                </Link>
            </div>
        </div>
    )
}

export default Pagination

