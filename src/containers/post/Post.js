import React, { Component } from 'react';
import PostInfo from 'components/post/PostInfo';
import PostBody from 'components/post/PostBody';
import * as postActions from 'store/modules/post';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shouldCancel from 'lib/shouldCancel';
import removeMd from 'remove-markdown';
import { Helmet } from 'react-helmet';
import watch from 'material-ui/svg-icons/hardware/watch';
import { withState } from 'recompose';

const geocoder = new window.daum.maps.services.Geocoder(); // new daum.maps.services.Geocoder();

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

class Post extends Component {
    init = () => {

    }

    initialize = async () => {
        if(shouldCancel()) return;
        const { PostActions, id } = this.props;
        try {
            await PostActions.getPost(id);
        } catch(e) {
            console.log(e);
        }
    }

    componentDidMount() {
        this.initialize();
    }

    render() {
        const { loading, post } = this.props;

        if(loading) return null; // 로딩 중일 때는 아무것도 보여 주지 않음
        
        // const { title, body, publishedDate, tags } = post.toJS();
        const { userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate } = post.toJS();

        var lat_1 = Number(lat);
        var lon_1 = Number(lon); 
        var latlon = new window.daum.maps.LatLng(lon_1, lat_1);

        var detailAddr;
        searchDetailAddrFromCoords(latlon, function(result, stats){
            if (stats === window.daum.maps.services.Status.OK) {
                detailAddr = !!result[0].road_address ? + result[0].road_address.address_name  : 
                detailAddr += result[0].address.address_name;
            }
        });

        return (
            <div>
                {   lat && (
                    <Helmet>
                        <title>{userId}</title>
                    </Helmet>)
                }
                    <PostInfo userId={userId} accNum={accNum} publishedDate={publishedDate}/>
                    <PostBody accTime={accTime} video={video} addr={detailAddr} carName={carName} carNumber={carNumber}/>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        post: state.post.get('post'),
        loading: state.pender.pending['post/GET_POST'] // 로딩 상태
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch)
    })
)(Post);