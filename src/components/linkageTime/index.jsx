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

    let hourList = Array(24)
      .fill('')
      .map((v, i) => ({
        val: String(i).padStart(2, '0')
      }));
    let minuteList = Array(60)
      .fill('')
      .map((v, i) => ({
        val: String(i).padStart(2, '0')
      }));
    let secondList = Array(60)
      .fill('')
      .map((v, i) => ({
        val: String(i).padStart(2, '0')
      }));

    this.state = {
      list: [hourList, minuteList, secondList]
    };
  }

  handleConfirm = e => {
    this.props.emitConfirm(e);
  };

  handleCancel = e => {
    this.props.emitCancel(e);
  };

  handleOver = e => {
    this.props.emitOver(e);
  };

  handleInit = e => {
    this.props.emitInit(e);
  };

  render() {
    let {
      props,
      state: { list },
      handleConfirm,
      handleCancel,
      handleOver,
      handleInit
    } = this;

    return <LinkBase {...props} list={list} emitConfirm={e => handleConfirm(e)} emitCancel={e => handleCancel(e)} emitOver={e => handleOver(e)} emitInit={e => handleInit(e)} />;
  }
}
