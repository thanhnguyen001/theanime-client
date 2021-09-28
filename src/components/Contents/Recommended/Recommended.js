import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';
import CardAnime from '../../CardAnime/CardAnime';
import SkeletonCardAnime from '../../Skeleton/SkeletonCardAnime';

function Recommended() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [updateList, setUpdateList] = useState([]);
    const itemCurrent = useRef(0);

    useEffect(() => {
        const fetchUpdatingList = async () => {
            try {
                const { data } = await axiosClient.get('/picked');
                if (data) setIsLoaded(true);
                setUpdateList(data);
                // console.log(data);

            } catch (error) {
                console.log(error);
            }
        }

        fetchUpdatingList();

        const autoFetch = setInterval(() => {
            if (!isLoaded) fetchUpdatingList();
        }, 3000);

        if (isLoaded) clearInterval(autoFetch);

        return () => {
            clearInterval(autoFetch);
        }
    }, [isLoaded])



    const showItemFirstTime = (updateList) => {
        let max = 0;
        if (updateList.length > 0) {
            let result = [];
            max = updateList.length < 12 ? updateList.length : 11;
            itemCurrent.current = max;
            for (let i = 0; i <= max; i++) {
                result.push(<div className="col lg-3 md-4 c-6 c-12 update-item ta-anime" key={i}>
                    <CardAnime anime={updateList[i]} />
                </div>)
            }

            return result;
        }
    }

    const showUpdatingList = (updateList) => {
        if (updateList.length > 0) {
            return updateList.map((item, index) => {
                return <div className="col lg-3 md-4 c-6 c-12 update-item ta-anime" key={index}>
                    <CardAnime anime={item} />
                </div>
            })
        }
    }

    return (
        <div className="grid update ta-section">
            <div className="card-title">
                <Link to='/hom-nay-xem-gi'>Hôm nay xem gì</Link>
            </div>
            <div className="row">
                {isLoaded ? showItemFirstTime(updateList) : [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                    return <SkeletonCardAnime key={n} />
                })}
            </div>
            <div className="ta-more-btn">
                <Link to="/hom-nay-xem-gi">Xem tất cả</Link>
            </div>

        </div>
    )
}

export default Recommended
