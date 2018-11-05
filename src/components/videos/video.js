import React, { Component } from 'react';
import './video.scss';
import video from './test.mp4';
// import test from './acc.h264'

class Video extends Component {
  render(){
    return(
        <div class="example-classe">
          <video width="640" height="480" controls src={video} type="video/mp4"></video>
        </div>
    );
  };
}

export default Video;