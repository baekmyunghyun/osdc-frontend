import React from "react";

import { Button } from "@/components/ui/button";

interface NodeData {
  id: number;
  x: number;
  y: number;
  duration?: string;
  delay?: string;
  isActive?: boolean;
}

const RAW_NODES = [
  { id: 1, x: 759, y: 164 },
  { id: 2, x: 913, y: 190 },
  { id: 3, x: 967, y: 352.5 },
  { id: 4, x: 913, y: 516 },
  { id: 5, x: 759, y: 538 },
  { id: 6, x: 605, y: 516 },
  { id: 7, x: 550, y: 352.17 },
  { id: 8, x: 605, y: 189 },
  { id: 9, x: 837, y: 60 },
  { id: 10, x: 1103, y: 274 },
  { id: 11, x: 1103, y: 432 },
  { id: 12, x: 837, y: 644 },
  { id: 13, x: 681, y: 644 },
  { id: 14, x: 417, y: 434 },
  { id: 15, x: 417, y: 274 },
  { id: 16, x: 681, y: 60 },
  { id: 17, x: 1104, y: 129 },
  { id: 18, x: 1261, y: 196 },     
  { id: 19, x: 1261, y: 510 },
  { id: 20, x: 1103, y: 577 },
  { id: 21, x: 415, y: 577 },
  { id: 22, x: 257, y: 510 },
  { id: 23, x: 256, y: 195 },
  { id: 24, x: 415, y: 128 },
  { id: 25, x: 1388, y: 93 },
  { id: 26, x: 1448, y: 274 },
  { id: 27, x: 1448, y: 432 },
  { id: 28, x: 1380, y: 611 },
  { id: 29, x: 130, y: 611 },
  { id: 30, x: 70, y: 434 },
  { id: 31, x: 70, y: 274 },
  { id: 32, x: 130, y: 93 },
];

const SHARD_CENTER_POS = RAW_NODES.reduce((acc, node) => {
  acc[node.id] = { x: node.x + 24, y: node.y + 24 };
  return acc;
}, {} as Record<number, { x: number; y: number }>);

// Shard 0 Center (calculated from svg position)
SHARD_CENTER_POS[0] = { x: 783.35, y: 375.11 };

