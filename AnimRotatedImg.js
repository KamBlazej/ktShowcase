import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';


//////// wyświetla zdjęcie obrócone o dany kąt na podstawie danych z "props"
class AnimRotatedImg extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
 
  }
  componentWillReceiveProps(p)
  {

  }
 componentDidUpdate()
 {   
   
 }
 //////// oblicza kąt na podstawie koordynatów na których znajduje się zdjęcie, w stosunku do koordynatów miejsca w które ma być skierowane zdjęcie.
  countAngle = () =>
  {
      var start=this.props.start;
      var target=this.props.target;
      var startCenter=[start.posX+start.w/2, start.posY+start.h/2];
      var targetCenter=[target.posX+target.w/2, target.posY+target.h/2];
      var angle = Math.atan2(targetCenter[0]- startCenter[0],- (targetCenter[1]- startCenter[1]) )*(180/Math.PI);
      return angle;
  }
  ///////// pobiera style z "props" oraz kąt obrotu zdjęcia z CountAngle
  render() {
      const _this=this;
      var style=_.cloneDeep(this.props.style);
      var angle=this.countAngle();

      style.transform='rotate(' + angle + 'deg)';
      style.WebkitTransform='rotate(' + angle + 'deg)';
      style.MozTransform='rotate(' + angle + 'deg)';
    return (

        <img src={this.props.img} style={style}/>
        
    );
  }
}
AnimRotatedImg.propTypes = {
    style: PropTypes.object,
    start: PropTypes.object,
    target: PropTypes.object,
    img: PropTypes.string,
};


export default AnimRotatedImg;