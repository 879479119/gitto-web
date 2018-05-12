import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, WingBlank, WhiteSpace, PullToRefresh, Grid, Icon, List } from 'antd-mobile';
import styles from './index.less';


const Item = List.Item;

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

    const baseTabs = [
      {
        text: <div className={styles.item}>
          <p>Subscribe</p>
          <p>{data.subscribers_count}</p>
        </div>,
      },
      {
        text: <div className={styles.item}>
          <p>Forks</p>
          <p>{data.forks_count}</p>
        </div>,
      },
      {
        text: <div className={styles.item}>
          <p>Issues</p>
          <p>{data.open_issues_count}</p>
        </div>,
      },
      {
        text: <div className={styles.item}>
          <p>Stars</p>
          <p>{data.stargazers_count}</p>
        </div>,
      },
    ]

    // const data = Array.from(new Array(4)).map((_val, i) => ({
    //   icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    //   text: `name${i}`,
    // }));

    return (
      <div>

        <div className={styles.wrapper}>
          <Grid data={baseTabs} columnNum={4} square={false} />
        </div>

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
              title={<a href={`/user/${data.owner.login}`}>{data.owner.login}</a>}
              thumb={<img width={40} height={40} src={data.owner.avatar_url} alt="" />}
              extra={<span>{data.owner.type}</span>}
            />
            <Card.Body>
              <List>
                <Item
                  arrow="horizontal"
                  extra={data.created_at}
                >{'创建时间'}</Item>
                <Item
                  arrow="horizontal"
                  extra={data.updated_at}
                >{'更新时间'}</Item>
                <Item
                  arrow="horizontal"
                  extra={data.pushed_at}
                >{'push时间'}</Item>
              </List>
            </Card.Body>
            {/* <Card.Footer content={data.pushed_at} extra={<div>{data.id}</div>} />*/}
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
              <div dangerouslySetInnerHTML={{ __html: readme }} />
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
