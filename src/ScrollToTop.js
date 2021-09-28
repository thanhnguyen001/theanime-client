import React, { Fragment, useEffect } from 'react'
import { withRouter } from 'react-router';

function ScrollToTop({ history, children }) {

    useEffect(() => {
        const scrollToTop = history.listen(() => {
            window.scrollTo(0, 0);
        })
        scrollToTop();

        return () => {
            scrollToTop();
        }
    }, [history])

    return (
        <Fragment>{children}</Fragment>
    )
}

export default withRouter(ScrollToTop);
