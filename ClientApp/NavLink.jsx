import React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavLink = (props) => {
  const location = useLocation();
  const history = useHistory();
  const isActive = history.isActive ? history.isActive(props.to, true) : location.pathname === props.to;
  const className = isActive ? 'active' : '';

  return (
    <li className={className}>
      <Link {...props} />
    </li>
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
};

export default NavLink;
