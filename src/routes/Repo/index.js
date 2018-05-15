import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, WingBlank, WhiteSpace, Button, Grid, Icon, List } from 'antd-mobile';
import styles from './index.less';
import { queryDir } from '../../services/repo';


const Item = List.Item;

class RepoRoot extends Component {
  state = {
    refreshing: false,
    dir: [],
    path: '',
  };

  async componentWillMount() {
    const { repo, user } = this.props.params;

    this.props.dispatch({
      type: 'repo/fetchProfile',
      payload: {
        owner: user,
        repo,
      },
    });

    const res = await queryDir({ repo, owner: user, path: '' });
    this.setState({
      dir: res.data,
    });
  }

  fetchContent = async (path) => {
    const { repo, user } = this.props.params;

    const res = await queryDir({ repo, owner: user, path });
    this.setState({
      path,
      dir: res.data,
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
    ];

    // const data = Array.from(new Array(4)).map((_val, i) => ({
    //   icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    //   text: `name${i}`,
    // }));
    const cards = {
      user: (
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
      ),
      directory: (
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="目录预览"
              extra={
                <Button
                  size={'small'}
                  onClick={() => {
                    const { path } = this.state;
                    if (!path) { return; }
                    this.fetchContent(path.replace(/\/?[^/]*?$/, ''));
                  }}
                >返回</Button>
              }
            />
            <Card.Body>
              <List>
                {
                  this.state.dir.sort(a => a.type === 'file').map(item => <Item
                    key={item.name}
                    thumb={item.thumb}
                    arrow="horizontal"
                    onClick={() => {
                      if (item.type === 'dir') {
                        this.fetchContent(item.path);
                      }
                    }}
                    extra={item.type}
                  >{
                    item.type === 'file' ? <a href="#">{item.name}</a> : item.name
                  }</Item>)
                }
              </List>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>
      ),
      profile: (
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
      ),
      readme: (
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
      ),
    };

    const { params } = this.props.common;

    let { 'repo-card-order': order } = params;

    console.info(order);
    if (!order) {
      order = ['profile', 'user', 'directory'];
    }

    return (
      <div>

        <div className={styles.wrapper}>
          <Grid data={baseTabs} columnNum={4} square={false} />
        </div>

        {
          order.map(t => cards[t])
        }

        {/* <WingBlank size="lg">*/}
        {/* <WhiteSpace size="lg" />*/}
        {/* <Card>*/}
        {/* <Card.Body>*/}
        {/* <Grid data={operations} columnNum={4} />*/}
        {/* </Card.Body>*/}
        {/* </Card>*/}
        {/* <WhiteSpace size="lg" />*/}
        {/* </WingBlank>*/}
      </div>
    );
  }
}

export default connect(s => ({ repo: s.repo, common: s.common }))(RepoRoot);

// export default function () {
//   return (
//     <div>124234
//     </div>
//   );
// }
