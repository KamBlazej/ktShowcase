import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ArrayFunc from '../../functions/ArrayFunc';
import { disableMessage } from '../../actions/gameActions';

import _ from 'lodash';



class LeaveGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sa:props.state.stateApp,sg:props.state.stateGame, status:0};
    this.ArrayFunc= new ArrayFunc;
    this.s={
        zIndex:"99999",
        fontSize:"30px",
        position:"fixed",
        background:"white",
        border:"solid black 1px",
        borderRadius:"12px",
        textAlign:"center",
        cursor:"pointer"
    };
  }

  componentDidMount() {
  }
    
  componentWillReceiveProps(p)
  {    
    if(!_.isEqual(p.state.stateApp.window, this.state.sa.window) )
    {
        this.setState({sa:p.state.stateApp});
    }
    if(!_.isEqual(p.state.stateGame.info.status, this.state.sg.info.status))
    {
    this.setState({sg:p.state.stateGame});
    }
  }
  shouldComponentUpdate(np, ns) {
    var render=false;
        ///// status zmienia się przy wciśnięciu przycisku QUIT lub STAY
        ///// sg.info.status zmienia się gdy gra się rozpocznie lub zakończy
        if(!_.isEqual(ns.status, this.state.status))
        {
            render=true;
        }
        else if(ns.sg.info && this.state.sg.info)
        {
            if(!_.isEqual(ns.sg.info.status, this.state.sg.info.status))
            {
                render=true;
            }
        }
        else if(!ns.sg.info || !this.state.sg.info)
        {
            render=true;
        }
    return render;
  }
  componentWillUnmount() {

  }
    componentWillUpdate()
    {

    }
  componentDidUpdate()
    {

    }
    end = () =>
    {
        this.setState({status:1});
    }
    back = () =>
    {
        this.setState({status:0}); 
    }
    ///// leave game daje informacje do "parenta" aby zakończyć gre który z kolei wysyła informacje do serwera
    leaveGame = () =>
    {
        this.props.leaveGame();
    }
    /////// przycisk quit po prawej stronie, po wciśnieciu pojawi się jeszcze prompt czy na pewno chcesz wyjść
    renderEnd = () =>
    {

        var sa=this.state.sa;
        var s={};
        var win=sa.window;
        var w=win.w*0.1;
        var h=win.h*0.07;
        var x=win.w*0.89;
        var y=win.h*0.5;
        var st=_.cloneDeep(this.s);
        st.width=w+"px";
        st.height=h+"px";
        st.left=x+"px";
        st.top=y+"px";
            return (<div style={st} onClick={this.end}>QUIT</div>);
    }
    /////// wyświetla prompt
    renderC = () =>
    {
        var sa=this.state.sa;
        var s={};
        var win=sa.window;
        var w=win.w*0.3;
        var h=win.h*0.25;
        var x=win.w*0.35;
        var y=win.h*0.4;
        var st=_.cloneDeep(this.s);
        st.width=w+"px";
        st.height=h+"px";
        st.left=x+"px";
        st.top=y+"px";
        return (<div style={st}>
                        Are You Sure You Want to Leave The Current Game? <br/>
                    <div onClick={this.leaveGame} style={{marginRight:"10px", border:"1px solid black"}} className="inline" >QUIT</div><div style={{border:"1px solid black"}} onClick={this.back} className="inline">STAY</div>
                </div>);
    }
    ////// wyświetl przycisk po prawej lub prompt potwierdzenia w zależności od state "status"
    renderLeave = () =>
    {
        var ren;
        if(this.state.sg.info.status=="game")
        {
            if(this.state.status==0)
            {
            ren=this.renderEnd();
            }
            else if(this.state.status==1)
            {
                ren=this.renderC();
            }
            return (<div>{ren}</div>);
        }
        else
        {
            return null;
        }
        
    }
  render() {
        var renderLeave=this.renderLeave();
    return (
            <div>
              {renderLeave}
            </div>
        );
        

  }
}
LeaveGame.propTypes = {
    state: PropTypes.object
};

const mapStateToProps = (state) => {
    return {
        state: state
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        disableMessage: data => dispatch(disableMessage(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveGame);