/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../../../api/axiosClient';
import './Information.css';
import { useHistory } from 'react-router-dom'
import { updateUser } from '../../../reducers/userReducer';


function Input({ control, name, defaultValue, type, title, maxLength }) {
    const { field: { ref, ...inputProps },
        fieldState: { invalid, isTouched, isDirty, error },
        formState: { touchedFields, dirtyFields } } = useController(
            {
                name,
                control,
                rules: {
                    required: "Vui lòng điền vào mục này", minLength: { value: 8, message: "Tối thiểu 8 kí tự" },
                    maxLength: { ...maxLength }
                },
                defaultValue
            });

    return (
        <div className="information-group">
            <label htmlFor={name}>{title}</label>
            <input type={type}  {...inputProps} ref={ref} />
            <div className="information-error">
                {error && error.message}
            </div>
        </div>
    )
}

function Information({ title, type }) {

    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user);
    // console.info(user);
    const [isChangeSuccess, setIsChangeSuccess] = useState(false);
    const [isChangeFail, setIsChangeFail] = useState(false);
    const preLoadDefaultValues = {};  // If you have any default values, ex: [name]: {defaultValue}

    useEffect(() => {
        if (!user.username) {
            history.push('/')
        }
    }, [history, user.username])

    const { register, control, handleSubmit, formState: { errors }, watch } = useForm(
        {
            mode: 'all',
            defaultValues: preLoadDefaultValues
        });

    const onSubmit = (data) => {
        // console.info(data);
        if (title === 'SỬA THÔNG TIN') {
            axiosClient.patch(`/user/update`, data)
                .then(response => {
                    const { user } = response;
                    // console.info(user);
                    const payload = {
                        ...user,
                        accessToken: JSON.parse(localStorage.getItem('TOKEN'))
                    }
                    dispatch(updateUser(payload));
                    setIsChangeSuccess(true);
                })
                .catch(errors => {
                    console.info(errors)
                })
        }
        else {
            const { currentPassword, newPassword } = data;
            axiosClient.patch('/user/update', { currentPassword, newPassword })
                .then(res => {
                    const { success } = res;
                    if (success) setIsChangeSuccess(true);
                    else { setIsChangeFail(true) }
                })
                .catch(errors => {
                    console.info(errors);
                    console.info('ok')
                })
        }
    }



    const password = useRef(watch("newPassword", ""));
    password.current = watch("newPassword", "");

    return (
        <div className="information">
            <div className="information-wrap">
                <div className="information-title">
                    <span>{title}</span>
                </div>
                {title === "SỬA THÔNG TIN" && <form className="information-body" onSubmit={handleSubmit(onSubmit)}>

                    {isChangeSuccess && <div className="information-memo">
                        Bạn đã sửa thông tin thành công!!!
                    </div>}

                    <Input type="text" name="username" control={control} defaultValue={`${user?.username}`} title="Tên đăng nhập" />
                    <Input type="text" name="displayName" control={control} defaultValue={`${user?.displayName}`} title="Tên hiển thị" maxLength={{ value: 16, message: "Tối đa 16 kí tự" }} />
                    <Input type="email" name="email" control={control} defaultValue={`${user?.email}`} title="Email" />

                    <button className="information-btn">Sửa thông tin</button>
                </form>}

                {title === "ĐỔI MẬT KHẨU" && <form className="information-body" onSubmit={handleSubmit(onSubmit)}>

                    {isChangeSuccess && <div className="information-memo">
                        Bạn đã đổi mật khẩu thành công!!!
                    </div>}

                    {isChangeFail && <div className="information-memo error">
                        Mật khẩu hiện tại không chính xác
                    </div>}

                    <div className="information-group">
                        <label htmlFor="currentPassword">Mật khẩu hiên tại</label>
                        <input type="password" name="currentPassword" {...register("currentPassword", {
                            require: "Please fill the textarea!",
                            minLength: { value: 6, message: "Tối thiểu 6 ký tự" }
                        })} />
                        <div className="information-error">
                            {errors.currentPassword && errors.currentPassword.message}
                        </div>
                    </div>

                    <div className="information-group">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input type="password" name="newPassword" ref={password} {...register("newPassword", {
                            require: "Please fill the textarea!",
                            minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
                        })} />
                        <div className="information-error">
                            {errors.newPassword && errors.newPassword.message}
                        </div>
                    </div>

                    <div className="information-group">
                        <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                        <input type="password" name="confirmPassword" {...register("confirmPassword", {
                            require: "Please fill the textarea!",
                            minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
                            validate: (value) => value === password.current || "Mật khẩu không trùng khớp!!!"
                        })} />
                        <div className="information-error">
                            {errors.confirmPassword && errors.confirmPassword.message}
                        </div>
                    </div>

                    <button type="submit" className="information-btn">Sửa thông tin</button>
                </form>}
            </div>
        </div>
    )
}

export default Information
