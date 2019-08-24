import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css, MTween } from './js/MTween.js';
import './index.scss';

let touch = { lastTime: 0, interval: 300 };

export default class index extends Component {
  static propTypes = {
    list: PropTypes.array,
    initVal: PropTypes.array,
    linkageVal: PropTypes.array,
    isShow: PropTypes.bool.isRequired,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    handleConfirm: PropTypes.func,
    handleCancel: PropTypes.func,
    handleOver: PropTypes.func,
    handleInit: PropTypes.func
  };

  static defaultProps = {
    list: [[{ val: '苹果' }, { val: '香蕉' }, { val: '西瓜' }, { val: '樱桃' }]],
    initVal: [],
    linkageVal: [],
    cancelText: '取消',
    confirmText: '确定',
    handleConfirm: () => {},
    handleCancel: () => {},
    handleOver: () => {},
    handleInit: () => {}
  };

  componentDidMount() {
    setTimeout(() => this.handleInitPos(), 60);
  }

  componentDidUpdate(prevProps) {
    if (this.props.linkageVal !== prevProps.linkageVal) {
      this.handleCssPos();
    }

    if (this.props.isShow !== prevProps.isShow) {
      let type = this.props.isShow ? 'addEventListener' : 'removeEventListener';
      document[type]('touchmove', this.handlePrevent, { passive: false });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('touchmove', this.handlePrevent);
  }

  handleInitPos = () => {
    if (!this.props.initVal.length) {
      return;
    }

    let aPos = this.props.list.map((item, index) => item.findIndex(obj => obj.val === this.props.initVal[index]));

    if (aPos.includes(-1)) {
      throw Error('初始化失败，请核对数据有效性');
    }

    [...this.refs.listInner.children].forEach((item, index) => {
      let val = -css(item.children[0], 'height') * aPos[index];
      css(item, 'translateY', val);
    });

    this.props.handleInit({ index: aPos, _: 'index-初始化索引' });
  };

  handleCssPos = () => {
    if (!this.props.linkageVal.length) {
      return;
    }

    let aPos = this.props.list.map((item, index) => item.findIndex(obj => obj.val === this.props.linkageVal[index]));

    [...this.refs.listInner.children].forEach((item, index) => {
      let val = aPos[index];
      if (val !== -1) {
        css(item, 'translateY', -css(item.children[0], 'height') * val);
      }
    });
  };

  handleStart = (elIndex, e) => {
    let now = +new Date();
    if (now - touch.lastTime < touch.interval) {
      return (touch.init = false);
    }

    touch.init = true;
    touch.lastTime = now;
    touch.elIndex = elIndex;
    touch.el = this.refs.listInner.children[elIndex];
    touch.diffY = 0;
    touch.startY = e.changedTouches[0].pageY;
    touch.oldVal = css(touch.el, 'translateY');
  };

  handleMove = e => {
    if (!touch.init) {
      return;
    }

    touch.diffY = e.changedTouches[0].pageY - touch.startY;
    touch.dir = touch.diffY < 0 ? 'up' : 'down';
    css(touch.el, 'translateY', touch.oldVal + touch.diffY);
  };

  handleEnd = () => {
    if (!touch.init) {
      return;
    }

    let el = touch.el;
    let height = css(el.children[0], 'height');
    let maxHeight = height * (el.children.length - 1);
    let targetY = css(el, 'translateY');

    if (touch.dir === 'up') {
      targetY -= (targetY % height) + height;
    } else {
      targetY -= targetY % height;
    }

    // 超过每项高度的1/3才滑动，否则还原位置
    if (Math.abs(touch.diffY) < height / 3) {
      targetY = touch.oldVal;
    }

    if (targetY > 0) {
      targetY = 0;
    } else if (targetY < -maxHeight) {
      targetY = -maxHeight;
    }
    MTween({
      el,
      target: { translateY: targetY },
      type: 'easeOut',
      time: 100,
      callBack: () => this.props.handleOver(this.handleResult(touch.elIndex))
    });
  };

  handleResult = (elIndex = -1) => {
    let obj = {
      bool: true,
      index: [],
      meta: [],
      val: [],
      _: 'bool-是否正常,index-最终索引,meta-最终数据,val-最终结果'
    };

    [...this.refs.listInner.children].forEach((item, index) => {
      let msg = '警告:心急吃不了热豆腐';
      let children = item.children;
      let nowIndex = Math.abs(css(item, 'translateY') / css(children[0], 'height'));
      if (children[nowIndex]) {
        obj.index.push(nowIndex);
        obj.meta.push(this.props.list[index][nowIndex]);
        obj.val.push(children[nowIndex].dataset.val);
      } else {
        obj.index.push(msg);
        obj.meta.push(msg);
        obj.val.push(msg);
        obj.bool = false;
      }
    });

    if (elIndex !== -1) {
      obj.which = elIndex;
      obj._ = 'bool-是否正常,index-联动前索引,meta-联动前数据,val-联动前结果,which-联动前操作列索引';
    }
    return obj;
  };

  handleConfirm = () => {
    this.props.handleConfirm(this.handleResult());
  };

  handleCancel = () => {
    this.props.handleCancel(this.handleResult());
  };

  handlePrevent = e => {
    e.preventDefault();
  };

  render() {
    let {
      props: { list, isShow, cancelText, confirmText },
      handleCancel,
      handleConfirm,
      handleStart,
      handleMove,
      handleEnd
    } = this;

    return (
      <div className={classNames('linkageBase-wrap', { hide: !isShow })}>
        <div className="holder-box" onClick={handleCancel} />
        <div className="main-box">
          <div className="btn-bar">
            <div className="btn btn-cancel" onClick={handleCancel}>
              {cancelText}
            </div>
            <div className="btn btn-submit" onClick={handleConfirm}>
              {confirmText}
            </div>
          </div>
          <div className="list-outer">
            <div className="list-inner" ref="listInner">
              {list.map((item, index) => (
                <div className="list-box" style={{ width: 100 / list.length + '%' }} key={index} onTouchStart={e => handleStart(index, e)} onTouchMove={handleMove} onTouchEnd={handleEnd} onTouchCancel={handleEnd}>
                  {item.map((_item, _index) => (
                    <div className="item-box" data-val={_item.val} key={index + '-' + _index}>
                      {_item.val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="line-box">
              {list.map((item, index) => (
                <div className="line" key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
