import React from 'react'
import PropTypes from 'prop-types'

function CardAnime(props) {

    const { anime } = props;

    const checkFull = (text) => {
        if (!text.includes('/')) return `${text.slice(0, -1)} phút `;
        const textArray = text.split('/');
        // console.log(textArray);
        if (Number.parseInt(textArray[0]) === Number.parseInt(textArray[1])) {
            return `Full ${text} tập`;
        }
        else return `${text} tập`;
    }

    return (
        <a href={`/${anime.slug}`} className="ta-link">
            <div className="col-wrap ta-anime--wrap">

                {anime.isCompleted ? <div className="ta-completed"><span>Full</span></div> : ''}

                {anime.updating ? <div className="ta-updating">{checkFull(anime.updating)}</div> : ""}

                <div className="ta-play">
                    <i className="fas fa-play"></i>
                </div>

                <div className="ta-thumbnail">
                    <img className="ta-thumbnail--img" src={anime.thumbnail} alt={anime.slug} />
                </div>

                <div className="ta-description">
                    <div className="ta-name">{anime.name}</div>
                    <div className="ta-title-episode">{anime.lastEpisodeName}</div>
                </div>
            </div>
        </a>
    )
}

CardAnime.propTypes = {
    anime: PropTypes.object.isRequired
}

export default CardAnime

