import React from "react";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";

const Notification = () => {
  const message = useSelector((state) => state.notification.message);
  const error = useSelector((state) => state.notification.error);
  if (message === null) {
    return null;
  }

  if (error) {
    return <Alert severity="error">{message}</Alert>;
  } else {
    return <Alert severity="success">{message}</Alert>;
  }
};

export default Notification;
