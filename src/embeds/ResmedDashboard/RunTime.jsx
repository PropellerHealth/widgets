import React from "react";

const Runtime = ({ time = 0 }) => {
  const _mins   = Math.floor(time / 60);
  const _hrs    = Math.floor(_mins / 60);
  const days    = Math.floor(_hrs / 24);
  const hours   = Math.floor(_hrs - days * 24);
  const minutes = Math.floor(_mins - hours * 60);

  return (
    <div>
      <h5>Time in use</h5>
      <div style={{fontSize: "3rem"}}>
        {days > 0 ? `${days} days, ` : null}
        {hours > 0 ? `${hours} hours, ` : null}
        {minutes > 0 ? `${minutes} min` : null}
      </div>
    </div>
  );
};

export default Runtime;