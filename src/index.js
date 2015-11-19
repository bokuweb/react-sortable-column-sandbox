import React from 'react';
import { render } from 'react-dom';
import Demo from './Demo';
import Resizable from './resizable';

render(<div>
       <Resizable width='200' height='500' minWidth='100' minHeight='100' customStyle={{border:'solid 1px #ccc'}}><div><div>cc</div>aaaああああああああ</div><div>bb</div></Resizable>
       <Resizable minWidth='200' customStyle={{border:'solid 1px #ccc'}}><div><div>cc</div>aaa</div><div>bb</div></Resizable>
       </div>
       , document.querySelector('#content'));
