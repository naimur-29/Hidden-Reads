import React, { ReactNode } from "react";

// Types:
type ComponentPropTypes = {
  children: ReactNode;
  isModalActive: boolean;
  containerClass: string;
  toggler: ReactNode;
};

const ToggleModal: React.FC<ComponentPropTypes> = ({
  children,
  isModalActive,
  containerClass,
  toggler,
}) => {
  return (
    <div className={containerClass} data-active={String(isModalActive)}>
      {/* Icon/Toggler */}
      {toggler}

      {/* Actual Data/Modal */}
      {isModalActive ? children : <></>}
    </div>
  );
};

export default ToggleModal;
