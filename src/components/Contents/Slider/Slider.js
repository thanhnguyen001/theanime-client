import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../../../api/axiosClient';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import SkeletonSlider from '../../Skeleton/SkeletonSlider';
import './Slider.css';



function Slider() {

    const [carousels, setCarousels] = useState([]);
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [isLoaded, setIsLoaded] = useState(false);
    const [itemWidth, setItemWidth] = useState(null);

    let viewMode = useSelector(state => state.viewMode);
    if (JSON.parse(localStorage.getItem('viewMode'))) viewMode = JSON.parse(localStorage.getItem('viewMode'));

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const { data } = await axiosClient.get('/slide');
                // console.log(data);
                if (data) {
                    setIsLoaded(true);
                }
                setCarousels(data);
                setItemWidth(`${100 / (data.length + 2)}%`)

                const carouselsElement = document.querySelector('.carousels');
                const slideElement = document.querySelector('.carousels-item');
                const slideWrap = document.querySelector('.slider-wrap');
                setItemWidth(`${slideWrap.clientWidth}px`)

                if (carouselsElement) {
                    carouselsElement.style.transform = `translateX(${-slideElement.clientWidth}px)`;
                    carouselsElement.style.transition = 'transform 0.3s linear';
                }
                return data;
            } catch (error) {
                console.log(error);
            }
        }
        fetchSliders();

        return () => {
            fetchSliders();
        }

    }, [isLoaded]);

    useEffect(() => {
        const carouselsElement = document.querySelector('.carousels');
        const slideElement = document.querySelector('.carousels-item');
        if (carouselsElement && slideElement) {
            carouselsElement.style.transform = `translateX(${-slideElement.clientWidth}px)`;
            carouselsElement.style.transition = 'transform 0.3s linear';
        }

        const slideWrap = document.querySelector('.slider-wrap');
        setItemWidth(`${slideWrap.clientWidth}px`);


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowHeight, windowWidth])
    const showSlider = (carousels) => {
        let result = [];
        if (carousels.length > 0) {
            result.unshift(<li className="carousels-item" key={0} style={{ width: `${itemWidth}` }} id="last-slide">
                <a href={`/${carousels[carousels.length - 1].slug}`} className="carousels-item--link" style={{ width: `${itemWidth}` }}>
                    <div className="carousels-item--bg" style={{ backgroundImage: `url(${carousels[carousels.length - 1].thumbnail})` }}></div>
                    <img src={carousels[carousels.length - 1].thumbnail} alt="img-anime" />
                    <div className="carousels-item--name" style={{ color: `${viewMode.textColor}` }}>
                        {carousels[carousels.length - 1].name}
                    </div>
                    <div className="carousels-item--play">
                        <i className="far fa-play-circle"></i>
                    </div>
                </a>
            </li>);

            carousels.forEach((item, index) => {
                result.push(<li className="carousels-item" key={index + 1} style={{ width: `${itemWidth}` }}>
                    <a href={`/${item.slug}`} className="carousels-item--link" style={{ width: `${itemWidth}` }}>
                        <div className="carousels-item--bg" style={{ backgroundImage: `url(${item.thumbnail})` }}></div>
                        <img src={item.thumbnail} alt="img-anime" />
                        <div className="carousels-item--name" style={{ color: `${viewMode.textColor}` }}>
                            {item.name}
                        </div>
                        <div className="carousels-item--play">
                            <i className="far fa-play-circle"></i>
                        </div>
                    </a>
                </li>)
            });

            result.push(<li className="carousels-item" key={carousels.length + 1} id="first-slide" style={{ width: `${itemWidth}` }}>
                <a href={`/${carousels[0].slug}`} className="carousels-item--link" style={{ width: `${itemWidth}` }}>
                    <div className="carousels-item--bg" style={{ backgroundImage: `url(${carousels[0].thumbnail})` }}></div>
                    <img src={carousels[0].thumbnail} alt="img-anime" />
                    <div className="carousels-item--name" style={{ color: `${viewMode.textColor}` }}>
                        {carousels[0].name}
                    </div>
                    <div className="carousels-item--play">
                        <i className="far fa-play-circle"></i>
                    </div>
                </a>
            </li>);
        }

        if (windowWidth <= 1024) {
            result.shift();
            result.pop();
        }
        return result;
    }

    // Auto change slide
    const [isFirstChange, setFirst] = useState(true);

    const isPause = useRef(setTimeout(() => {
        if (isFirstChange) {
            setFirst(false);
            handleChangeSlide(1)
        }
    }, 3000));
    const count = useRef(1);

    function resetAutoChangeSlide() {
        if (isPause.current) {
            clearTimeout(isPause.current);
        }
    }
    useEffect(() => {

        resetAutoChangeSlide();
        isPause.current = setTimeout(() => {
            handleChangeSlide(1)
        }, 3000);

        return () => {
            resetAutoChangeSlide();
            clearTimeout(isPause.current)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleChangeSlide = (num, jump) => {
        resetAutoChangeSlide();
        setFirst(false);
        // console.info(count);
        const carouselsElement = document.querySelector('.carousels');
        const slideElements = document.querySelectorAll('.carousels-item');
        const dotsElements = document.querySelectorAll('.carousels-dots--item');

        if (carouselsElement && slideElements) {
            if (jump) count.current = jump;
            else count.current += num;

            if (count.current === slideElements.length + 1) return;
            if (count.current >= slideElements.length) {
                count.current--;
                return;
            }
            if (count.current < 0) {
                count.current++;
                return;
            }

            carouselsElement.style.transform = `translateX(${-slideElements[0].clientWidth * count.current}px)`;
            carouselsElement.style.transition = 'transform 0.3s linear';

            carouselsElement.addEventListener('transitionend', () => {
                if (slideElements[count.current].id === 'first-slide') {
                    count.current = 1;
                    carouselsElement.style.transition = 'none';
                    carouselsElement.style.transform = `translateX(${-slideElements[0].clientWidth * count.current}px)`;
                }

                if (slideElements[count.current].id === 'last-slide') {
                    count.current = slideElements.length - 2;
                    carouselsElement.style.transition = 'none';
                    carouselsElement.style.transform = `translateX(${-slideElements[0].clientWidth * count.current}px)`;
                }
                dotsElements.forEach((item, index) => {
                    if (index + 1 === count.current) {
                        item.classList.add('active');
                    }
                    else item.classList.remove('active');
                })
            });
        }
        isPause.current = setTimeout(() => {
            handleChangeSlide(1)
        }, 3000);
    }

    const showDotChangeSlide = (carousels) => {
        return carousels.map((item, index) => {
            return <li className={`carousels-dots--item ${index === 0 && 'active'}`} key={index} onClick={() => handleChangeSlide(0, index + 1)}></li>
        })
    }

    return (
        <div className="slider">
            <div className="slider-wrap">
                {carousels.length > 0 ? <ul className="carousels" style={{ width: `${(carousels.length + 2) * 100}%` }}>
                    {showSlider(carousels)}
                </ul> : <SkeletonSlider theme="light" />}

                <div className="slide-btn btn-prev" style={{ color: `${viewMode.textColor}` }} onClick={() => handleChangeSlide(-1)}>
                    <i className="fas fa-chevron-left "></i>
                </div>
                <div className="slide-btn btn-next" style={{ color: `${viewMode.textColor}` }} onClick={() => handleChangeSlide(1)}>
                    <i className="fas fa-chevron-right"></i>
                </div>
                <ul className="carousels-dots">
                    {showDotChangeSlide(carousels)}
                </ul>
            </div>

        </div>
    )
}

export default Slider
