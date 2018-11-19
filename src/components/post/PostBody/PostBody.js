import React from 'react';
import styles from './PostBody.scss';
import classNames from 'classnames/bind';
import MarkdownRender from 'components/common/MarkdownRender';

const cx = classNames.bind(styles);

const PostBody = ({accTime, video, addr, carName, carNumber}) => (
    <React.Fragment>
    <div className={cx('post-body')}>
        <div className={cx('paper')}>
            {/* <MarkdownRender markdown={accAddr}/> */}
            <ul>
                <li>사고 시간 : {accTime}</li>
                <li>사고 장소 : {addr}</li>
                <li>차량 이름 : {carName}</li>
                <li>차량 번호 : {carNumber}</li>
                <li>video: </li>
            </ul>
            {
                video && <div className={cx('video')}>
                {/* <div> */}
                <video  width= "480" height= "270" controls>
                    <source src={ window.location.origin + "/accidents/" + accTime + '.mp4' } type="video/mp4" />
                </video>
            </div>
            }
            
        </div>
    </div>
    </React.Fragment>
)

export default PostBody;