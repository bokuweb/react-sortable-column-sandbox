import React from 'react';
import Resizer from './resizer';

function clamp(n, min, max) {
  const _min = min || n;
  const _max = max || n;
  return Math.max(Math.min(n, _max), _min);
}

export default class Risizable extends React.Component{
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
  }

  onMouseDown(axis, event) {
    this.state.original = {
      x : event.clientX,
      y : event.clientY,
      width : this.refs.resizable.clientWidth,
      height : this.refs.resizable.clientHeight
    }
    this.state.isActive = true;
    this.state.resizeAxis = axis;
  }

  onMouseMove(event) {
    if (!this.state.isActive) return;
    const {resizeAxis, original} = this.state;
    let {minWidth, maxWidth, minHeight, maxHeight} = this.props;

    if (resizeAxis.indexOf('x') !== -1) {
      const newWidth = original.width + event.clientX - original.x;
      this.state.width = clamp(newWidth, minWidth, maxWidth);
    }
    if (resizeAxis.indexOf('y') !== -1) {
      const newHeight = original.height + event.clientY - original.y;
      this.state.height = clamp(newHeight, minHeight, maxHeight);
    }
    this.forceUpdate();
  }

  render() {
    const style = {
      width: this.state.width + 'px',
      height: this.state.height + 'px',
      position: 'relative'
    }
    return (
      <div ref='resizable'
           style={Object.assign({}, this.props.customStyle, style)}
           className={this.props.customClass} >
        {this.props.children}
        <Resizer type={'x'} onMouseDown={this.onMouseDown.bind(this, 'x')} />
        <Resizer type={'y'} onMouseDown={this.onMouseDown.bind(this, 'y')} />
        <Resizer type={'xy'} onMouseDown={this.onMouseDown.bind(this, 'xy')} />
      </div>
    );
  }
}
