import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, WingBlank, WhiteSpace, Button, Icon, List } from 'antd-mobile';

import logger from '../../utils/logMaster'
// import styles from './index.less';

const Item = List.Item;
const Brief = Item.Brief;
//
class UserRoot extends Component {
  state = {
    refreshing: false,
    blob: 2,
  };

  componentWillMount() {
    const { user } = this.props.params;
    this.props.dispatch({
      type: 'user/fetchProfile',
      payload: {
        owner: user,
      },
    });
  }

  callHybrid = e => {
    // const str = typeof window.LogMaster.setLog
    //
    // const log = {
    //   base: {
    //     name: 'pppppp',
    //   },
    // }
    //
    // window.LogMaster.setLog(JSON.stringify(log))
    //
    // this.setState({blob: str})
    logger.trackClick(e);

    // window.BaseBridge.logMessage('2222')
    // window.BaseBridge.logMessage('23333333333333')
    // window.say = () => {
    //   this.setState({blob: "O jb K"})
    // }
  }

  render() {
    const { user } = this.props.params;
    const { data, repos = [] } = this.props.user;

    if (!data) {
      return null;
    }

    const details = [
      {
        thumb: <Icon type="check" />,
        text: '用户名',
        value: data.name,
      },
      {
        thumb: <Icon type="check" />,
        text: '个人主页',
        value: data.blog,
      },
      {
        thumb: <Icon type="check" />,
        text: '邮箱地址',
        value: data.email,
      },
      {
        thumb: <Icon type="check" />,
        text: '公司',
        value: data.company,
      },
      {
        thumb: <Icon type="check" />,
        text: '位置',
        value: data.location,
      },
      {
        thumb: <Icon type="check" />,
        text: '加入时间',
        value: data.created_at,
      },
    ];

    return (
      <div>

        <Button onClick={this.callHybrid} id="clickItem">点击我调用{this.state.blob}</Button>

        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="用户描述"
            />
            <Card.Body>
              <List renderHeader={() => 'Icon in the left'}>
                {
                  details.map(item => <Item
                    thumb={item.thumb}
                    arrow="horizontal"
                    onClick={() => {}}
                    extra={item.value}
                  >{item.text}</Item>)
                }
              </List>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>

        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="用户仓库"
            />
            <Card.Body>
              <List renderHeader={() => '用户所有公开仓库'}>
                {
                  repos.map(item =>
                    <Item multipleLine extra={item.stargazers_count}>
                      <a href={`/repo/${user}/${item.name}`}>{item.name}</a> <Brief>{item.description}</Brief>
                    </Item>)
                }
              </List>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>
      </div>
    );
  }
}

export default connect(s => ({ user: s.user }))(UserRoot);

