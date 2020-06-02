import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import CloseBtn from './HullCompareCloseBtn';

const CardHeading = function render(props) {
  const style = {
    backgroundColor: props.color,
  };
  return (
    <div className="card-heading" style={style}>
      <Link to={`/hull/${props.title}`}>
        <div className="pull-left panel-title">{props.title}</div>
      </Link>
      <div className="pull-right line-height-30">
        <CloseBtn hull={props.title} removeHull={props.removeHull} />
      </div>
    </div>
  );
};

CardHeading.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  removeHull: PropTypes.func.isRequired,
};

CardHeading.defaultProps = {
  title: 'Title',
  color: '#f5f5f5',
};

const Card = function render(props) {
  return (
    <div className="card-background">
      <CardHeading title={props.title} color={props.color} removeHull={props.removeHull} />
      {props.children}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  removeHull: PropTypes.func.isRequired,
};

Card.defaultProps = {
  title: 'Title',
  color: '#f5f5f5',
};

export default Card;
