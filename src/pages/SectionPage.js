import React, { useEffect, useState } from 'react';
import Section from '../components/Contents/Section/Section';
import genres from '../constant/genres';

function SectionPage({ match }) {

    const [sectionPath, setSectionPath] = useState(null);
    const [title, setTitle] = useState(null);
    const [url, setUrl] = useState(null); 

    useEffect(() => {
        // console.info(match)
        window.scrollTo(0,0);
        localStorage.removeItem('comment');

        if (match.path) {
            if (match.path === '/moi-cap-nhat') {
                setTitle('Mới cập nhật');
                setUrl("/update");
                setSectionPath(match.path)
            }
            else if (match.path === '/hom-nay-xem-gi') {
                setTitle('Hôm nay xem gì???');
                setUrl("/picked");
                setSectionPath(match.path)
            }
            else if (match.path === '/bang-xep-hang/:option') {
                // console.info(match)
                setTitle("Bảng xếp hạng");
                if (match.params.option === "ngay")  setUrl("/rank/ngay");
                else if (match.params.option === "tuan")  setUrl("/rank/tuan");
                else if (match.params.option === "thang")  setUrl("/rank/thang");
                setSectionPath(match.path);
            }
            else {
                const path = match.url.replace('/trang-', '?page=');
                setUrl(path); // vd: /anime/hanh-dong?page=2
                const text = match.path.split('/')[2]; // vd: hanh-dong 
                setSectionPath(text)
                for (let i = 0; i < genres.length; i++) {
                    if (text === genres[i].slug) {
                        setTitle(genres[i].genre);
                        break;
                    }
                }
            }
        };

    }, [match]);
    // console.log(url)
    return (
        <div className="section">
            {url && sectionPath && <Section mode="full" path={sectionPath} url={url} title={title} />}
        </div>
    )
}

export default SectionPage
