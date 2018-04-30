import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, WingBlank, WhiteSpace, Button, Icon, List } from 'antd-mobile';

class $Button extends Component {
  render() {
    const { params } = this.props.common;
    let type;
    if (params.buttonSize === 2) {
      type = 'primary';
    }
    return (
      <Button {...this.props} type={type}>{this.props.children}</Button>
    );
  }
}

export default connect(s => ({ common }) => ({ common }))($Button);
