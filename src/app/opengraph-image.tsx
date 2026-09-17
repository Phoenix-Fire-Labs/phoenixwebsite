import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/** Generated social card: Phoenix headline on warm off-white with accent rule. */
// trace:v1 id=impl.opengraph-image work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: "#f6f3ed",
          color: "#1a1815",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#a0440d", letterSpacing: 4 }}>PHOENIX FIRE LABS</div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>
          Real-Time Wildfire Intelligence for Incident Command
        </div>
        <div style={{ width: 96, height: 4, background: "#a0440d", marginTop: 40 }} />
        <div style={{ fontSize: 28, marginTop: 24, color: "#3d3833" }}>
          Mockingbird · Osprey · Raven
        </div>
      </div>
    ),
    { ...size },
  );
}
