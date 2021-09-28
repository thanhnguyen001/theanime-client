import React from 'react';
import './Footer.css';

function Footer({ textColor }) {
    return (
        <div className="footer">
            <div className="footer-wrap" style={{color: `${textColor}`}}>
                Xem anime Vietsub online, phim Mỹ, phim Nhật Bản, phim Hàn Quốc, phim Thái Lan, và phim Trung Quốc. Đọc báo thể thao, du lịch, giải trí, tin tức thời sự, thế giới với các chuyên mục bóng đá, hậu trường, review phim, các điểm đến hấp dẫn
            </div>
        </div>
    )
}

export default Footer
