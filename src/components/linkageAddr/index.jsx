import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkBase from '../linkageBase';
import { provList, cityList, areaList } from './js/metadata.js';

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

  state = {
    list: [provList, cityList, areaList],
    linkageVal: [],
    lastIndex: ''
  };

  componentDidMount() {
    this.handleInitPos();
  }

  handleInitPos = () => {
    if (!this.props.initVal.length) {
      return;
    }

    let [prov, city, area] = this.props.initVal;
    let oProv = provList.find(item => item.val === prov);
    if (oProv === undefined) {
      return;
    }

    let oCity = oProv.pro_cities.find(item => item.val === city);
    if (oCity === undefined) {
      return;
    }

    let oArea = oCity.city_areas.find(item => item.val === area);
    if (oArea === undefined) {
      return;
    }

    this.setState({ list: [provList, oProv.pro_cities, oCity.city_areas] });
  };

  handleConfirm = e => {
    this.props.emitConfirm(e);
  };

  handleCancel = e => {
    this.props.emitCancel(e);
  };

  handleOver = e => {
    let { which, meta, index, bool } = e;
    let str = String(index);
    this.props.emitOver(e);

    // 这步判断是必须的，防止获取不到数据报错
    if (!bool) {
      return;
    }

    if (which === 0) {
      let citys = meta[0].pro_cities;
      let areas = citys[0].city_areas;
      let cityVal = citys[0].val;
      let areaVal = areas[0].val;

      if (this.state.lastIndex !== str) {
        this.setState({
          list: [this.state.list[0], citys, areas],
          linkageVal: [null, cityVal, areaVal]
        });
      }
    } else if (which === 1) {
      let areas = meta[1].city_areas;
      let areaVal = areas[0].val;

      if (this.state.lastIndex !== str) {
        this.setState({
          list: [this.state.list[0], this.state.list[1], areas],
          linkageVal: [null, null, areaVal]
        });
      }
    }
    // 记录上次的联动索引，用以判断当前操作是否联动数据
    this.setState({ lastIndex: str });
  };

  handleInit = e => {
    this.setState({ lastIndex: String(e.index) });
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
