import React from "react";

const ParentComponent = (props:any) => (
    <div>
      <div id="children-pane">
        {props.children}
      </div>
    </div>
  );
export default ParentComponent;