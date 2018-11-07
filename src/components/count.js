import React from 'react';
import PropTypes from 'prop-types';

const Count = ({ count }) => (
  <div>
    <span className="count">{count}</span>
  </div>
);

Count.propTypes = {
  count: PropTypes.number.isRequired,
};

export default Count;
