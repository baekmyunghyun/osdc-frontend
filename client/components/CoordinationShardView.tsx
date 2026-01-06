import React from "react";

interface NodeData {
  id: number;
  x: number;
  y: number;
  pieType: string;
}

// Component for rendering individual node with pie segment
const ShardNode: React.FC<{ node: NodeData }> = ({ node }) => {
  const renderPieSegment = (type: string) => {
    const fillColor = "#989FAF";
    
    const pieSegments: Record<string, JSX.Element> = {
      "full-pie": (
        <svg width="60" height="60" viewBox="0 0 48 48" fill="none" style={{ position: "absolute", left: "-6px", top: "-6px" }}>
          <path d="M54 24C54 40.5685 40.5685 54 24 54C7.43146 54 -6 40.5685 -6 24C-6 12.5335 0.433016 2.56956 9.88683 -2.47968L24 24V-6C40.5685 -6 54 7.43146 54 24Z" fill={fillColor}/>
        </svg>
      ),
      "quarter": (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", right: "-6.155px", top: "-6.076px" }}>
          <path d="M0 -6.07617C16.5685 -6.07617 30 7.35529 30 23.9238H0V-6.07617Z" fill={fillColor}/>
        </svg>
      ),
      "half-pie": (
        <svg width="60" height="60" viewBox="0 0 48 48" fill="none" style={{ position: "absolute", left: "-6px", top: "-6px" }}>
          <path d="M54 24C54 40.5685 40.5685 54 24 54C7.43146 54 -6 40.5685 -6 24H24V-6C40.5685 -6 54 7.43146 54 24Z" fill={fillColor}/>
        </svg>
      ),
      "right-half": (
        <svg width="30" height="60" viewBox="0 0 24 48" fill="none" style={{ position: "absolute", right: "-6px", top: "-6px" }}>
          <path d="M30 24C30 40.5685 16.5685 54 0 54V-6C16.5685 -6 30 7.43146 30 24Z" fill={fillColor}/>
        </svg>
      ),
      "small-wedge": (
        <svg width="19.96" height="30" viewBox="0 0 20 25" fill="none" style={{ position: "absolute", right: "4.04px", top: "-5.973px" }}>
          <path d="M0 -5.97266V24.0273L19.9605 1.63094C14.6576 -3.09844 7.66448 -5.97266 0 -5.97266Z" fill={fillColor}/>
        </svg>
      ),
      "wedge-down": (
        <svg width="30" height="55.927" viewBox="0 0 24 48" fill="none" style={{ position: "absolute", right: "-6px", top: "-6.076px" }}>
          <path d="M0 -6.07617C16.5685 -6.07617 30 7.35529 30 23.9238C30 34.9854 24.0133 44.6487 15.1033 49.8504L0 23.9238L0 -6.07617Z" fill={fillColor}/>
        </svg>
      ),
      "wedge-down-2": (
        <svg width="23.945" height="44.639" viewBox="0 0 24 45" fill="none" style={{ position: "absolute", right: "0.352px", top: "0" }}>
          <path d="M0 0C13.2245 0 23.945 10.7205 23.945 23.945C23.945 32.774 19.1666 40.4869 12.0549 44.6387L0 23.945V0Z" fill={fillColor}/>
        </svg>
      ),
      "half-pie-simple": (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ position: "absolute", left: "0", top: "0" }}>
          <path d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24H24V0C37.2548 0 48 10.7452 48 24Z" fill={fillColor}/>
        </svg>
      ),
      "quarter-simple": (
        <svg width="23.924" height="23.924" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", right: "-0.133px", top: "0" }}>
          <path d="M0 0C13.2128 0 23.9238 10.7111 23.9238 23.9238H0V0Z" fill={fillColor}/>
        </svg>
      ),
      "right-half-bottom": (
        <svg width="30" height="60" viewBox="0 0 24 48" fill="none" style={{ position: "absolute", right: "-6px", bottom: "-6.049px" }}>
          <path d="M30 24.0488C30 40.6174 16.5685 54.0488 0 54.0488V-5.95117C16.5685 -5.95117 30 7.48029 30 24.0488Z" fill={fillColor}/>
        </svg>
      ),
      "right-half-2": (
        <svg width="30" height="60" viewBox="0 0 24 48" fill="none" style={{ position: "absolute", right: "-6.277px", top: "-6px" }}>
          <path d="M30 24C30 40.5685 16.5685 54 0 54V-6C16.5685 -6 30 7.43146 30 24Z" fill={fillColor}/>
        </svg>
      ),
      "small-wedge-2": (
        <svg width="19.96" height="30" viewBox="0 0 20 24" fill="none" style={{ position: "absolute", right: "4.04px", top: "-6.077px" }}>
          <path d="M0 -6.07715V23.9229L19.9605 1.52645C14.6576 -3.20293 7.66448 -6.07715 0 -6.07715Z" fill={fillColor}/>
        </svg>
      ),
      "right-half-3": (
        <svg width="30" height="60" viewBox="0 0 24 48" fill="none" style={{ position: "absolute", right: "-6px", bottom: "-6.002px" }}>
          <path d="M30 24.002C30 40.5705 16.5685 54.002 0 54.002L0 -5.99805C16.5685 -5.99805 30 7.43341 30 24.002Z" fill={fillColor}/>
        </svg>
      ),
      "quarter-2": (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", right: "-6px", top: "-6px" }}>
          <path d="M0 -6C16.5685 -6 30 7.43146 30 24H0V-6Z" fill={fillColor}/>
        </svg>
      ),
      "small-wedge-3": (
        <svg width="19.96" height="30" viewBox="0 0 20 24" fill="none" style={{ position: "absolute", right: "4.04px", top: "-6px" }}>
          <path d="M0 -6V24L19.9605 1.6036C14.6576 -3.12578 7.66448 -6 0 -6Z" fill={fillColor}/>
        </svg>
      ),
    };
    
    return pieSegments[type] || null;
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: "48px",
        height: "48px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "48px",
          height: "48px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          borderRadius: "1000px",
          backgroundColor: "#000",
          position: "relative",
        }}
      >
        {renderPieSegment(node.pieType)}
        <div
          style={{
            alignSelf: "stretch",
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "24px",
            position: "relative",
          }}
        >
          {node.id}
        </div>
      </div>
    </div>
  );
};

