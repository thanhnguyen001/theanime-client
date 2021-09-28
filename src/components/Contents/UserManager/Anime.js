import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFollowing, addLiked, addViewed } from '../../../reducers/watchReducer';
// import PropTypes from 'prop-types';
import './Anime.css';

function Anime(props) {

    const dispatch = useDispatch();

    const { title, list } = props;

    let viewMode = useSelector(state => state.viewMode);
    if (JSON.parse(localStorage.getItem('viewMode'))) viewMode = JSON.parse(localStorage.getItem('viewMode'));

    const showAnime = (list) => {
        return list.map((item, index) => {
            return <tr className="table-row" style={{ color: `${viewMode.textColor}` }} key={index}>
                <td className="anime-stt">{index + 1}</td>
                <td className="anime-thumbnail">
                    <div className="anime-img">
                        <Link to={title === "Phim đã xem" ? item.link : item.slug}>
                            <img alt="img" src={item.thumbnail || item.thumbnail_medium} />
                        </Link>
                    </div>
                </td>
                <td className="anime-info">
                    <div className="anime-info--wrap">
                        <Link to={title === "Phim đã xem" ? item.link : item.slug} className="anime-name" style={{ color: `${viewMode.textColor}` }}>
                            {title === "Phim đã xem" ? item.film_name : item.name}
                        </Link>
                    </div>
                </td>
                <td className="anime-time">{title === "Phim đã xem" ? item.full_name : item.time}</td>

                <td className="anime-delete" onClick={() => handleDeleteAction(item)}>Xóa</td>
            </tr>
        })
    }

    const handleDeleteAction = (item) => {

        if (title === "Phim đã xem") dispatch(addViewed({ ...item, isAdd: false }));
        else if (title === "Phim đã thích") dispatch(addLiked({ anime: { ...item }, isAdd: true }));
        else dispatch(addFollowing({ anime: { ...item }, isAdd: true }));
    }

    return (
        <div className="user-anime">
            <div className="table-title" style={{ color: `${viewMode.textColor}` }}>{title}</div>
            <table className="table">
                <thead className="table-heading">
                    <tr className="table-row" style={{ color: `${viewMode.textColor}` }}>
                        <th className="table-head anime-stt">STT</th>
                        <th className="table-head anime-thumbnail">Hình Ảnh</th>
                        <th className="table-head anime-info">Tên</th>
                        <th className="table-head anime-time">Thời Lượng</th>
                        <th className="table-head anime-delete">Xóa</th>
                    </tr>
                </thead>

                <tbody className="table-body">

                    {list.length > 0 && showAnime(list)}
                    {list.length === 0 && <div className="nothing">Chưa có phim nào @@</div>}
                </tbody>
            </table>
        </div>
    )
}

Anime.propTypes = {

}

export default Anime

