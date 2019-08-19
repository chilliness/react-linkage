import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkBase from '../linkageBase';

export default class index extends Component {
  static propTypes = {
    initVal: PropTypes.array,
    isShow: PropTypes.bool,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    handleConfirm: PropTypes.func,
    handleCancel: PropTypes.func,
    handleOver: PropTypes.func,
    handleInit: PropTypes.func
  };

  static defaultProps = {
    initVal: [],
    isShow: false,
    cancelText: '取消',
    confirmText: '确定',
    handleConfirm: () => {},
    handleCancel: () => {},
    handleOver: () => {},
    handleInit: () => {}
  };

  constructor(props) {
    super(props);

    let hourList = Array.from(Array(24).keys(), num => ({
      val: String(num).padStart(2, '0')
    }));
    let minuteList = Array.from(Array(60).keys(), num => ({
      val: String(num).padStart(2, '0')
    }));
    let secondList = Array.from(Array(60).keys(), num => ({
      val: String(num).padStart(2, '0')
    }));

    this.state = {
      list: [hourList, minuteList, secondList]
    };
  }

  handleConfirm = e => {
    this.props.handleConfirm(e);
  };

  handleCancel = e => {
    this.props.handleCancel(e);
  };

  handleOver = e => {
    this.props.handleOver(e);
  };

  handleInit = e => {
    this.props.handleInit(e);
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

    return <LinkBase {...props} list={list} handleConfirm={e => handleConfirm(e)} handleCancel={e => handleCancel(e)} handleOver={e => handleOver(e)} handleInit={e => handleInit(e)} />;
  }
}
