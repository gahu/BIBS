/*global daum*/
import React, { Component } from 'react';
import PostInfo from 'components/post/PostInfo';
import PostBody from 'components/post/PostBody';
import * as postActions from 'store/modules/post';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shouldCancel from 'lib/shouldCancel';
import removeMd from 'remove-markdown';
import { Helmet } from 'react-helmet';

var addr = null;
 // new daum.maps.services.Geocoder();
const geocoder = new daum.maps.services.Geocoder();

class Post extends Component {
    constructor() {
        super();
        this.state = {
            userId: null,
            accTime: null,
            lat: null,
            lon: null,
            video: null,
            accNum: null,
            carName: null,
            carNumber: null,
            publishedDate: null,
            detailAddr: addr
        };
    }

    initialize = async () => {
        if(shouldCancel()) return;
        const { PostActions, id } = this.props;
        try {
            await PostActions.getPost(id);
            // await this.updateHeader();
        } catch(e) {
            console.log(e);
        }
    }

    update = async (userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate) => {
        var lat_1 = Number(lat);
        var lon_1 = Number(lon);

        geocoder.coord2Address(lon_1, lat_1, (result, stats) => {
            //console.log(stats); 
            if (stats === daum.maps.services.Status.OK) {
                addr = result[0].address.address_name;
                this.setState({
                    userId: userId,
                    accTime: accTime,
                    lat: lat,
                    lon: lon,
                    video: video,
                    accNum: accNum,
                    carName: carName,
                    carNumber: carNumber,
                    publishedDate: publishedDate,
                    detailAddr : addr
                });
            }
        });
    }

    componentDidMount = async () => {
        await this.initialize();
        const { post } = this.props;
        const { userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate } = post.toJS();
        await this.update(userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate);
    }

    render() {
        const { loading } = this.props;

        if(loading) return null; // 로딩 중일 때는 아무것도 보여 주지 않음
        
        return (
            <div>
                {   this.state.lat && (
                    <Helmet>
                        <title>{this.state.userId}</title>
                    </Helmet>)
                }
                    <PostInfo userId={this.state.userId} accNum={this.state.accNum} publishedDate={this.state.publishedDate}/>
                    <PostBody accTime={this.state.accTime} video={this.state.video} addr={this.state.detailAddr} carName={this.state.carName} carNumber={this.state.carNumber}/>
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