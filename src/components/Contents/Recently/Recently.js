/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import './Recently.css';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { Link } from 'react-router-dom';

const Recently = props => {
    let count = 0;

    let recentlyList = JSON.parse(localStorage.getItem('watch'))?.viewed || [];

    const { width: windowWidth } = useWindowDimensions();

    const [widthItem, setWidthItem] = useState(null);
    useEffect(() => {
        const wrapCarousels = document.querySelector('.ta-slider-wrap');
        const maxWidth = wrapCarousels?.clientWidth;
        handleChangeSlide(0);

        if (windowWidth < 1024 && windowWidth >= 724) setWidthItem(maxWidth / 3);
        else if (windowWidth < 724) setWidthItem(maxWidth / 2);
        else setWidthItem(maxWidth / 4);

        const nextBtnElement = document.querySelector('.ta-btn-next');
        const prevBtnElement = document.querySelector('.ta-btn-prev');
        if (recentlyList.length < 4) {
            nextBtnElement?.classList.add('hide');
            prevBtnElement?.classList.add('hide');
            return;
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowWidth]);

    const handleChangeSlide = (num) => {
        if (recentlyList.length < 5) return;
        const sliderElement = document.querySelector('.ta-slider-carousels');
        const slideItemElements = document.querySelectorAll('.ta-slider-item');
        const nextBtnElement = document.querySelector('.ta-btn-next');
        const prevBtnElement = document.querySelector('.ta-btn-prev');
       
        if (sliderElement && slideItemElements) {
            if (num > 0) count += num;
            else count -= num;
            console.info(count)
            if (count < 0) count = 0;
            if (count > slideItemElements.length - 4) count = slideItemElements.length - 4;

            if (count === slideItemElements.length - 4) nextBtnElement.classList.add('hide');
            else nextBtnElement.classList.remove('hide');

            if (count === 0) prevBtnElement.classList.add('hide');
            else prevBtnElement.classList.remove('hide');

            // console.log(count);
            sliderElement.style.transform = `translateX(${-slideItemElements[0].clientWidth * count}px)`;
            sliderElement.style.transition = 'transform 0.3s linear';
        }

    }

    const showSlider = (recentlyList) => {
        return recentlyList.map((item, index) => {
            return <li className="ta-slider-item" key={index} style={{ width: `${widthItem}px` }}>
                <Link to={item.link} className="ta-slider-item--link">
                    <div className="ta-slider-item--name">
                        <div className="slider-item--name">{item.film_name}</div>
                        <div className="slider-item--episode">{item.full_name}</div>
                    </div>
                    <div className="ta-slider-item--img">
                        <img src={item.thumbnail_small} alt="img" style={{ width: `${widthItem - 6}px` }} className="ta-slider-item--img-inner" />
                    </div>
                    <div className="ta-slider-item--play">
                        <i className="fas fa-play-circle"></i>
                    </div>
                </Link>
            </li>
        })
    }

    return (
        <div className={`ta-slider ${recentlyList ? '' : 'hide'}`}>
            {recentlyList.length > 0 && <div className="ta-slider-wrap">
                <div className="ta-slider-title">Xem gần đây</div>
                <ul className="ta-slider-carousels">
                    {showSlider(recentlyList)}
                </ul>
                <div className="ta-btn-prev hide ta-btn" onClick={() => handleChangeSlide(-3)}>
                    <i className="fas fa-chevron-left"></i>
                </div>
                <div className="ta-btn-next ta-btn" onClick={() => handleChangeSlide(3)}>
                    <i className="fas fa-chevron-right"></i>
                </div>

            </div>}
        </div>
    );
};

Recently.propTypes = {

};

export default Recently;