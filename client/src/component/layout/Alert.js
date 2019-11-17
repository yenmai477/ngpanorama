import React from "react";

const Alert = ({ alert }) => {
  return (
    alert !== null && (
      <div className={`alert alert-${alert.type} animated fadeIn`}>
        <i className="fas fa-info-circle mr-1 animated fadeIn" />
        {alert.msg}
      </div>
    )
  );
};

export default Alert;
