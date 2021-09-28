import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import CardAnime from '../components/CardAnime/CardAnime';
import SkeletonCardAnime from '../components/Skeleton/SkeletonCardAnime';
import useQuery from '../hooks/useQuery';
import LazyLoad, { forceCheck, forceVisible} from 'react-lazyload';

function ResultSearchPage({ match }) {
    localStorage.removeItem('comment');

    let query = useQuery();
    forceCheck(); forceVisible();
    const [isLoaded, setIsLoaded] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        const q = query.get("q");
        const fetchList = async () => {
            try {
                const { data } = await axiosClient.get(`/search?q=${q}&limit=3000`);
                // console.info(data);
                if (data) {
                    setIsLoaded(true);
                    setList(data);
                }

            } catch (error) {
                console.info(error)
            }
        }

        fetchList();

        const autoFetch = setInterval(() => {
            if (!isLoaded) fetchList();
        }, 5000);

        return () => {
            clearInterval(autoFetch);
        }

    }, [isLoaded, query])

    const showList = (list) => {
        return list.map((item, index) => {
            return <div className="col lg-3 md-4 c-6 c-12 update-item ta-anime" key={index}>
                <LazyLoad>
                    <CardAnime anime={item} type="new-update" />
                </LazyLoad>
            </div>
        })

    }

    return (
        <div className="grid update ta-section">
            <div className="card-title">{`Kết quả tìm kiếm cho: ${query.get("q")}`}</div>
            <div className="row">

                {isLoaded && list.length > 0 ? showList(list) : [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                    return <SkeletonCardAnime key={n} />
                })}

            </div>
        </div>
    )
}

export default ResultSearchPage
