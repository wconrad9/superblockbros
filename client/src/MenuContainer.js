import React from "react";

const MenuContainer = ({ children, style }) => {
  return (
    <div className="menu" style={style}>
      {children}
    </div>
  );
};

export default MenuContainer;
