import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';

/////// komponent który wykonuje animacje na "child" komponencie

    /// status - on/off animacje
    /// startStyle - style które sie nie zmieniają
    /// frames - klatki w których style sie zmieniają
    /// acts aktualne style które przypisuje do "child"
    /// timer - co 20 ms zmienia acts i wyświetla animacje

    /* przykład frames
    [
        {s:{left:ax, top: ay},o:{duration:400}},
        {s:{left: row.info.posX, top: row.info.posY},o:{duration:400}}
        ] */
    
class AnimC extends React.Component {
  constructor(props) {
    super(props);
    var timer = setInterval(this.intervals, 20);
     this.state = {status:this.props.status,startStyle:this.props.startStyle,actFrame:0,frames:this.props.frames,acts:null,timer:timer};
  }

  componentDidMount() {
        if(this.state.status)
        {
            this.intervals();
        }
  }

  componentWillUnmount() {
      this.reset(); 
  }
  componentWillReceiveProps(p)
  {
    if(p.status && !this.state.status)
    {
        this.intervals();
    }
  }
 componentDidUpdate()
 {   
   
 }
 reset = () =>
 {
     clearInterval(this.state.timer);
     this.setState({status:false,actFrame:0,acts:null,startStyle:null,frames:[]});
 }
 forceUnm = (type) =>
 {
     if(type)
    {
         this.reset();
    }
 }

 generateEndCall = (end) =>
 {
    
     var callInfo;
     this.props.callInfo ? callInfo=_.cloneDeep(this.props.callInfo) : callInfo={type:"unknown"};
     var frame=_.cloneDeep(this.state.actFrame);
     this.props.callEnd(frame,end,callInfo);
 }
 intervals = () =>
 {
     if(this.state.status)
    {
        const start=this.state.startStyle;
        var acts=this.state.acts;
        const frame=this.state.frames;
        var actFrame=this.state.actFrame;
        var nFrame;
        const pf=20;
        var dur;
        const _this=this;
        
        
        //// jeżeli zapomne ustalić ms dla danego "frame" domyślne "duration" wynosi 1000
        if(frame[actFrame].o.duration)
        {
            dur=frame[actFrame].o.duration;
        }
        else
        {
            dur=1000;
        }
        if(frame.length<=actFrame+1)
        {
            nFrame=null;
        }
        else
        {
            nFrame=actFrame+1;
        }
        let style={};
        let allOver=false; 
       ////// jeżeli animacja nie została zakończona wykonaj kolejny krok w animacji
        ///// oblicza o ile zmienić dany styl, jeżeli aktualny styl jest większy lub równy stylowi do którego dąży, przeskocz do next frame lub zakończ animacje

        if(nFrame && acts)
        {
            allOver=true;
            Object.keys(acts).forEach(function(key,index) {
                var act=_.cloneDeep(frame[actFrame].s[key]);
                var next=_.cloneDeep(frame[nFrame].s[key]);
                if(key!=="opacity")
                {
                act=parseInt(act);
                next=parseInt(next);
                }
                    if(act>next)
                    {
                        const diff=act-next;
                        const f=diff/(dur/pf);
                        if(_this.props.nr==0)
                        {
                            //console.log(act);
                            //console.log(next); 
                        }
                        if(acts[key]>next)
                        {
                            acts[key]=acts[key]-f;
                            if(acts[key]<next)
                            {
                                if(key!=="opacity")
                                    {
                                    acts[key]=_.cloneDeep(parseInt(next));
                                    }
                                    else
                                    {
                                    acts[key]=_.cloneDeep(next);    
                                    }
                            }
                            allOver=false;
                        }
                        else
                        {
                            if(key!=="opacity")
                            {
                            acts[key]=_.cloneDeep(parseInt(next));
                            }
                            else
                            {
                            acts[key]=_.cloneDeep(next);    
                            }
                            
                        }
                    }
                    else if(act<next)
                    {
                        const diff=next-act;
                        const f=diff/(dur/pf);
                          if(_this.props.nr==0)
                        {
                            //console.log(act);
                            //console.log(next);
                        }
                        if(acts[key]<next)
                        {
                            acts[key]=acts[key]+f;
                            if(acts[key]>next)
                                {
                                    if(key!=="opacity")
                                        {
                                        acts[key]=_.cloneDeep(parseInt(next));
                                        }
                                        else
                                        {
                                        acts[key]=_.cloneDeep(next);    
                                        }
                                }
                            allOver=false;
                        }
                        else
                        {
                            if(key!=="opacity")
                            {
                            acts[key]=_.cloneDeep(parseInt(next));
                            }
                            else
                            {
                            acts[key]=_.cloneDeep(next);    
                            }
                        }
                    }
                        //var diff=acts[key]-nFrame[key]; 
                        //diff=Math.abs(diff);
            });
        }
        /////// jeżeli aktualne style nie zostały jeszcze ustalone, pobierz je z pierwszego "frame"
        if(!acts)
        {
            acts=_.cloneDeep(frame[actFrame].s);
        }
        //// jeżeli nie ma już kolejnych klatek zakończ animacje
        if(!nFrame)
        {   
            this.setState({status:false,actFrame:0,acts:null,startStyle:null,frames:[]});
            _this.generateEndCall(true);
        }
        else if(allOver && nFrame)
        {
            if(frame[actFrame].o.hide)
            {
                acts.opacity=0;
                this.setState({status:false,actFrame:0,acts:null,startStyle:null,frames:[]});
                _this.generateEndCall(true);
            }
            else
            {
                this.setState({acts:acts,actFrame:actFrame+1});
                _this.generateEndCall(false);
            }
            
        }
        else if(!allOver && nFrame)
        {
            this.setState({acts:acts});
        }
        else
        {
            //console.log("nothing");
        }
    }
    else
    {
                //console.log("not even a state");
    }
    

 }
 animRender = () =>
 {       
    //////// jeżeli animacja jest w toku pobierz aktualne style.
        //// startowe style dodaj do tych z aktualneego "frame"
     if(this.state.status)
    {
        const start=this.state.startStyle;
        var acts=this.state.acts;
        const frame=this.state.frames;
        var actFrame=this.state.actFrame;
        var style={};
        if(!acts)
        {
            acts=_.cloneDeep(frame[actFrame].s);
        }
        Object.keys(start).forEach(function(key,index) {
                        style[key]=_.cloneDeep(start[key]);
                        });
        Object.keys(acts).forEach(function(key,index) {
                        style[key]=_.cloneDeep(acts[key]);
                        });
        
        return style;
    }
    else 
    {
        /////////////// jeżeli komponent nie został jeszcze usunięty pomimo tego że jego status jest false, wyświetl ostatnią klatke aby uniknąć błędów. 
        var style={};
        const start=this.props.startStyle;
        const frame=this.props.frames;
        const lFrame=frame[frame.length-1].s;
        Object.keys(start).forEach(function(key,index) {
                        style[key]=_.cloneDeep(start[key]);
                        });
        Object.keys(lFrame).forEach(function(key,index) {
                        style[key]=_.cloneDeep(lFrame[key]);
                        });
        return style;
    }
 }
 //////// przypisz style do "child"
  render() {
      const _this=this;
    const styler=this.animRender();
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       style: styler,
       unm:  _this.forceUnm
     })
    );

    return <div>{childrenWithProps}</div>
  }
}
AnimC.propTypes = {
    startStyle: PropTypes.object,
    status: PropTypes.bool,
    frames:PropTypes.array
};



export default AnimC;

