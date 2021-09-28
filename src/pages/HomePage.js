import React, { Fragment, useEffect } from 'react'
// import PropTypes from 'prop-types'
import Recently from '../components/Contents/Recently/Recently';
import Slider from '../components/Contents/Slider/Slider';
import Section from '../components/Contents/Section/Section';
import Recommended from '../components/Contents/Recommended/Recommended';
// import { useSelector } from 'react-redux';


function HomePage({ match, location }) {

    // console.log(location)
    // const user = useSelector(state => state.user) || JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        window.scrollTo(0,0);
        localStorage.removeItem('comment');
    }, [])

    return (
        <Fragment>
            <Slider />
            {<Recently />}
            <Section path="/moi-cap-nhat" title="Mới cập nhật" url="/update"/>
            <Recommended />
        </Fragment>
    )
}

HomePage.propTypes = {

}

export default HomePage

