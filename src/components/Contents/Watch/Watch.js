import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { addComment } from '../../../reducers/commentReducer';
import SkeletonVideo from '../../Skeleton/SkeletonVideo';
import Comment from './Comment';
import './Watch.css';
import { compareTime } from '../../../utils';
import { addFollowing, addLiked, addViewed } from '../../../reducers/watchReducer';

function Watch({ animeSlug, episode, history }) {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    // console.info(user)
    const [isLoaded, setIsLoaded] = useState(false);
    const [video, setVideo] = useState('');
    // const [episodes, setEpisodes] = useState([]);
    const [mode, setMode] = useState(0);
    const [currentEpisode, setCurrentEpisode] = useState(0);
    const [currentAnime, setCurrentAnime] = useState(null);
    const [isComing, setIsComing] = useState(false);
    const [listComments, setListComments] = useState(JSON.parse(localStorage.getItem('comment')) || []);

    const { width: windowWidth } = useWindowDimensions();

    useEffect(() => {

        if (windowWidth <= 1023) {
            if (mode === 0) { setMode(2); changeMode(2) }
            if (mode === 1) { setMode(4); changeMode(4) }

        }
        else {
            if (mode === 2 || mode === 3) { setMode(0); changeMode(0) }
            if (mode === 4) { setMode(1); changeMode(1) }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowWidth])

    let viewMode = useSelector(state => state.viewMode);
    if (JSON.parse(localStorage.getItem('viewMode'))) viewMode = JSON.parse(localStorage.getItem('viewMode'));

    // console.log(animeSlug, episode)
    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const { data, success } = await axiosClient.get(`/${animeSlug}`);
                // console.info(data)
                if (data) {
                    setIsLoaded(true);
                    setCurrentAnime(data);

                    if (data.episodes.length > 0) {
                        if (data.time.includes('phút')) {
                            getVideo(data.id, 0);
                            return;
                        }
                        if (episode) {
                            // Set Video
                            const epis = Number.parseInt(episode.split('-')[1]);
                            // console.info(epis)
                            if (isNaN(epis)) {
                                getVideo(data.id, 0);
                                return;
                            }
                            else if (!isNaN(epis)) {
                                const videoSortName = data.episodes.find(item => item.name === epis).name;
                                if (videoSortName) {
                                    getVideo(data.id, videoSortName - 1, videoSortName - 1)
                                }
                            }
                            else getVideo(data.id, 0);
                        }
                    }
                    else setIsComing(true);
                }
                else if (!success) history.push('/not-found')

            } catch (error) {
                console.info(error);
            }
        };
        fetchAnime();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animeSlug, episode])

    const getVideo = async (animeId, videoId, currentEpisode) => {
        const vid = await axiosClient.get(`/watch/${animeId}/episodes/${videoId}`);
        if (vid) {
            if (vid.data.sources) setVideo(vid.data.sources);
            setCurrentEpisode(currentEpisode);

            dispatch(addViewed({ ...vid.data, animeId, isAdd: true }))
        }
    }
    // Fetch comment
    useEffect(() => {
        if (mode === 1 || mode === 4) {
            const fetchComment = async () => {
                try {
                    const { comment } = await axiosClient.get(`/comment/${currentAnime.id}`);
                    // console.info(comment);
                    if (comment) setListComments(comment);
                    dispatch(addComment(comment));
                } catch (error) {
                    console.info(error)
                }
            }
            fetchComment();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAnime, mode])

    const changeMode = (num) => {
        const separateElement = document.querySelector('.episodes-title-separate');
        const separateMdElement = document.querySelector('.episodes-title-separate.md');
        if (num === 0) {
            setMode(0);
            separateElement.style.left = '17%';
            separateElement.style.width = '30%';
        }
        else if (num === 1) {
            setMode(1);
            separateElement.style.left = '63.2%';
            separateElement.style.width = '20%';
        }
        else if (num === 2) {
            setMode(2);
            separateMdElement.style.left = '0';
            separateMdElement.style.width = '16%';
        }
        else if (num === 3) {
            setMode(3);
            if (windowWidth < 480) {
                separateMdElement.style.left = '40%';
                separateMdElement.style.width = '16%';
                return;
            }
            separateMdElement.style.left = '30%';
            separateMdElement.style.width = '11%';
        }
        else {
            setMode(4);
            if (windowWidth < 480) {
                separateMdElement.style.left = '84%';
                separateMdElement.style.width = '16%';
                return;
            }
            separateMdElement.style.left = '90%';
            separateMdElement.style.width = '10%';
        }
    }

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(",");
    }

    const handleActiveEpisode = (e) => {
        e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    }
    useEffect(() => {
        const activeEpisode = document.querySelector(`.episodes-item.index-${currentEpisode + 1}`);
        if (activeEpisode) {
            activeEpisode.classList.add('active');
            activeEpisode.scrollIntoView({
                behavior: 'smooth',
                block: "center"
            })
        }

        window.scrollTo(0,0)
        // console.info(currentEpisode)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentEpisode])
    const showEpisodes = (episodes) => {

        return episodes.map((item, index) => {
            return <Link to={item.link} onClick={(e) => handleActiveEpisode(e)}
                className={`episodes-item index-${index + 1} ${index === currentEpisode && 'active'}`} key={index}>
                <div className="episodes-item--thumbnail">
                    <img alt="" src={item.thumbnail_small} />
                </div>
                <div className="episodes-item--info" style={{ color: `${viewMode.textColor}` }}>
                    <div className="episodes-item--name">{item.full_name}</div>
                    <div className="episodes-item--views">{numberWithCommas(item.views)} luợt xem</div>
                </div>
            </Link>
        })
    }

    const handleShowInput = (index, user) => {
        if (!user.username) {
            alert('Bạn phải đăng nhập mới có thể sử dụng tính năng này');
            return;
        }
        const selectorInput = `.comment-input.level2.index-${index}`;
        const inputElement = document.querySelector(selectorInput);
        const cm_level2Element = document.querySelector(`.comment-level2.index-${index}`);
        cm_level2Element.style.display = 'block';

        if (inputElement) {
            inputElement.classList.add('active');
            inputElement.scrollIntoView({
                behavior: 'smooth',
                block: "nearest"
            })
        }

    }

    const showCommentLevel2 = (index) => {
        const cm_level2Element = document.querySelector(`.comment-level2.index-${index}`);
        cm_level2Element.style.display = 'block';
        const replyE = document.querySelector(`.answer-quantity.index-${index}`);
        replyE.style.display = 'none';

    }

    const showComments = (listComment) => {

        return listComment.map((item, index) => {
            return <div className="comment-item" key={index}>
                <div className="user-avatar">
                    <img alt="" src={item.user?.avatar} />
                </div>
                <div className="w-user-info" style={{ color: `${viewMode.textColor}` }}>
                    <div className="user-display-name">{item.user?.displayName}</div>
                    <div className="user-commented">{item.content}</div>
                    <div className="user-reply">
                        <i className="fas fa-comments"></i>
                        <span className="reply" onClick={() => handleShowInput(index, user)}>Trả lời</span>
                        {item.cm_level2?.length > 0 && <span className={`answer-quantity index-${index}`} onClick={() => showCommentLevel2(index)}>{`${item.cm_level2?.length} trả lời`}</span>}
                        <i className="far fa-clock"></i>
                        <span className="commented-time">{compareTime(item.createdAt)}</span>
                    </div>

                    <div className={`comment-level2 index-${index}`}>
                        {item.cm_level2?.map((one, idx) => {
                            return <Comment index={index} key={idx} user={user} comment={one} onClick={handleShowInput} />
                        })}
                    </div>

                    <div className={`comment-input level2 index-${index}`}>
                        <input type="text" className="enter-input-level2" onFocus={() => handleEnterCommentLevel2(index, item._id)} />
                    </div>
                </div>
            </div>
        })
    }

    const handleEnterCommentLevel2 = (index, commentId) => {
        const inputLevel2 = document.querySelector(`.comment-input.level2.index-${index} input`);
        inputLevel2.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 && e.target.value !== '') {
                postCommentLv2(currentAnime?.id, commentId, inputLevel2.value);
                // console.info(commentId)
                inputLevel2.value = '';
            }
        })
    }
    const postCommentLv2 = async (animeId, commentId, content) => {
        const url = `/comment/${animeId}/${commentId}`;
        const { comment } = await axiosClient.post(url, { content });
        if (comment) {
            // console.info(comment);
            // console.info(listComments);
            const newList = [...listComments];
            let idx = 0;
            for (let i = 0; i < listComments.length; i++) {
                if (listComments[i]._id === comment._id) {
                    idx = i; break;
                }
            }
            newList.splice(idx, 1, comment);
            // console.info(newList)
            setListComments(newList);
            dispatch(addComment(newList));

        }
    }
    const handleChooseEpisode = (e, status) => {
        const list = currentAnime.episodes;
        const chooseInput = e.target;
        if (!status) return;
        chooseInput.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                const value = Number.parseInt(e.target.value);
                if (value < list.length) {
                    history.push(`${list[value - 1].link}`)
                }
                else alert('Oh! Có vẻ bạn đã nhập sai số tập phim. Hãy thử lại nhé!!!')

                chooseInput.removeEventListener('keypress', () => {

                });
            }
        })
    }

    const postComment = async (animeId, content, newList) => {
        const url = `/comment/${animeId}`;
        // console.info(newList)
        const { comment } = await axiosClient.post(url, { content });
        if (comment) {
            newList = [...comment, ...newList];
            // console.info(newList)
            setListComments(newList);
            dispatch(addComment(newList));
        }
    }

    const handleEnterComment = async (e) => {
        const inputEnterCm = e.target;
        inputEnterCm.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 && inputEnterCm.value !== '') {
                if (!user.username) {
                    alert("Bạn cần đăng nhâp để bình luận");
                    return;
                }
                // console.info(inputEnterCm.value);
                const newList = JSON.parse(localStorage.getItem('comment'));
                postComment(currentAnime?.id, inputEnterCm.value, newList);
                inputEnterCm.value = '';
            }
        })
    }

    const handleAction = (num) => {
        if (!user.username) {
            alert('Bạn cần đăng nhâp để thực hiện tính năng này');
            return;
        }
        if (num === 2) {
            const heartElements = document.querySelectorAll('.introduce-like i');
            [...heartElements].map(item => item.classList.toggle('hide'));
            let isAdd = false;
            if (!heartElements[0].className.includes('hide')) isAdd = true;
            dispatch(addLiked({ isAdd, anime: currentAnime, slug: animeSlug }))
        }
        else if (num === 3) {
            const bellElements = document.querySelectorAll('.introduce-following i');
            [...bellElements].map(item => item.classList.toggle('hide'));

            let isAdd = false;
            if (!bellElements[0].className.includes('hide')) isAdd = true;
            dispatch(addFollowing({ isAdd, anime: currentAnime, slug: animeSlug }))
        }
        else return;
    }

    const handleEndedVideo = () => {
        // console.info(currentAnime);
        // console.info(currentEpisode);
        if (currentEpisode < currentAnime.episodes.length - 1) {
            const nextVideo = currentAnime.episodes[currentEpisode + 1].link;
            history.push(nextVideo);
        }
        else return;
    }

    return (
        <div className="watch-wrap">
            <div className="ta-projector">
                <div className="ta-video">
                    {video.videoSource && <video id="video" controls type="video/mp4" autoPlay preload="auto" onEnded={handleEndedVideo}
                        src={video ? video.videoSource : ''} webkit-playsinline="true" >
                    </video>}
                    {!isLoaded && <SkeletonVideo />}
                    {isComing && <div className="up-coming">Đây là phim sắp chiếu, hãy bấm nút theo dõi để nhận thông báo khi có tập mới nhé!</div>}
                </div>

                <div className="ta-episodes">
                    <div className="ta-episodes--wrap">
                        <div className="episodes-title" style={{ color: `${viewMode.textColor}` }}>
                            <div className="episodes-title-item" onClick={() => changeMode(0)}>Danh sách tập</div>
                            <div className="episodes-title-item" onClick={() => changeMode(1)}>Bình luận</div>
                            <div className="episodes-title-separate" ></div>
                        </div>

                        {mode === 1 && <div className="comment-input">
                            <input type="text" name="content"
                                placeholder="Nhấn vào đây để bình luận"
                                onFocus={(e) => handleEnterComment(e)}
                            />
                        </div>}
                        {mode === 0 && <div className="episodes-input comment-input" >
                            <input type="number"
                                placeholder={`Nhập số tập (tổng ${currentAnime?.episodes?.length > 0 ? currentAnime.episodes.length : "0"} tập)`}
                                onFocus={(e) => handleChooseEpisode(e)}
                            />
                        </div>}

                        <div className="episodes-list comment-list">
                            {mode === 0 && currentAnime && showEpisodes(currentAnime.episodes)}
                            {mode === 1 && listComments.length > 0 && showComments(listComments)}
                        </div>

                    </div>
                </div>

            </div>

            {/* Description */}

            {currentAnime && currentEpisode >= 0 && <div className="ta-introduce">
                <div className="ta-introduce-wrap" style={{ color: `${viewMode.textColor}` }}>
                    <div className="introduce-name-anime">{currentAnime.name}</div>
                    <div className="introduce-name-episode">{currentAnime.episodes[currentEpisode]?.full_name}</div>
                    <div className="introduce-views">{currentAnime.episodes[currentEpisode]?.views} lượt xem</div>

                    <div className="introduce-action">
                        <div className="introduce-like introduce-action-part" onClick={() => handleAction(2)}>
                            <i className="fas fa-heart hide"></i>
                            <i className="far fa-heart"></i>
                            <span>Thích</span>
                        </div>

                        <div className="introduce-following introduce-action-part" onClick={() => handleAction(3)}>
                            <i className="fas fa-bell hide"></i>
                            <i className="far fa-bell"></i>
                            <span>Theo dõi</span>
                        </div>

                        <div className="introduce-share introduce-action-part">
                            <i className="fas fa-share-alt"></i>
                            <span>Share</span>
                        </div>
                    </div>

                    <div className="introduce-genre">
                        <span>Thể loại: </span>
                        {currentAnime.genre.map((item, index) => {
                            return <Link to={`/anime/${item.slug}/trang-1`} key={index} style={{ color: `${viewMode.textColor}` }}>{`${item.genre}, `}</Link>
                        })}
                    </div>
                    <div className="introduce-collection">
                        <span>Bộ sưu tập: </span>
                        {currentAnime.subTeam.map((item, index) => {
                            return <span key={index}>{`${item} `}</span>
                        })}
                    </div>
                    <div className="introduce-description">
                        {currentAnime.description}
                    </div>
                </div>
            </div>}

            {/* <= 1024px -----------------------------------------------------------------------------*/}

            <div className="ta-information-md">

                <div className="episodes-title md" style={{ color: `${viewMode.textColor}` }}>
                    <div className="episodes-title-item episodes-title-list" onClick={() => changeMode(2)}>Danh sách tập</div>
                    <div className="episodes-title-item episodes-title-info" onClick={() => changeMode(3)}>Thông tin</div>
                    <div className="episodes-title-item episodes-title-comment" onClick={() => changeMode(4)}>Bình luận</div>
                    <div className="episodes-title-separate md"></div>
                </div>

                {mode === 2 && <div className="episodes-input comment-input" >
                    <input type="number"
                        placeholder={`Nhập số tập (tổng ${currentAnime?.episodes?.length > 0 ? currentAnime.episodes.length : "0"} tập)`}
                        onFocus={(e) => handleChooseEpisode(e, false)} />
                </div>}

                {mode === 4 && <div className="comment-input">
                    <input type="text" placeholder="Nhập bình luận ở đây"/>
                </div>}

                {mode !== 3 && <div className="episodes-list comment-list">
                    {mode === 2 && currentAnime && showEpisodes(currentAnime.episodes)}
                    {mode === 4 && listComments.length > 0 && showComments(listComments)}
                </div>}

                {/* description */}
                {currentAnime && currentEpisode >= 0 && <div className="ta-introduce-md">
                    <div className="ta-introduce-wrap" style={{ color: `${viewMode.textColor}` }}>
                        <div className="introduce-name-anime">{currentAnime.name}</div>
                        <div className="introduce-name-episode">{currentAnime.episodes[currentEpisode]?.full_name}</div>
                        <div className="introduce-views">{currentAnime.episodes[currentEpisode]?.views} lượt xem</div>

                        <div className="introduce-action">
                            <div className="introduce-like introduce-action-part">
                                <i className="fas fa-heart hide"></i>
                                <i className="far fa-heart"></i>
                                <span>Thích</span>
                                <span>213</span>
                            </div>

                            <div className="introduce-following introduce-action-part">
                                <i className="fas fa-bell hide"></i>
                                <i className="far fa-bell"></i>
                                <span>Theo dõi</span>
                                <span>213</span>
                            </div>

                            <div className="introduce-share introduce-action-part">
                                <i className="fas fa-share-alt"></i>
                                <span>Share</span>
                                <span>213</span>
                            </div>
                        </div>

                        <div className="introduce-genre">
                            <span>Thể loại: </span>
                            {currentAnime.genre.map((item, index) => {
                                return <Link to={`/${item.url}`} key={index} style={{ color: `${viewMode.textColor}` }}>{`${item.genre}, `}</Link>
                            })}
                        </div>
                        <div className="introduce-collection">
                            <span>Bộ sưu tập: </span>
                            {currentAnime.subTeam.map((item, index) => {
                                return <span key={index}>{`${item} `}</span>
                            })}
                        </div>
                        <div className="introduce-description">
                            {currentAnime.description}
                        </div>
                    </div>
                </div>}


            </div>

        </div>
    )
}

export default withRouter(Watch)
