import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, WingBlank, WhiteSpace, PullToRefresh, Grid, Icon } from 'antd-mobile';
// import styles from './index.less';
//
class RepoRoot extends Component {
  state = {
    refreshing: false,
  };

  componentWillMount() {
    const { repo, user } = this.props.params;
    this.props.dispatch({
      type: 'repo/fetchProfile',
      payload: {
        owner: user,
        repo,
      },
    });
  }

  render() {
    const { data, readme } = this.props.repo;

    if (!data) {
      return null;
    }

    const operations = [
      {
        // icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
        icon: <Icon type="check" />,
        text: 'Branch',
      },
      {
        icon: <Icon type="check-circle-o" />,
        text: 'Code',
      },
      {
        icon: <Icon type="cross-circle-o" />,
        text: 'Commit',
      },
      {
        icon: <Icon type="cross" />,
        text: 'Contributor',
      },
    ];

    // const data = Array.from(new Array(4)).map((_val, i) => ({
    //   icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    //   text: `name${i}`,
    // }));

    return (
      <div>

        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="项目描述"
            />
            <Card.Body>
              <div>{data.description}</div>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>

        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title={data.owner.login}
              thumb={<img width={40} height={40} src={data.owner.avatar_url} alt="" />}
              extra={<span>{data.owner.type}</span>}
            />
            <Card.Body>
              <div>This is content of `Card`</div>
            </Card.Body>
            <Card.Footer content={data.pushed_at} extra={<div>{data.id}</div>} />
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>

        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Body>
              <Grid data={operations} columnNum={4} />
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>

        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="README.md"
            />
            <Card.Body>
              <div dangerouslySetInnerHTML={{__html: readme}} />
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>
      </div>
    );
  }
}

export default connect(s => ({ repo: s.repo }))(RepoRoot);

// export default function () {
//   return (
//     <div>124234
//     </div>
//   );
// }
