import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkBase from '../linkageBase';

export default class index extends Component {
  static propTypes = {
    initVal: PropTypes.array,
    isShow: PropTypes.bool.isRequired,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    emitConfirm: PropTypes.func,
    emitCancel: PropTypes.func,
    emitOver: PropTypes.func,
    emitInit: PropTypes.func
  };

  static defaultProps = {
    initVal: [],
    cancelText: '取消',
    confirmText: '确定',
    emitConfirm: () => {},
    emitCancel: () => {},
    emitOver: () => {},
    emitInit: () => {}
  };

  constructor(props) {
    super(props);

    let yearList = [];
    let range = { min: -5, max: 5 };
    let year = String(new Date().getFullYear());

    for (let i = range.min; i <= range.max; i++) {
      yearList.push({ val: String(+year + i) });
    }

    let monthList = Array(12)
      .fill('')
      .map((v, i) => ({
        val: String(i + 1).padStart(2, '0')
      }));
    let dateList = Array(31)
      .fill('')
      .map((v, i) => ({
        val: String(i + 1).padStart(2, '0')
      }));

    this.state = {
      list: [yearList, monthList, dateList],
      linkageVal: []
    };
  }

  componentDidMount() {
    this.handleInitPos();
  }

  handleInitPos = () => {
    if (!this.props.initVal.length) {
      return;
    }

    let [year, month, date] = this.initVal;
    let oYear = this.state.list[0].find(item => item.val === year);
    if (oYear === undefined) {
      return;
    }

    let oMonth = this.state.list[1].find(item => item.val === month);
    if (oMonth === undefined) {
      return;
    }

    let oDate = this.state.list[2].find(item => item.val === date);
    if (oDate === undefined) {
      return;
    }

    let days = new Date(year, month, 0).getDate();
    let dateList = Array(days)
      .fill('')
      .map((v, i) => ({
        val: String(i + 1).padStart(2, '0')
      }));
    this.setState({ list: [this.state.list[0], this.state.list[1], dateList] });
  };

  handleConfirm = e => {
    this.props.emitConfirm(e);
  };

  handleCancel = e => {
    this.props.emitCancel(e);
  };

  handleOver = e => {
    let { which, val, bool } = e;
    this.props.emitOver(e);

    // 这步判断是必须的，防止获取不到数据报错
    if (!bool) {
      return;
    }

    if (which !== 2) {
      let days = new Date(val[0], val[1], 0).getDate();
      let dateList = Array(days)
        .fill('')
        .map((v, i) => ({
          val: String(i + 1).padStart(2, '0')
        }));
      this.setState({ list: [this.state.list[0], this.state.list[1], dateList] });

      if (days < val[2]) {
        this.setState({ linkageVal: [null, null, String(days).padStart(2, '0')] });
      }
    }
  };

  handleInit = e => {
    this.props.emitInit(e);
  };

  render() {
    let {
      props,
      state: { list, linkageVal },
      handleConfirm,
      handleCancel,
      handleOver,
      handleInit
    } = this;

    return <LinkBase {...props} list={list} linkageVal={linkageVal} emitConfirm={e => handleConfirm(e)} emitCancel={e => handleCancel(e)} emitOver={e => handleOver(e)} emitInit={e => handleInit(e)} />;
  }
}