const ShardNode: React.FC<{ node: NodeData }> = ({ node }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: "48px",
        height: "48px",
        overflow: "visible",
        zIndex: 42,
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
            // animationDelay: node.delay || "0s", // Controlled by playback
            opacity: node.isActive ? 1 : 0,
            transition: "opacity 0.2s",
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
              <circle cx="30" cy="30" r="30" fill="#989FAF" />
            </svg>
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

interface SnapshotParticle {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
  type: string;
}

const CoordinationShardView: React.FC = () => {
  const [shardStates, setShardStates] = React.useState<Record<number, { isActive: boolean; duration: number }>>({});
  const [snapshotParticles, setSnapshotParticles] = React.useState<SnapshotParticle[]>([]);
  const [speed, setSpeed] = React.useState(1.0);
  const speedRef = React.useRef(1.0);

  React.useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  React.useEffect(() => {
    let animationFrameId: number;
    let timeline: Record<number, Array<{ startOffset: number; endOffset: number; duration: number }>> = {};
    let snapshotTimeline: Array<{ id: string; startOffset: number; endOffset: number; duration: number; type: string; from: number; to: number }> = [];
    let playbackStart: number = 0;

    Promise.all([
      fetch("/api/logs/consensus").then((res) => res.json()),
      fetch("/api/logs/snapshots").then((res) => res.json())
    ])
      .then(([consensusData, snapshotData]) => {
        const parsedConsensus = (Array.isArray(consensusData) ? consensusData : [])
          .map((entry: any) => {
            if (!entry.start_timestamp || !entry.time || typeof entry.shard !== 'number') return null;
            return {
              shard: entry.shard,
              startTick: new Date(entry.start_timestamp.replace(" ", "T")).getTime(),
              durationSec: entry.time,
            };
          })
          .filter((e: any) => e !== null)
          .sort((a: any, b: any) => a.startTick - b.startTick);

        const parsedSnapshots = (Array.isArray(snapshotData) ? snapshotData : [])
          .map((entry: any, idx: number) => {
            if (!entry.from_timestamp || !entry.to_timestamp) return null;
            const startTick = new Date(entry.from_timestamp.replace(" ", "T")).getTime();
            const endTick = new Date(entry.to_timestamp.replace(" ", "T")).getTime();
            // Minimum visual duration of 500ms if real duration is too short for eye to see path
            let durationSec = (endTick - startTick) / 1000;
            // if (durationSec < 0.5) durationSec = 0.5; 
            
            return {
              id: `snap-${idx}`,
              startTick,
              durationSec,
              type: entry.type,
              from: entry.from_shard,
              to: entry.to_shard
            };
          })
          .filter((e: any) => e !== null);

        if (parsedConsensus.length === 0 && parsedSnapshots.length === 0) return;

        let baseTime = Date.now();
        if (parsedConsensus.length > 0) baseTime = parsedConsensus[0].startTick;
        if (parsedSnapshots.length > 0) {
           const snapStart = Math.min(...parsedSnapshots.map((s: any) => s.startTick));
           baseTime = Math.min(baseTime, snapStart);
        }

        // Build Consensus Timeline
        parsedConsensus.forEach((e: any) => {
          if (!timeline[e.shard]) timeline[e.shard] = [];
          const startOffset = e.startTick - baseTime;
          const durationMs = e.durationSec * 1000;
          
          timeline[e.shard].push({
            startOffset: startOffset,
            endOffset: startOffset + durationMs,
            duration: e.durationSec,
          });
        });

        // Build Snapshot Timeline
        parsedSnapshots.forEach((e: any) => {
           const startOffset = e.startTick - baseTime;
           // Ensure it has some duration for visualization
           const durationMs = Math.max(e.durationSec * 1000, 1000); 
           
           snapshotTimeline.push({
             id: e.id,
             startOffset: startOffset,
             endOffset: startOffset + durationMs,
             duration: durationMs / 1000,
             type: e.type,
             from: e.from,
             to: e.to
           });
        });

        // Start Animation Loop
        // playbackStart = Date.now();
        let lastFrameTime = Date.now();
        let elapsed = 0;

        const loop = () => {
          const now = Date.now();
          // const elapsed = now - playbackStart;
          const dt = now - lastFrameTime;
          lastFrameTime = now;
          elapsed += dt * speedRef.current;
          
          // 1. Update Shard States
          const newStates: Record<number, { isActive: boolean; duration: number }> = {};
          let hasActive = false;
          
          Object.keys(timeline).forEach((key) => {
             const shardId = Number(key);
             const events = timeline[shardId];
             const activeEvent = events.find(ev => elapsed >= ev.startOffset && elapsed < ev.endOffset);
             
             if (activeEvent) {
               newStates[shardId] = { isActive: true, duration: activeEvent.duration / speedRef.current };
               hasActive = true;
             } else {
               newStates[shardId] = { isActive: false, duration: 2 }; 
             }
          });

          setShardStates((prev) => {
              let changed = false;
              const keys = Object.keys(newStates);
              if (Object.keys(prev).length !== keys.length) changed = true;
              else {
                  for (const key of keys) {
                      const k = Number(key);
                      const p = prev[k];
                      const n = newStates[k];
                      if (!p || p.isActive !== n.isActive || Math.abs(p.duration - n.duration) > 0.001) {
                          changed = true;
                          break;
                      }
                  }
              }
              return changed ? newStates : prev;
          });

          // 2. Update Snapshot Particles
          const activeSnapshots = snapshotTimeline.filter(s => elapsed >= s.startOffset && elapsed <= s.endOffset);
          const currentParticles = activeSnapshots.map(s => {
              const progress = (elapsed - s.startOffset) / (s.duration * 1000);
              const fromPos = SHARD_CENTER_POS[s.from] || { x: 0, y: 0 };
              const toPos = SHARD_CENTER_POS[s.to] || { x: 0, y: 0 };
              return {
                  id: s.id,
                  from: fromPos,
                  to: toPos,
                  progress: Math.min(Math.max(progress, 0), 1),
                  type: s.type
              };
          });
          
          setSnapshotParticles(currentParticles);

          animationFrameId = requestAnimationFrame(loop);
        };

        loop();
      })
      .catch((err) => console.error("Failed to fetch logs:", err));

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const nodes: NodeData[] = React.useMemo(() => {
    return RAW_NODES.map((node) => ({
      ...node,
      isActive: shardStates[node.id]?.isActive ?? false,
      duration: shardStates[node.id]?.duration ? `${shardStates[node.id].duration.toFixed(2)}s` : "2s",
      delay: "0s",
    }));
  }, [shardStates]);

  const shard0 = shardStates[0] || { isActive: false, duration: 2 };

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
          width: "1565px",
          height: "734px",
        }}
      >
        {/* Connection Lines Layer - Spider Web */}
        <svg
          style={{
            position: "absolute",
            left: "-121px",
            top: "-230px",
            width: "1871px",
            height: "1212px",
          }}
          viewBox="0 0 1871 1212"
          fill="none"
        >
          {/* Inner octagon ring */}
          <path
            d="M749.5 443.5L903.5 418L1058.5 444.5L1112 606L1058 770L904 792.5L750 770L695.5 607L749.5 443.5Z"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Middle octagon ring */}
          <path
            d="M982 314L825.5 313.5L560 382L562 528V686.5L560 831L826 898H982L1248 831V686.5V528L1249 383.5L982 314Z"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Inner connecting lines */}
          <path
            d="M750 771.5L560.5 830.5L696.5 605.5L560.5 690M560.5 529L750 442.5L560.5 381.5M827.5 312.5L903.5 417.5L982 313.5L1059.5 442.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Outer ring bottom */}
          <path
            d="M401 606.5L402 764L591 963.807L905 1059.73L1217.37 963.807L1406 764.5L1406.5 608"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Outer ring top */}
          <path
            d="M401 607.233V449.733L591 249.925L905 154L1217.37 249.925L1405.5 449.5L1406.5 605.733"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - right bottom */}
          <path
            d="M904.5 1211.75L1126 1211.99L1411.47 1075.5L1533 865L1594.5 685V606.25"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - right top */}
          <path
            d="M904.5 0.240723L1126 -0.00012207L1411.47 136.491L1533 346.991L1593 528.5L1594.5 605.741"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - left bottom */}
          <path
            d="M904.5 1211.75L683 1211.99L397.532 1075.5L275 865L214.5 685V606.25"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer lines - left top */}
          <path
            d="M904.5 0.240723L683 -0.00012207L397.532 136.491L275 347L214.5 526.991V605.741"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Right side inner connections */}
          <path
            d="M1058 444.5L1249 383.5L1112.5 605.5L1249 529M1249 686.5L1058 769.5L982 898L904.5 793.5M826.5 898.5L750 769.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Right side outer connections */}
          <path
            d="M1249.5 380.5L1405.5 449.5L1249.5 686L1406 764.5L1248 831L1170.5 1042.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Diagonal connection */}
          <path
            d="M982 897.5L1191 1017.5"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Extreme outer connections */}
          <path
            d="M1533 865L1727.5 1082M1593 686L1870.5 652.5L1593 528M1533 347L1788 250M275 347L51.5 414.5L215 528M215 688L0 771L275.5 865.5L73 1082"
            stroke="black"
            strokeOpacity="0.25"
          />

          {/* Complex web connections */}
          <path
            d="M856.5 1038.5L822 899M593 969L562.5 829.5L402.5 764M402.5 764L215 528M402.5 764L215 688.5M402.5 764L374 1123M562.5 687.5L400.5 449M400.5 449L562.5 528.5M400.5 449L560 382L590.5 250.5M400.5 449L275 347L590.5 250.5M909.5 168.5L981 315L1218.5 250.5L1396 110.5M590.5 250.5L831.5 316M1535.5 871.5L1406 764L1592.5 686M1592.5 528.5L1406 450.5L1533 347"
            stroke="black"
            strokeOpacity="0.25"
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <ShardNode key={node.id} node={node} />
        ))}

        {/* Central Coordination Shard Animation */}
        <div
          style={{
            position: "absolute",
            left: "696px",
            top: "258px",
            width: "205px",
            height: "210px",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
           <div
              className="pie-fill-animation"
              style={{
                position: "absolute",
                width: "250px",
                height: "250px",
                left: "87.3501px",
                top: "117.113px",
                transform: "translate(-50%, -50%)",
                animationDuration: `${shard0.duration}s`,
                opacity: shard0.isActive ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              />
          </div>
        </div>

        {/* Central Coordination Shard (Original) */}
        <svg
          style={{
            position: "absolute",
            left: "696px",
            top: "258px",
            width: "205px",
            height: "210px",
            zIndex: 50,
          }}
          fill="none"
        >
          {/* Background shape removed as per request */}
          <circle
            cx="87.3501"
            cy="117.113"
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
            <tspan x="14.1448" y="117.174">
              Coordination{" "}
            </tspan>
            <tspan x="54.1077" y="145.174">
              Shard
            </tspan>
          </text>
        </svg>

        {/* Snapshot Particles */}
        {snapshotParticles.map((p) => {
           const currentX = p.from.x + (p.to.x - p.from.x) * p.progress;
           const currentY = p.from.y + (p.to.y - p.from.y) * p.progress;
           const color = p.type === 'global_snapshot' ? '#0000FF' : '#FF00FF';
           
           return (
               <div
                  key={p.id}
                  style={{
                      position: 'absolute',
                      left: `${currentX}px`,
                      top: `${currentY}px`,
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 40,
                      boxShadow: `0 0 4px ${color}`,
                      pointerEvents: 'none'
                  }}
               />
           );
        })}
      </div>

      {/* Speed Controls */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "1000px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#E9E9EA",
          padding: "8px",
          border: "1px solid #000",
        }}
      >
        <span style={{ fontWeight: "600", color: "#000", marginRight: "4px" }}>Speed:</span>
        {[1.0, 0.5, 0.2, 0.1].map((s) => (
           <Button 
             key={s}
             size="sm" 
             variant={speed === s ? "default" : "outline"} 
             onClick={() => setSpeed(s)}
             className="h-7 px-2 text-xs"
           >
             {s}x
           </Button>
        ))}
      </div>

      {/* Legend - Top Right */}
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          padding: "16px",
          backgroundColor: "#E9E9EA",
          border: "1px solid #000",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "293px",
          height: "84px",
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
              fontSize: "20px",
              fontWeight: "600",
              lineHeight: "20px",
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
              fontSize: "20px",
              fontWeight: "600",
              lineHeight: "20px",
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
