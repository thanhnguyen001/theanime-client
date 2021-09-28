import React from 'react';
import { compareTime } from '../../../utils';

function Comment(props) {

    const { index, comment, onClick, user } = props;

    // console.info(comment.user)

    return (
        <div className="comment-item level2">
            <div className="user-avatar">
                <img alt="" src={comment.user?.avatar} />
            </div>
            <div className="user-info">
                <div className="user-display-name">{comment.user?.displayName}</div>
                <div className="user-commented">{comment.content}</div>
                <div className="user-reply">
                    <i className="fas fa-comments"></i>
                    <span className="reply" onClick={() => onClick(index, user)}>Trả lời</span>
                    <i className="far fa-clock"></i>
                    <span className="commented-time">{compareTime(comment.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}

export default Comment
