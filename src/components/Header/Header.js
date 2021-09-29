/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import genres from '../../constant/genres';
import useClickOutsideMe from '../../hooks/useClickOutsideMe';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { signedIn } from '../../reducers/userReducer';
import { changeColor } from '../../reducers/viewModeReducer';
import noAvatar from '../../static';
import { UtilHightLightName } from '../../utils';
import Loading from '../Loading/Loading';
import SignForm from '../SignForm/SignForm';
import UserForm from '../UserForm/UserForm';
import './Header.css';

function Header() {
    const history = useHistory();
    const dispatch = useDispatch();

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    // User login ?
    const [user, setUser] = useState(useSelector(state => state.user))
    // console.info(useSelector(state => state.viewMode))
    // set Color depend on view mode
    const viewModeStore = JSON.parse(localStorage.getItem('viewMode')) || {
        bgColor: 'var(--bg-header-light)',
        textColor: "var(--black-color)"
    }
    const [bgColor, setColorMode] = useState(viewModeStore.bgColor);
    const [textColor, setTextColor] = useState(viewModeStore.textColor);
    const [searchFormColor, setSearchFormColor] = useState("rgba(255,255,255, 1)");
    // const [transparentColor, setTransparentColor] = useState("rgba(0,0,0, 0.5)");

    // list anime from search
    const [keyword, setKeyword] = useState('');
    const [listAnime, setListAnime] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use hook ClickOutsideMe
    const signFormRef = useRef(null);
    useClickOutsideMe(signFormRef, '.header-form');
    const headerSidebarRef = useRef(null);
    useClickOutsideMe(headerSidebarRef, '.header-sidebar');

    // Set dimensions depend on window dimensions
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const handleChangeMode = () => {
        const modes = $$(".change-mode i");
        [...modes].map(item => {
            return item.classList.toggle('hide');
        });
        if (bgColor === "var(--bg-header-dark)") {
            setColorMode("var(--bg-header-light)");
            setTextColor("var(--black-color)");
            setSearchFormColor("rgba(255,255,255, 1)");
            // setTransparentColor("rgba(0,0,0, 0.3)");

            const payload = {
                bgColor: "var(--bg-header-light)",
                textColor: "var(--black-color)"
            };
            dispatch(changeColor(payload));
        }
        else {
            setColorMode("var(--bg-header-dark)");
            setTextColor("var(--text-color)");
            setSearchFormColor("rgba(0,0,0, 0.8)");
            // setTransparentColor("rgba(255,255,255, 1)");

            const payload = {
                bgColor: "var(--bg-header-dark)",
                textColor: "var(--text-color)"
            };
            dispatch(changeColor(payload));
        }
    }

    const handleToggleForm = (status) => {
        const formElement = $('.header-form');
        if (status) formElement.classList.add('active');
        else formElement.classList.remove('active');
    }
    const handleToggleSidebar = (status) => {
        const sidebarElement = $('.header-sidebar');
        const navbarSearch = $('.navbar-search');

        if (status) {
            sidebarElement.classList.add('active');
            navbarSearch.classList.add('active');
        }
        else {
            sidebarElement.classList.remove('active');
            navbarSearch.classList.remove('active');
            navbarSearch.style.left = '-310px';
            setTimeout(() => {
                navbarSearch.style.transition = 'none'
            }, 2000)
        }
    };
    // handle search input
    useEffect(() => {
        const searchElement = document.querySelector('.navbar-search');
        const sideBar = document.querySelector('.header-sidebar');
        if (windowWidth > 1023) {
            searchElement.classList.remove('active');
            sideBar.classList.remove('active');
        }
    }, [windowWidth])

    const handleToggleGenres = () => {
        const genresElement = $('.sidebar-genres');
        genresElement.classList.toggle('active')
    };

    const handleHighligh = (name, keyword) => {
        const result = UtilHightLightName(name, keyword);
        return result;
    }

    // Handle Call API
    useEffect(() => {
        const fetchListAnime = async () => {
            try {
                if (keyword === '') {
                    setIsLoading(true);
                    setListAnime([]);
                    return;
                }
                const { data } = await axiosClient.get(`/search?q=${keyword}`);
                // console.log(data);
                if (data) {
                    setIsLoading(false);
                    setListAnime(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchListAnime();

    }, [keyword])
    const handleKeyWord = async (e) => {
        const value = e.target.value;
        setKeyword(value);
    }

    const handleSubmitSearch = (e) => {
        let q = '';
        if (e.target.classList.contains('search-icon')) {
            q = document.querySelector('input[name="q"]').value;
        }
        else {
            e.preventDefault();
            q = e.target.q.value;
        }
        history.push(`/search?q=${q}`);

    }

    const showAnimeFromSearch = (list) => {
        if (list.length === 0) return;
        return list.map((item, index) => <li key={index} className="navbar-anime-item" data-id={item.id} data-slug={item.slug}>
            <Link to={`/${item.slug}`} key={index} className="navbar-anime-item-link" style={{ color: `${textColor}` }}>
                <div className="navbar-anime-item--thumbnail">
                    <img className="navbar-anime-item-img" src={item.thumbnail} alt="thumbnail" />
                </div>
                <div className="navbar-anime-item--precis">
                    <div className="navbar-anime-item--name">{handleHighligh(item.name, keyword)}</div>
                    <div className="navbar-anime-item--views">{item.views} lượt xem</div>
                </div>
                <div className="navbar-anime-item--time">{item.time}</div>
            </Link>
        </li>)
    };

    const showGenres = (genres) => {
        return genres.map((item, index) => <li key={index} className="genres-item" >
            <Link key={index} className="genres-item-link" style={{ color: `${textColor}` }}
                onClick={() => handleToggleSidebar(false)}
                to={`/anime/${item.slug}/trang-1`} >{item.genre}
            </Link>
        </li>)
    }

    const setHeightSearchForm = (listAnime) => {
        let result = 50;
        if (listAnime.length > 0) {
            if (listAnime.length > 5) {
                result = windowHeight - 120;
            }
            else {
                result = listAnime.length * 64;
            }
        }
        return result;
    }

    const handleUpdateAvatar = (num) => {
        const inputAvatar = document.querySelector('.update-avatar-input');
        const bgAvatar = document.querySelector('.update-avatar-bg');
        const updateSuccess = document.querySelector('.update-success');
        if (num === 1) {
            inputAvatar.style.display = 'block';
            bgAvatar.style.display = 'block';
        }
        else if (num === 0) {
            inputAvatar.style.display = 'none';
            bgAvatar.style.display = 'none';
        }
        inputAvatar.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {

                axiosClient.patch('/user/update-avatar', { avatar: e.target.value })
                    .then(res => {
                        // console.info(res);
                        let payload = {
                            username: res.user.username,
                            email: res.user.email,
                            displayName: res.user.displayName,
                            gender: res.user.gender,
                            avatar: res.user.avatar ? res.user.avatar : '',
                            accessToken: res.accessToken,
                        }
                        setUser(payload)
                        dispatch(signedIn(payload));
                        e.target.value = '';
                        if (inputAvatar && bgAvatar && updateSuccess) {
                            inputAvatar.style.display = 'none';
                            bgAvatar.style.display = 'none';
                            updateSuccess.style.display = 'block';
                            setTimeout(() => {
                                updateSuccess.style.display = 'none';
                            }, 2000)
                        }
                    })
            }
            inputAvatar.removeEventListener("keypress", () => {

            })
        })
    }

    return (
        <div className="header" style={{ backgroundColor: `${bgColor}` }}>
            <div className="header-wrap" >
                <div className="header-logo">
                    <a href="/" >
                        <div className="header-logo--img">
                            <img src="https://scontent.fhan14-2.fna.fbcdn.net/v/t1.15752-9/240974874_2444502772359907_3560838083461082269_n.png?_nc_cat=106&ccb=1-5&_nc_sid=ae9488&_nc_ohc=6cv0d4H7FgIAX9Me_f9&_nc_oc=AQl0O-ugMVXT_UXXwTK5TsDE-mFdTXq2imOJgtp3W9QGVtYdxzxHo0ApUp6GBn0kbdw&tn=L82J63e4MRFcMsEH&_nc_ht=scontent.fhan14-2.fna&oh=5539b727798d2c04afab592a7246ea2c&oe=61663E68" alt="TheAnime" />
                        </div>
                    </a>
                </div>
                {/* Navbar Search */}
                <div className="navbar-search" >

                    <div className="navbar-search--wrap">
                        <form className="navbar-search--form" onSubmit={handleSubmitSearch}>
                            <input className="search-input" type="text" name="q" placeholder="Tên anime... " value={keyword} onChange={handleKeyWord} />
                            <div className="navbar-search--anime"
                                style={{ backgroundColor: `${searchFormColor}`, maxHeight: `${setHeightSearchForm(listAnime)}px` }}>
                                <div className="navbar-anime--wrap" style={{ maxHeight: `${windowHeight - 50}px` }}>
                                    {(isLoading && keyword && listAnime.length === 0) ? <Loading key={0} /> : <ul className="navbar-list-anime" style={{ height: '100%' }}>
                                        {(!isLoading && listAnime.length === 0 && keyword) ? <li key={0} style={{ color: `${textColor}` }} className="not-found">Không tìm thấy</li> : showAnimeFromSearch(listAnime)}
                                    </ul>}

                                </div>
                            </div>
                            <i className="flaticon-loupe search-icon" onClick={handleSubmitSearch}></i>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <i className="fas fa-bars header-sidebar-icon" style={{ fontSize: "2.4rem", color: `${textColor}` }} onClick={() => handleToggleSidebar(true)}></i>

                <div className="header-sidebar" ref={headerSidebarRef}>
                    <div className="header-sidebar--wrap" style={{ backgroundColor: `${searchFormColor}` }}>
                        <div className="sidebar-heading">
                            <div className="sidebar-heading--logo">
                                <img src="https://scontent.fhan14-2.fna.fbcdn.net/v/t1.15752-9/240974874_2444502772359907_3560838083461082269_n.png?_nc_cat=106&ccb=1-5&_nc_sid=ae9488&_nc_ohc=6cv0d4H7FgIAX9Me_f9&_nc_oc=AQl0O-ugMVXT_UXXwTK5TsDE-mFdTXq2imOJgtp3W9QGVtYdxzxHo0ApUp6GBn0kbdw&tn=L82J63e4MRFcMsEH&_nc_ht=scontent.fhan14-2.fna&oh=5539b727798d2c04afab592a7246ea2c&oe=61663E68" alt="TheAnime" />
                            </div>
                            <i className="fas fa-arrow-left" onClick={() => handleToggleSidebar(false)}></i>
                        </div>

                        <div className="sidebar" style={{ maxHeight: `${windowHeight}px`, overflow: 'auto' }}>
                            <div className="sidebar-menu" style={{ maxHeight: `${windowHeight - 250}px`, overflow: 'auto' }}>
                                <div className="sidebar-menu--item" style={{ color: `${textColor}` }}>
                                    <i className="fas fa-film"></i>
                                    <div className="sidebar-item--text sidebar-all">Anime</div>
                                </div>
                                <div className="sidebar-menu--item genres" style={{ color: `${textColor}` }}>
                                    <i className="fas fa-dice-six" onClick={handleToggleGenres}></i>
                                    <div className="sidebar-item--text sidebar-genre" onClick={handleToggleGenres}>Thể Loại</div>
                                </div>
                                <ul className="sidebar-genres sidebar-active" style={{ color: `${textColor}` }}>
                                    {showGenres(genres)}
                                </ul>
                                <div className="sidebar-menu--item" style={{ color: `${textColor}` }}>
                                    <i className="fab fa-hackerrank"></i>
                                    <Link to="/bang-xep-hang/ngay"
                                        style={{ color: `${textColor}` }}
                                        onClick={() => handleToggleSidebar(false)}
                                        className="sidebar-item--text sidebar-rank">BXH
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navbar */}
                <div className="header-navbar">
                    <div className="navbar--wrap">
                        <div className="navbar-nav">
                            <ul className="navbar-nav--list" style={{ color: `${textColor}` }}>
                                <li className="navbar-nav--item"><Link to="/anime/all/trang-1" style={{ color: `${textColor}` }}><p>Xem Anime</p></Link></li>
                                <li className="navbar-nav--item">
                                    <p>Thể Loại</p>
                                    <div className="navbar-genres">
                                        <ul className="navbar-genres--wrap" style={{ backgroundColor: `${bgColor}` }}>
                                            {showGenres(genres)}
                                        </ul>
                                    </div>
                                </li>
                                <li className="navbar-nav--item"><Link to="/bang-xep-hang/ngay" style={{ color: `${textColor}` }}><p>BXH</p></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="header-user">
                    <div className="header-user--wrap">
                        <div className="change-mode">
                            <div className="mode-wrap" onClick={handleChangeMode}>
                                <i className={`fas fa-sun ${bgColor === "var(--bg-header-light)" ? "" : "hide"}`}></i>
                                <i className={`fas fa-moon ${bgColor === "var(--bg-header-dark)" ? "" : "hide"}`}></i>
                            </div>
                        </div>
                        <div className="header-user--avatar" onClick={() => handleToggleForm(true)}>
                            <div className="header-user--avatar-wrap">
                                <img src={(user && user.avatar) ? user.avatar : noAvatar} alt="user-avatar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-form" ref={signFormRef} style={{ backgroundColor: `${searchFormColor}` }} >
                <div className="sign-form--header" style={{ color: `${textColor}` }}>
                    <i className="fas fa-arrow-circle-right" onClick={() => handleToggleForm(false)} ></i>
                    <div>{`Chào Mừng ${user?.displayName || 'Bạn Ghé Thăm'}!!!`}</div>
                    <div>Chúc Bạn Xem Anime Vui Vẻ</div>

                    {user?.username && <div className="update-avatar" onClick={() => handleUpdateAvatar(1)}>
                        <i className="fas fa-camera"></i>
                        {user?.avatar && <img src={user.avatar} alt="avatar" />}
                    </div>}
                    {user?.avatar && <div className="update-success">Cập nhật ảnh đại diện thành công</div>}
                    <input className="update-avatar-input" name="avatar"
                        type="text"
                        placeholder="Nhập đường dẫn đến ảnh đại diện của bạn"
                    />

                </div>
                <div className="update-avatar-bg" onClick={() => handleUpdateAvatar(0)}></div>
                {!user?.username && <SignForm textColor={textColor} />}
                {user?.username && <UserForm textColor={textColor} user={user} />}
            </div>

        </div>
    )
}



export default Header;

