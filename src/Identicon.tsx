import React from "react";

interface IdenticonProps {
  grid: number[];
  color: [number, number, number];
}

const Identicon: React.FC<IdenticonProps> = (props) => {
  return (
    <div className="grid">
      {Array(5)
        .fill(0)
        .map((row, i) => (
          <div className="row">
            {Array(5)
              .fill(0)
              .map((row, j) => {
                const isColoredSquare = props.grid.includes(i * 5 + j);
                return (
                  <div
                    className="square"
                    {...(isColoredSquare && {
                      style: { background: `rgb(${props.color})` },
                    })}
                  >
                  </div>
                );
              })}
          </div>
        ))}
    </div>
  );
};

export default Identicon;