const CoordinationShardView: React.FC = () => {
  const nodes: NodeData[] = [
    { id: 1, x: 529, y: 105, pieType: "full-pie" },
    { id: 2, x: 663, y: 130, pieType: "quarter" },
    { id: 3, x: 717, y: 293, pieType: "full-pie" },
    { id: 4, x: 663, y: 456, pieType: "half-pie" },
    { id: 5, x: 529, y: 478, pieType: "right-half" },
    { id: 6, x: 395, y: 456, pieType: "full-pie" },
    { id: 7, x: 341, y: 292, pieType: "right-half" },
    { id: 8, x: 395, y: 129, pieType: "half-pie" },
    { id: 9, x: 607, y: 0, pieType: "small-wedge" },
    { id: 10, x: 823, y: 214, pieType: "half-pie" },
    { id: 11, x: 823, y: 372, pieType: "right-half-bottom" },
    { id: 12, x: 607, y: 584, pieType: "full-pie" },
    { id: 13, x: 451, y: 584, pieType: "wedge-down" },
    { id: 14, x: 237, y: 374, pieType: "right-half-bottom" },
    { id: 15, x: 237, y: 214, pieType: "small-wedge-2" },
    { id: 16, x: 451, y: 0, pieType: "half-pie-simple" },
    { id: 17, x: 824, y: 69, pieType: "right-half-2" },
    { id: 18, x: 931, y: 136, pieType: "full-pie" },
    { id: 19, x: 931, y: 450, pieType: "quarter" },
    { id: 20, x: 823, y: 517, pieType: "quarter-simple" },
    { id: 21, x: 235, y: 517, pieType: "full-pie" },
    { id: 22, x: 127, y: 450, pieType: "wedge-down-2" },
    { id: 23, x: 126, y: 135, pieType: "small-wedge" },
    { id: 24, x: 235, y: 68, pieType: "wedge-down" },
    { id: 25, x: 1058, y: 33, pieType: "half-pie" },
    { id: 26, x: 1058, y: 214, pieType: "right-half-3" },
    { id: 27, x: 1058, y: 372, pieType: "half-pie" },
    { id: 28, x: 1058, y: 551, pieType: "wedge-down" },
    { id: 29, x: 0, y: 551, pieType: "wedge-down" },
    { id: 30, x: 0, y: 374, pieType: "small-wedge-3" },
    { id: 31, x: 0, y: 214, pieType: "quarter-2" },
    { id: 32, x: 0, y: 33, pieType: "full-pie" },
  ];

  const connections = [
    // Main SVG paths from Figma
    { d: "M107.995 102.417L237.256 180.354V338.129M107.995 102.417L0.298462 182.547M107.995 102.417L237.256 0.785156L0.298462 37.4011", offset: { x: 1076, y: 132 } },
    { d: "M106.498 226.054L343.017 263.463L216.31 158.478L106.498 226.054ZM106.498 226.054V82.4532L0.305725 0.395508", offset: { x: 970, y: 389 } },
    { d: "M212.809 86.1226L371.085 0.439941M212.809 86.1226L79.5234 105.164L0.980301 213.458H155.686L212.809 86.1226Z", offset: { x: 705, y: 470 } },
    { d: "M401.59 477.502L269.68 458.264L110.542 377.569M404.849 106.942L480.943 0.5H322.143L404.849 106.942ZM404.849 106.942L269.68 130.785M269.68 130.785L213.211 296.085L110.542 377.569M269.68 130.785L110.542 217.86V377.569M110.542 377.569L108.02 518.898L0.262512 452.423", offset: { x: 381, y: 97 } },
    { d: "M236.436 37.5672L126.941 106.653M126.941 106.653L0.5 1.06885V186.167M126.941 106.653L0.5 186.167M0.5 186.167L236.436 348.29M126.941 419.242L0.5 523.49V348.29L126.941 419.242Z", offset: { x: 253, y: 127 } },
    { d: "M55.4803 164.001L0.878784 1.04883L160.418 88.0704L55.4803 164.001Z", offset: { x: 687, y: 151 } },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#E8E8E8",
        border: "1px solid #000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "1106px",
          height: "632px",
        }}
      >
        {/* Connection Lines */}
        {connections.map((conn, idx) => (
          <svg
            key={idx}
            style={{
              position: "absolute",
              left: `${conn.offset.x}px`,
              top: `${conn.offset.y}px`,
              strokeWidth: "1px",
              stroke: "rgba(0, 0, 0, 0.25)",
              overflow: "visible",
            }}
          >
            <path d={conn.d} stroke="black" strokeOpacity="0.25" fill="none" />
          </svg>
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <ShardNode key={node.id} node={node} />
        ))}

        {/* Central Coordination Shard */}
        <svg
          style={{
            position: "absolute",
            left: "467px",
            top: "199px",
            width: "205px",
            height: "210px",
          }}
          width="206"
          height="211"
          viewBox="0 0 206 211"
          fill="none"
        >
          <path
            d="M193.834 166.054C185.197 183.713 172.147 198.928 155.904 210.276L87.6951 115.839L87.6951 4.57764e-05C107.619 4.49055e-05 127.217 4.97104 144.656 14.4479C162.095 23.9248 176.805 37.5978 187.409 54.1875C198.013 70.7773 204.164 89.7416 205.288 109.306C206.412 128.87 202.471 148.395 193.834 166.054Z"
            fill="white"
          />
          <circle
            cx="87.3501"
            cy="117.166"
            r="86.8501"
            fill="white"
            stroke="#16171A"
          />
          <text
            fill="#16171A"
            xmlSpace="preserve"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="24"
            fontWeight="bold"
            letterSpacing="-0.02em"
          >
            <tspan x="14.1454" y="117.227">
              Coordination{" "}
            </tspan>
            <tspan x="54.1083" y="145.227">
              Shard
            </tspan>
          </text>
        </svg>

        {/* Snapshot 1 (Pink/Magenta) - selective local snapshot */}
        <svg
          style={{ position: "absolute", left: "611px", top: "89px" }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="10" cy="10" r="10" fill="#FF00FF" />
        </svg>

        {/* Snapshot 2 (Blue) - global snapshot */}
        <svg
          style={{ position: "absolute", left: "443px", top: "405px" }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="10" cy="10" r="10" fill="#0000FF" />
        </svg>
      </div>

      {/* Legend - Top Right */}
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "293px",
          height: "84px",
          padding: "16px 24px",
          backgroundColor: "#FFF",
          border: "1px solid #000",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" fill="#FF00FF" />
          </svg>
          <span
            style={{
              color: "#000",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "20px",
            }}
          >
            selective local snapshot
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" fill="#0000FF" />
          </svg>
          <span
            style={{
              color: "#000",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "20px",
            }}
          >
            global snapshot
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoordinationShardView;
