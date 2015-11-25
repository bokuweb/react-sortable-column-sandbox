import React, {Component, PropTypes} from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import Resizable from './resizable';
import _ from 'lodash';

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  const _min = min || n;
  const _max = max || n;
  return Math.max(Math.min(n, _max), _min);
}

const springConfig = [500, 30];
const itemsCount = 5;

export default class Demo extends Component{
  constructor(props) {
    super(props);
    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      order: range(itemsCount),
      widthList: range(itemsCount).map(item => 0),
      isResizing: false
    };
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
    window.addEventListener('touchend', this.handleMouseUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  componentDidMount() {
    const width = _.map(this.refs.panes.children, child => child.clientWidth);
    this.setState({widthList: width});
  }

  handleResizeStart(axis) {
    this.setState({isResizing: true});
  }

  handleResizeStop() {
    this.setState({isResizing: false});
  }

  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseDown(pos, pressX, {pageX}) {
    this.setState({
      delta : pageX - pressX,
      mouse : pressX,
      isPressed : true,
      lastPressed :  pos
    });
  }

  handleMouseMove({pageX}) {
    const {isPressed, delta, order, lastPressed, widthList, isResizing} = this.state;
    if (isPressed && !isResizing) {
      const mouse = pageX - delta;
      console.log(mouse);
      const row = clamp(Math.round(this.getItemCountByPositionX(mouse)), 0, itemsCount - 1);
      const newOrder = reinsert(order, order.indexOf(lastPressed), row);
      const newWidthList = reinsert(widthList, order.indexOf(lastPressed), row);
      this.setState({mouse: mouse, order: newOrder, widthList: newWidthList});
    }
  }

  handleMouseUp() {
    this.setState({isPressed: false, delta: 0});
  }

  onChange(i, e, w, h) {
    let {widthList} = this.state;
    widthList[i] = w;
    this.setState({widthList});
    this.forceUpdate();
  }

  getItemCountByPositionX(x) {
    const {widthList} = this.state;
    let sum = 0;
    if (x < 0) return 0;
    for (let i = 0; i < widthList.length; i++) {
      sum += widthList[i] + 5;
      if (sum >= x) return i+1;
    }
    return widthList.length;
  }

  getItemPositionXByIndex(index) {
    const {widthList} = this.state;
    let sum = 0;
    for (let i = 0; i < index; i++) sum += widthList[i] + 5;
    return sum;
  }

  render() {
    const {mouse, isPressed, lastPressed, order} = this.state;

    return (
      <div ref='panes'>
        {range(itemsCount).map(i => {
          const style = lastPressed === i && isPressed
            ? {
                scale: spring(1.05, springConfig),
                shadow: spring(16, springConfig),
                x: mouse,
              }
            : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                x: spring(this.getItemPositionXByIndex(order.indexOf(i)), springConfig),
              };
          return (
            <Motion style={style} key={i}>
              {({scale, shadow, x}) =>
               <Resizable customClass="demo8-item" onChange={this.onChange.bind(this, order.indexOf(i))}
               canResize={{x:true, y:false, xy:false}}
               customStyle={{
                      boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                      transform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                      WebkitTransform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                      zIndex: i === lastPressed ? 99 : i,
                      position: 'absolute'
                    }}
               onMouseDown={this.handleMouseDown.bind(this, i, x)}
               onTouchStart={this.handleTouchStart.bind(this, i, x)}
               onResizeStart={this.handleResizeStart.bind(this)}
               onResizeStop={this.handleResizeStop.bind(this)} >
                 {i + 1}
               </Resizable>
              }
            </Motion>
          );
        })}
      </div>
    );
  }
}
