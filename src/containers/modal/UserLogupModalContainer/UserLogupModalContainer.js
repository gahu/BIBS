import React, { Component } from 'react';
import LoginModal from 'components/modal/LoginModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class UserLogupModalContainer extends Component {
  handleLogin = async () => {
    const { BaseActions, userId, userPassword } = this.props;
    try {
      // 로그인 시도, 성공하면 모달 닫기
      await BaseActions.userLogin(userId, userPassword);
      BaseActions.hideModal('userLogup');
    } catch(e) {
      console.log(e);
    }
  }
  handleCancel = () => {
    const { BaseActions } = this.props;
    BaseActions.hideModal('userLogup');
  }
  handleChange = (e) => {
    const { value } = e.target;
    const { BaseActions } = this.props;
    BaseActions.changeUseridInput(value);
    BaseActions.changePasswordInput(value);
  }
  handleKeyPress = (e) => {
    // 엔터 키를 누르면 로그인 호출 되도록
    if(e.key === 'Enter') {
      this.handleLogin();
    }
  }

  render() {
    const {
      handleLogin, handleCancel, handleChange, handleKeyPress
    } = this;
    const { visible, error, userId, userPassword } = this.props;

    return (
      <UserLogUpModal
        onLogin={handleLogin} onCancel={handleCancel}
        onChange={handleChange} onKeyPress={handleKeyPress}
        visible={visible} error={error} userId={userId} userPassword={userPassword}
      />
    );
  }
}

export default connect(
  (state) => ({
    visible: state.base.getIn(['modal', 'userLogin']),
    userId: state.base.getIn(['userLogupModal', 'userId']),
    userPassword: state.base.getIn(['userLogupModal', 'userPassword']),
    error: state.base.getIn(['userLogupModal', 'error'])
  }),
  (dispatch) => ({
    // bindActionCreators 는 액션함수들을 자동으로 바인딩해준다.
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(UserLogupModalContainer);
