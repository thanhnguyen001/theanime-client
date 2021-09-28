import React, { useState } from 'react';
import './UserForm.css';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useDispatch } from 'react-redux';
import { signOut } from '../../reducers/userReducer';
// import { useHistory } from 'react-router-dom';

function UserForm(props) {

    const { textColor } = props;
    // const history = useHistory()
    const dispatch = useDispatch();
    const [formMode, setFormMode] = useState('tt');

    const { height } = useWindowDimensions();
    const handleChangeMode = (status) => {
        const element = document.querySelector('.sign-form--heading-separate');
        if (element) {
            if (status) {
                setFormMode('tt');
                element.style.left = '20%';
            }
            else {
                setFormMode('tb');
                element.style.left = '62%';
            }
        }
    }

    const handleSignOut = () => {

        const payload = null;
        dispatch(signOut(payload));
        window.location.reload(false);
    }

    return (
        <div className="sign-form--wrap">
            <div className="sign-form--heading" style={{ color: `${textColor}` }}>
                <div className="sign-form--heading-item user-memo" onClick={() => handleChangeMode(true)}>Thông Tin</div>
                <div className="sign-form--heading-item user-info" onClick={() => handleChangeMode(false)}>Thông Báo</div>
                <div className="sign-form--heading-separate"></div>
            </div>

            <div className="sign-form--body" style={{ maxHeight: `${height - 200}px`, overflow: 'auto' }}>

                {formMode === 'tt' ? (<div className="user-form--wrap">
                    {/* <a style={{ color: `${textColor}` }} className="user-form--link user-form--part" href="/trang-ca-nhan">
                        <i className="fas fa-user user-form--icon"></i>
                        <div className="user-form--text">Trang cá nhân</div>
                    </a> */}
                    <a style={{ color: `${textColor}` }} className="user-form--link user-form--part" href="/sua-thong-tin">
                        <i className="fas fa-edit user-form--icon"></i>
                        <div className="user-form--text">Sửa thông tin</div>
                    </a>
                    <a style={{ color: `${textColor}` }} className="user-form--link user-form--part" href="/doi-mat-khau">
                        <i className="fas fa-unlock-alt user-form--icon"></i>
                        <div className="user-form--text">Đổi mật khẩu</div>
                    </a>

                    <hr />

                    <a style={{ color: `${textColor}` }} className="user-form--link user-form--part" href="/phim-da-xem">
                        <i className="fas fa-film user-form--icon"></i>
                        <div className="user-form--text">Phim đã xem</div>
                    </a>
                    <a style={{ color: `${textColor}` }} className="user-form--link user-form--part" href="/phim-da-thich">
                        <i className="fas fa-heart user-form--icon"></i>
                        <div className="user-form--text">Phim đã thích</div>
                    </a>
                    <a style={{ color: `${textColor}` }} className="user-form--link user-form--part" href="/phim-dang-theo-doi">
                        <i className="fas fa-bell user-form--icon"></i>
                        <div className="user-form--text">Phim đang theo dõi</div>
                    </a>

                    <hr />

                    <div className="user-form--part" style={{ color: `${textColor}` }} onClick={handleSignOut}>
                        <i className="fas fa-sign-out-alt user-form--icon"></i>
                        <div className="user-form--text">Đăng xuất</div>
                    </div>
                </div>) : (
                    <div className="user-form--memo" style={{ color: `${textColor}` }}>Không có thông báo nào</div>
                )}

            </div>
        </div>
    )
}

export default UserForm
