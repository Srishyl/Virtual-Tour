import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { useState } from "react";

const rooms = {
  class1: {
    image: "/class1.jpg",
    hotspots: [
      { position: [2, 0, -3], target: "corridor", label: "Corridor" }
    ]
  },

  corridor: {
    image: "/corridor.jpg",
    hotspots: [
      { position: [-2, 0, -3], target: "class1", label: "Class 1" },
      { position: [2, 0, -3], target: "class2", label: "Class 2" }
    ]
  },

  class2: {
    image: "/class2.jpg",
    hotspots: [
      { position: [-2, 0, -3], target: "corridor", label: "Back to Corridor" }
    ]
  }
};

function Scene({ currentRoom, setRoom }) {
  const room = rooms[currentRoom];

  return (
    <>
      <Environment files={room.image} background />

      {room.hotspots.map((spot, i) => (
        <Html key={i} position={spot.position}>
          <div
            onClick={() => setRoom(spot.target)}
            style={{
              width: "80px",
              height: "80px",
              border: "4px solid orange",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              background: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {spot.label}
          </div>
        </Html>
      ))}

      <OrbitControls enableZoom={false} />
    </>
  );
}

export default function App() {
  const [room, setRoom] = useState("class1");

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <Scene currentRoom={room} setRoom={setRoom} />
      </Canvas>
    </div>
  );
}