import React, { useEffect, useState } from 'react'
import Anime from '../components/Contents/UserManager/Anime'
import Information from '../components/Contents/UserManager/Information';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';


function UserPage({ match, type }) {

    const history = useHistory();

    const [title, setTitle] = useState(null);
    const [list, setList] = useState([]);
    localStorage.removeItem('comment');

    const user = useSelector(state => state.user);
    const watch = useSelector(state => state.watch);

    useEffect(() => {
        if (!user.username) {
            history.push('/')
        }

    }, [history, user.username])

    useEffect(() => {
        if (match.path === '/phim-da-thich') {
            setTitle('Phim đã thích');
            const newList = watch.liked;
            setList(newList)
        }
        else if (match.path === '/phim-da-xem') {
            setTitle('Phim đã xem');
            const newList = watch.viewed;
            setList(newList)
        }
        else if (match.path === '/phim-dang-theo-doi') {
            setTitle('Phim đang theo dõi');
            const newList = watch.following;
            setList(newList)
        }
        else if (match.path === '/sua-thong-tin') {
            setTitle('SỬA THÔNG TIN');
        }
        else if (match.path === '/doi-mat-khau') {
            setTitle('ĐỔI MẬT KHẨU');
        }
    }, [match.path, watch.following, watch.liked, watch.viewed])


    return (
        <div className="user-manager">
            {type === "watch" && title && <Anime title={title} list={list} />}
            {type === "information" && title && <Information title={title} />}
        </div>
    )
}

export default UserPage
