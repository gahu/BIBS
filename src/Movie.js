import React, { Component } from 'react';
import './Movie.css';

class Movie extends Component {
  render(){
    return(
      <div>
        <MoviePoster />
        <h1>hello this is a movie</h1>
      </div>
    )
  }
}

class MoviePoster extends Component {
  render(){
    return(
      <img src="https://www.proprofs.com/quiz-school/topic_images/p1aq9btvt8l0t1n3v14m1bk064h3.jpg"/>
    )
  }
}

export default Movie;
