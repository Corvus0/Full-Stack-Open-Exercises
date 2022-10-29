import React from "react";
import PropTypes from "prop-types";

const Notification = ({ message, error }) => {
  if (message === null) {
    return null;
  }

  if (error) {
    return <div className="error">{message}</div>;
  } else {
    return <div className="success">{message}</div>;
  }
};

Notification.propTypes = {
  message: PropTypes.string,
  error: PropTypes.bool.isRequired,
};

export default Notification;
