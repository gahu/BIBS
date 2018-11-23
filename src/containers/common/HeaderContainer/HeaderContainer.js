import React, { Component } from 'react';
import Header from 'components/common/Header';
import { withRouter } from 'react-router-dom';
import * as baseActions from 'store/modules/base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HeaderContainer extends Component {
  handleUserLogUpClick = async () => {
    const { BaseActions, logged } = this.props;
    
    BaseActions.showModal('userlogup');
    BaseActions.initializeLoginModal();
  }

  // 관리자 로그인 Header에서는 안쓰임
  handleLoginClick = async () => {
    const { BaseActions, logged } = this.props;
    if(logged) {
        try {
            await BaseActions.logout();
            window.location.reload(); // 페이지 새로고침
        } catch(e) {
            console.log(e);
        }
        return;
    }
    BaseActions.showModal('login');
    BaseActions.initializeLoginModal();
  }

  handleUserLogInClick = async () => {
    const { BaseActions, logged } = this.props;
    if(logged) {
        try {
            await BaseActions.adminLogout();
            window.location.reload(); // 페이지 새로고침
        } catch(e) {
            console.log(e);
        }
        return;
    }
    BaseActions.showModal('userlogin');
    BaseActions.initializeLoginModal();
  }
  
  handleRemove = () => {
    const { BaseActions } = this.props;
    BaseActions.showModal('remove');
  }

  render() {
    const { handleRemove, handleUserLogUpClick, handleUserLogInClick } = this;
    const { match, logged } = this.props;

    const { id } = match.params;

    return (
      <Header 
        postId={id}
        logged={logged}
        onRemove={handleRemove}
        onUserLogUp={handleUserLogUpClick}
        onUserLogIn={handleUserLogInClick}
      />
    );
  }
}

export default connect(
  (state) => ({
    logged: state.base.get('logged')
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(withRouter(HeaderContainer));
