import React, { useRef, useState } from 'react';
import './SignForm.css';
import { useForm } from 'react-hook-form';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import axiosClient from '../../api/axiosClient';
import { useDispatch } from 'react-redux';
import { signedIn } from '../../reducers/userReducer'
import { addWatch } from '../../reducers/watchReducer';

const SignForm = (props) => {

    const { textColor } = props;

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors }, watch } = useForm({ mode: 'all', defaultValues: {
        username: "megazord003",
        password: "123456"
    } });

    const { height } = useWindowDimensions();
    
    const [isLoginFail, setIsLoginFail] = useState(false);

    // useState
    const [signMode, setSignMode] = useState('dn');

    const handleChangeSignMode = (status) => {
        const element = document.querySelector('.sign-form--heading-separate');
        if (element) {
            if (status) {
                setSignMode('dn');
                element.style.left = '20%';
            }
            else {
                setSignMode('dk');
                element.style.left = '62%';
            }
        }
    }

    //Handle submit Form
    const onSubmit = (data) => {
        if (signMode === 'dk') {
            axiosClient.post('/user/register', JSON.stringify(data))
                .then(res => {
                    // console.info(res);
                    res = { ...res };
                    let payload = {
                        username: res.user.username,
                        email: res.user.email,
                        displayName: res.user.displayName,
                        gender: res.user.gender,
                        avatar: res.user.avatar ? res.user.avatar : '',
                        accessToken: res.accessToken,
                    }
                    let watch = {
                        following: res.user.following,
                        liked: res.user.liked,
                        viewed: res.user.viewed,
                    }

                    dispatch(signedIn(payload));
                    dispatch(addWatch(watch));

                    window.location.reload(false);
                })
                .catch(errors => console.info(errors));
        }
        else {
            axiosClient.post('/user/login', JSON.stringify(data))
                .then(res => {
                    console.info(res)

                    if (!res.success) {
                        setIsLoginFail(true);
                        return;
                    }
                    let payload = {
                        username: res.user.username,
                        email: res.user.email,
                        displayName: res.user.displayName,
                        gender: res.user.gender,
                        avatar: res.user.avatar ? res.user.avatar : '',
                        accessToken: res.accessToken,
                    }
                    let watch = {
                        following: res.user.following,
                        liked: res.user.liked,
                        viewed: res.user.viewed,
                    }

                    dispatch(addWatch(watch));
                    dispatch(signedIn(payload));

                    window.location.reload(false);


                })
                .catch(errors => {
                    console.info(errors.message);
                    // setIsLoginFail(true);
                })
        }

    }

    const password = useRef(watch("password", ""));
    password.current = watch("password", "");

    return (
        <form className="sign-form--wrap" onSubmit={handleSubmit(onSubmit)}>
            <div className="sign-form--heading" style={{ color: `${textColor}` }}>
                <div className="sign-form--heading-item" onClick={() => handleChangeSignMode(true)}>????ng Nh???p</div>
                <div className="sign-form--heading-item" onClick={() => handleChangeSignMode(false)}>????ng K??</div>
                <div className="sign-form--heading-separate"></div>
            </div>

            {isLoginFail && <div className="sign-form-fail error">T??n ????ng nh???p ho???c m???t kh???u kh??ng ch??nh x??c!</div>
            }
            <div className="sign-form--body" style={{ maxHeight: `${height - 200}px`, overflow: 'auto' }}>
                <div style={{ color: `${textColor}` }} className={`sign-form--group ${errors.username ? "error" : ''}`} >
                    <label htmlFor="username">T??n ????ng nh???p</label>
                    <i className="fas fa-user"></i>
                    <input type="text" name="username" id="username"
                        className="sign-form--input"
                        {...register('username', {
                            required: 'Vui l??ng ??i???n v??o m???c n??y',
                            minLength: {
                                value: 6,
                                message: 'T???i thi???u 6 k?? t???'
                            }
                        })}
                    />
                    <div className="sign-form--error">
                        {errors.username ? errors.username.message : ''}
                    </div>
                </div>

                <div style={{ color: `${textColor}` }} className={`sign-form--group ${errors.password ? "error" : ''}`}>
                    <label htmlFor="password">M???t kh???u</label>
                    <i className="fas fa-lock"></i>
                    <input type="password" name="password" id="password" autoComplete="on"
                        className="sign-form--input"
                        {...register('password', {
                            required: 'Vui l??ng ??i???n v??o m???c n??y',
                            minLength: {
                                value: 6,
                                message: 'T???i thi???u 6 k?? t???'
                            }
                        })}
                    />
                    <div className="sign-form--error">
                        {errors.password ? errors.password.message : ''}
                    </div>
                </div>

                {signMode === 'dk' && (<div style={{ color: `${textColor}` }} className={`sign-form--group ${errors.confirm_password ? "error" : ''}`}>
                    <label htmlFor="confirm_password">Nh???p l???i m???t kh???u</label>
                    <i className="fas fa-lock"></i>
                    <input type="password" name="confirm_password" id="confirm_password" autoComplete="on"
                        className="sign-form--input"
                        ref={password}
                        {...register('confirm_password', {
                            required: "M???t kh???u kh??ng tr??ng kh???p",
                            validate: value => value === password.current || "M???t kh???u kh??ng tr??ng kh???p"
                        })}
                    />
                    <div className="sign-form--error">
                        {errors.confirm_password ? errors.confirm_password.message : ''}
                    </div>
                </div>)}

                {signMode === 'dk' && (<div style={{ color: `${textColor}` }} className={`sign-form--group ${errors.displayName ? "error" : ''}`}>
                    <label htmlFor="displayName">T??n hi???n th???</label>
                    <i className="fas fa-comment-alt"></i>
                    <input type="text" name="displayName" id="displayName"
                        className="sign-form--input"
                        {...register('displayName', {
                            required: 'T??? 6 - 40 k?? t???',
                            minLength: { value: 6 },
                            maxLength: { value: 40 }
                        })}
                    />
                    <div className="sign-form--error">
                        {errors.displayName ? errors.displayName.message : ''}
                    </div>
                </div>)}

                {signMode === 'dk' && (<div style={{ color: `${textColor}` }} className={`sign-form--group ${errors.email ? "error" : ''}`}>
                    <label htmlFor="email">Email</label>
                    <i className="fas fa-envelope"></i>
                    <input type="email" name="email" id="email"
                        className="sign-form--input"
                        {...register('email', {
                            required: 'Vui l??ng ??i???n v??o m???c n??y'
                        })}
                    />
                    <div className="sign-form--error">
                        {errors.email ? errors.email.message : ''}
                    </div>
                </div>)}

                {signMode === 'dk' && (<div style={{ color: `${textColor}` }} className="sign-form--group gender">
                    <label htmlFor="gender">Gi???i t??nh:</label>
                    <input type="radio" name="gender" value="Nam"
                        {...register('gender', {
                            required: 'Vui l??ng ch???n'
                        })}
                    /> Nam
                    <input type="radio" name="gender" value="N???"
                        {...register('gender', {
                            required: 'Vui l??ng ch???n'
                        })}
                    /> N???
                    <div className="sign-form--error">
                        {errors.gender ? errors.gender.message : ''}
                    </div>
                </div>)}

                <div className="sign-form--group btn-submit" >
                    <button style={{ color: `${textColor}` }} type="submit">{signMode === 'dk' ? "????ng K??" : "????ng Nh???p"}</button>
                </div>
            </div>
        </form>

    )
}

export default SignForm
