/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import './Section.css';
import axiosClient from '../../../api/axiosClient';
import CardAnime from '../../CardAnime/CardAnime';
import SkeletonCardAnime from '../../Skeleton/SkeletonCardAnime';
import { Link } from 'react-router-dom';
import Pagination from '../../Pagination/Pagination';

const Update = props => {
    const { mode, path, title, url } = props;
    // console.info(path);

    const [isLoaded, setIsLoaded] = useState(false);
    const [updateList, setUpdateList] = useState([]);
    const [total, setTotal] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);

    useEffect(() => {
        const fetchUpdatingList = async () => {
            try {

                const { data } = await axiosClient.get(`${url}`);
                // console.info(url);
                if (data) {
                    setIsLoaded(true);
                    if (data.length > 0) {
                        setUpdateList(data);
                    }
                    else if (data.data.length > 0) {
                        setUpdateList(data.data);
                        setTotal(data.total);
                        setCurrentPage(data.currentPage);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUpdatingList();

        const autoFetch = setInterval(() => {
            if (!isLoaded) {
                fetchUpdatingList();
            }
        }, 3000);

        if (isLoaded) clearInterval(autoFetch);

        return () => {
            clearInterval(autoFetch);
        }

    }, [isLoaded, path, url])


    const showUpdatingList = (updateList, mode) => {
        let max = 0;
        let result = [];
        if (mode === 'full') max = updateList.length - 1;
        else max = updateList.length < 12 ? updateList.length : 11;
        for (let i = 0; i <= max; i++) {
            result.push(<div className="col lg-3 md-4 c-6 c-12 update-item ta-anime" key={i}>
                <CardAnime anime={updateList[i]} type="new-update" />
            </div>)
        }
        return result;

    }

    return (
        <div className="grid update ta-section">
            <div className="card-title">
                <div className="card-title"><Link to={path}>{title}</Link></div>
                {title === "Bảng xếp hạng" && <div className="card-option">
                    <Link to="/bang-xep-hang/ngay"  className={url.split('/')[2] === 'ngay' && "active"}>Ngày</Link>
                    <Link to="/bang-xep-hang/tuan"  className={url.split('/')[2] === 'tuan' && "active"}>Tuần</Link>
                    <Link to="/bang-xep-hang/thang" className={url.split('/')[2] === 'thang' && "active"}>Tháng</Link>
                </div>}
            </div>
            <div className="row">

                {isLoaded && updateList.length > 0 ? showUpdatingList(updateList, mode) : [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                    return <SkeletonCardAnime key={n} />
                })}

            </div>

            {!mode && <div className="ta-more-btn update">
                <Link to="/moi-cap-nhat">Xem tất cả</Link>
            </div>}

            {mode && (title !== 'Mới cập nhật' && title !== 'Hôm nay xem gì???' && title !== "Bảng xếp hạng") && <Pagination total={total} current={currentPage} quantity={24} genre={path} />}

        </div>
    )
};

// Update.propTypes = {

// };

export default Update;