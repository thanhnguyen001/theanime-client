import React, { useEffect, useState } from 'react'
import Watch from '../components/Contents/Watch/Watch'

function WatchPage({match, history}) {
    const [currentEpisode, setCurrentEpisode] = useState('');
    useEffect(() => {
        if (!match.params.episode) {
            setCurrentEpisode('tap-1');
        }
        else setCurrentEpisode(match.params.episode);
    }, [match.params])
    return (
        <div className="watch">
             { match && currentEpisode && <Watch  animeSlug={match.params.name} episode={currentEpisode} history={history} />}
        </div>
    )
}

export default WatchPage
