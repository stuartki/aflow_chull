import React from 'react';
import PropTypes from 'prop-types';
// import d3 from 'd3';

const propTypes = {
  id: PropTypes.string.isRequired,
  color1: PropTypes.string.isRequired,
  color2: PropTypes.string.isRequired,
};

const Gradient = props => (
  <defs>
    <linearGradient is id={props.id} x1="0%" y1="100%" x2="0%" y2="0%" spreadMethod="pad">
      <stop is offset="5%" stop-color={props.color1} stop-opacity={0.4} />
      <stop is offset="90%" stop-color={props.color2} stop-opacity={0.8} />
    </linearGradient>
  </defs>
);

Gradient.propTypes = propTypes;
export default Gradient;
