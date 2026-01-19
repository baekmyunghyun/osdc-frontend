import React from "react";

interface NodeData {
  id: number;
  x: number;
  y: number;
  pieType: string;
  duration?: string;
  delay?: string;
}

const ShardNode: React.FC<{ node: NodeData }> = ({ node }) => {
  const renderPieSegment = (type: string) => {
    const fillColor = "#989FAF";

    // Different pie types from Figma
    const pieTypes: Record<string, JSX.Element> = {
      "full-pie": (
        <path
          d="M60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30C0 18.5335 6.43302 8.56956 15.8868 3.52032L30 30V0C46.5685 0 60 13.4315 60 30Z"
          fill={fillColor}
        />
      ),
      quarter: (
        <path d="M0 0C16.5685 0 30 13.4315 30 30H0V0Z" fill={fillColor} />
      ),
      "half-pie": (
        <path
          d="M60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30H30V0C46.5685 0 60 13.4315 60 30Z"
          fill={fillColor}
        />
      ),
      "right-half": (
        <path
          d="M30 30C30 46.5685 16.5685 60 0 60V0C16.5685 0 30 13.4315 30 30Z"
          fill={fillColor}
        />
      ),
      "small-wedge": (
        <path
          d="M0 0V30L19.9605 7.6036C14.6576 2.87422 7.66448 0 0 0Z"
          fill={fillColor}
        />
      ),
      "wedge-down": (
        <path
          d="M0 0C16.5685 0 30 13.4315 30 30C30 41.0616 24.0133 50.7249 15.1033 55.9265L0 30V0Z"
          fill={fillColor}
        />
      ),
    };

    return (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        style={{
          position: "absolute",
          left: "-6px",
          top: "-6px",
          overflow: "visible",
        }}
      >
        {pieTypes[type] || pieTypes["full-pie"]}
      </svg>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: "48px",
        height: "48px",
        overflow: "visible",
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
          overflow: "hidden",
        }}
      >
        <div
          className="pie-fill-animation"
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            animationDuration: node.duration || "2s",
            animationDelay: node.delay || "0s",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "48px",
              height: "48px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {renderPieSegment(node.pieType)}
          </div>
        </div>
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
            zIndex: 10,
          }}
        >
          {node.id}
        </div>
      </div>
    </div>
  );
};

const CoordinationShardView: React.FC = () => {
  const nodes: NodeData[] = React.useMemo(() => {
    const rawNodes = [
      { id: 1, x: 529, y: 136, pieType: "full-pie" },
      { id: 2, x: 663, y: 191, pieType: "quarter" },
      { id: 3, x: 717, y: 324, pieType: "full-pie" },
      { id: 4, x: 663, y: 457, pieType: "half-pie" },
      { id: 5, x: 529, y: 509, pieType: "right-half" },
      { id: 6, x: 395, y: 457, pieType: "full-pie" },
      { id: 7, x: 341, y: 323, pieType: "right-half" },
      { id: 8, x: 395, y: 190, pieType: "half-pie" },
      { id: 9, x: 607, y: 32, pieType: "small-wedge" },
      { id: 10, x: 791, y: 172, pieType: "half-pie" },
      { id: 11, x: 823, y: 403, pieType: "right-half" },
      { id: 12, x: 681, y: 584, pieType: "full-pie" },
      { id: 13, x: 451, y: 615, pieType: "wedge-down" },
      { id: 14, x: 268, y: 474, pieType: "right-half" },
      { id: 15, x: 237, y: 245, pieType: "small-wedge" },
      { id: 16, x: 377, y: 62, pieType: "half-pie" },
      { id: 17, x: 824, y: 30, pieType: "right-half" },
      { id: 18, x: 931, y: 217, pieType: "full-pie" },
      { id: 19, x: 931, y: 431, pieType: "quarter" },
      { id: 20, x: 823, y: 618, pieType: "quarter" },
      { id: 21, x: 235, y: 618, pieType: "full-pie" },
      { id: 22, x: 127, y: 431, pieType: "wedge-down" },
      { id: 23, x: 126, y: 216, pieType: "small-wedge" },
      { id: 24, x: 189, y: 67, pieType: "wedge-down" },
      { id: 25, x: 955, y: 0, pieType: "half-pie" },
      { id: 26, x: 1045, y: 184, pieType: "right-half" },
      { id: 27, x: 1058, y: 393, pieType: "half-pie" },
      { id: 28, x: 991, y: 590, pieType: "wedge-down" },
      { id: 29, x: 115, y: 639, pieType: "wedge-down" },
      { id: 30, x: 13, y: 462, pieType: "small-wedge" },
      { id: 31, x: 0, y: 255, pieType: "quarter" },
      { id: 32, x: 67, y: 58, pieType: "full-pie" },
    ];

    return rawNodes.map((node) => ({
      ...node,
      duration: `${(Math.random() * 3 + 2).toFixed(2)}s`,
      delay: `${(Math.random() * 2).toFixed(2)}s`,
    }));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#E8E8E8",
        border: "1px solid #000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1106px",
          height: "687px",
        }}
      >
        {/* Connection Lines Layer */}
        <svg
          style={{
            position: "absolute",
            left: "-319px",
            top: "-748px",
            width: "2205px",
            height: "2205px",
          }}
          viewBox="0 0 2205 2205"
          fill="none"
        >
          <path
            d="M1506.07 1018.16L1528.35 803.953"
            stroke="black"
            strokeOpacity="0.25"
          />
          <path
            d="M699.671 1020L639.81 860.372"
            stroke="black"
            strokeOpacity="0.25"
          />
          <path
            d="M966.344 989L951.172 865.936"
            stroke="black"
            strokeOpacity="0.25"
          />

        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <ShardNode key={node.id} node={node} />
        ))}

        {/* Central Coordination Shard */}
        <svg
          style={{
            position: "absolute",
            left: "467px",
            top: "213px",
            width: "206px",
            height: "222px",
          }}
          width="206"
          height="222"
          viewBox="0 0 206 222"
          fill="none"
        >
          <path
            d="M193.834 155.238C185.197 171.747 172.147 185.971 155.904 196.58L87.6953 108.294L87.6953 -7.62939e-05C107.619 -7.71081e-05 127.218 4.64714 144.656 13.5067C162.095 22.3663 176.805 35.1488 187.409 50.658C198.013 66.1672 204.164 83.8962 205.288 102.186C206.412 120.476 202.471 138.73 193.834 155.238Z"
            fill="white"
          />
          <circle
            cx="87.3501"
            cy="134.296"
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
            <tspan x="14.1458" y="134.357">
              Coordination{" "}
            </tspan>
            <tspan x="54.1086" y="162.357">
              Shard
            </tspan>
          </text>
        </svg>

        {/* Snapshot 1 (Pink/Magenta) */}
        <svg
          style={{ position: "absolute", left: "611px", top: "120px" }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="10" cy="10" r="10" fill="#FF00FF" />
        </svg>

        {/* Snapshot 2 (Blue) */}
        <svg
          style={{ position: "absolute", left: "443px", top: "436px" }}
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
          top: "20px",
          right: "20px",
          padding: "15px 20px",
          backgroundColor: "#FFF",
          border: "1px solid #000",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" fill="#FF00FF" />
          </svg>
          <span
            style={{
              color: "#000",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "16px",
              whiteSpace: "nowrap",
            }}
          >
            selective local snapshot
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" fill="#0000FF" />
          </svg>
          <span
            style={{
              color: "#000",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "16px",
              whiteSpace: "nowrap",
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
