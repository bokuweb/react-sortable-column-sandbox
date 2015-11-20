import React, {Component, PropTypes} from 'react';
import Resizer from './resizer';

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

export default class Risizable extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      width: this.props.width,
      height: this.props.height
    }
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onMouseUp() {
    this.state.isActive = false;
    this.props.onResizeStop();
  }

  onResizerMouseDown(axis, event) {
    this.props.onResizeStart(axis);
    this.state.original = {
      x : event.clientX,
      y : event.clientY,
      width : this.refs.resizable.clientWidth,
      height : this.refs.resizable.clientHeight
    }
    this.state.isActive = true;
    this.state.resizeAxis = axis;
  }

  onMouseDown(event) {
    this.props.onMouseDown(event);
  }

  onTouchStart(event) {
    this.props.onTouchStart(event);
  }

  onMouseMove(event) {
    if (!this.state.isActive) return;
    const {resizeAxis, original} = this.state;
    const {minWidth, maxWidth, minHeight, maxHeight} = this.props;
    if (resizeAxis.indexOf('x') !== -1) {
      const newWidth = original.width + event.clientX - original.x;
      const min = (minWidth < 0 || minWidth === undefined)? 0 : minWidth;
      const max = (maxWidth < 0 || maxWidth === undefined)? newWidth : minWidth;
      this.state.width = clamp(newWidth, min, max);
    }
    if (resizeAxis.indexOf('y') !== -1) {
      const newHeight = original.height + event.clientY - original.y;
      const min = (minHeight < 0 || minHeight === undefined)? 0 : minHeight;
      const max = (maxHeight < 0 || maxHeight === undefined)? newHeight : minHeight;
      this.state.height = clamp(newHeight, min, max);
    }
    this.props.onChange(event, this.state.width, this.state.height);
    this.forceUpdate();
  }

  render() {
    const style = {
      width: this.state.width + 'px',
      height: this.state.height + 'px'
    }
    const canResize = (this.props.canResize === undefined)
            ? {x: true, y: true, xy: true }
            : this.props.canResize;

    return (
      <div ref='resizable'
           style={Object.assign({}, this.props.customStyle, style)}
           className={this.props.customClass}
           onMouseDown={this.onMouseDown.bind(this)}
           onTouchStart={this.onTouchStart.bind(this)} >
        {this.props.children}
        {(canResize.x  !== false)? <Resizer type={'x'}  onMouseDown={this.onResizerMouseDown.bind(this, 'x')} /> : ''}
        {(canResize.y  !== false)? <Resizer type={'y'}  onMouseDown={this.onResizerMouseDown.bind(this, 'y')} /> : ''}
        {(canResize.xy !== false)? <Resizer type={'xy'} onMouseDown={this.onResizerMouseDown.bind(this, 'xy')} /> : ''}
      </div>
    );
  }
}

Risizable.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number
};
