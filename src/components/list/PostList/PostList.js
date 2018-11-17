import React from 'react';
import styles from './PostList.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import moment from 'moment';
// import removeMd from 'remove-markdown';

const cx = classNames.bind(styles);
    
const PostItem = ({userId, accTime, accAddr, video, accNum, carName, carNumber, publishedDate, id}) => {
    // const tagList = accNum.map(
    //     accNum => <Link key={accNum} to={`/tag/${accNum}`}>#{accNum}</Link>
    // );
    return (
        <div className={cx('post-item')}>
            <h2><Link to={`/post/${id}`}>{userId}</Link></h2>
            <div className={cx('date')}>{moment(publishedDate).format('ll')}</div>
            {/* <p>{removeMd(body)}</p> */}
            <ul>
                <li>accidentTime : {accTime}</li>
                <li>accidentAddress : {accAddr}</li>
                {/* <li>video : {video}</li> */}
                <li>carName : {carName}</li>
                <li>carNumber : {carNumber}</li>
            </ul>
            <div className={cx('tags')}>
                {/* {tagList} */}
                accNum={accNum}
            </div>
        </div>
    )
}

const PostList = ({posts}) => {
    const postList = posts.map(
        (post) => {
            const { _id, userId, accNum, accTime, accAddr, publishedDate, video, carName, carNumber } = post.toJS()._doc;
            return (
                <PostItem
                    userId={userId}
                    accTime={accTime}
                    accAddr={accAddr}
                    // video={video}
                    accNum={accNum}
                    carName={carName}
                    carNumber={carNumber}
                    publishedDate={publishedDate}
                    key={_id} // react-warning-keys
                    id={_id}
                />
            )
        }
    );
    return (
        <div className={cx('post-list')}>
            {postList}
        </div>
    )
};

export default PostList;