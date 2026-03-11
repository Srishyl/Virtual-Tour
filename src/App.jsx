import React, { useState, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";

const rooms = {
  livingroom: {
    name: "Living Room",
    image: "/Livingroom.jpeg",
    hotspots: [
      { position: [4, -2, 8], target: "kitchen", label: "Kitchen", type: "preview", preview: "/Kitchen.jpeg" },
      { position: [-12, -1, -4], target: "bedroom", label: "Bedroom", type: "preview", preview: "/Bedroom .jpeg" },
      { position: [3, -1, -10], target: "bedroom1", label: "Guest Room", type: "preview", preview: "/Bedroom1.jpeg" }
    ]
  },
  kitchen: {
    name: "Kitchen",
    image: "/Kitchen.jpeg",
    hotspots: [
      { position: [7, -1, -2], target: "livingroom", label: "Living Room", type: "preview", preview: "/Livingroom.jpeg" }
    ]
  },
  bedroom: {
    name: "Bedroom",
    image: "/Bedroom .jpeg", // Note the space in the filename
    hotspots: [
      { position: [-12, -1, 8], target: "livingroom", label: "Living Room", type: "preview", preview: "/Livingroom.jpeg" },
    ]
  },
  bedroom1: {
    name: "Guest Room",
    image: "/Bedroom1.jpeg",
    hotspots: [
      { position: [6, -2, 10], target: "livingroom", label: "Living Room", type: "preview", preview: "/Livingroom.jpeg" }
    ]
  }
};

function Panorama({ image }) {
  const texture = useTexture(image);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Hotspot({ position, label, onClick, type, preview }) {
  if (type === "preview") {
    return (
      <Html position={position} center distanceFactor={10}>
        <div className="hotspot-preview">
          <div className="preview-title">{label}</div>
          <div className="preview-box" onClick={onClick}>
            <img src={preview} alt={label} className="preview-image" />
            <div className="preview-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </Html>
    );
  }

  return (
    <Html position={position} center distanceFactor={10}>
      <div className="hotspot-container">
        <div className="hotspot-button" onClick={onClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div className="hotspot-label">{label}</div>
      </div>
    </Html>
  );
}

function Scene({ currentRoom, setRoom, onTransitionStart }) {
  const roomData = rooms[currentRoom];

  const handleRoomChange = (target) => {
    onTransitionStart();
    setTimeout(() => {
      setRoom(target);
    }, 800);
  };

  return (
    <>
      <Panorama image={roomData.image} />

      {roomData.hotspots.map((spot, i) => (
        <Hotspot
          key={`${currentRoom}-${i}`}
          position={spot.position}
          label={spot.label}
          type={spot.type}
          preview={spot.preview}
          onClick={() => handleRoomChange(spot.target)}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={-0.5}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />

      <Preload all />
    </>
  );
}

const UIOverlay = ({ currentRoom, setRoom, fade, onTransitionStart }) => {
  const handleNavClick = (id) => {
    if (id === currentRoom) return;
    onTransitionStart();
    setTimeout(() => {
      setRoom(id);
    }, 800);
  };

  return (
    <>
      <div className={`fade-overlay ${fade ? 'active' : ''}`} />
      <div className="ui-overlay">
        <header className="ui-header">
          <div className="app-title">360° Virtual Tour</div>
          <div className="room-indicator">
            <div className="indicator-dot" />
            <span className="room-name">{rooms[currentRoom].name}</span>
          </div>
        </header>

        <footer className="ui-footer">
          <nav className="navigation-menu">
            {Object.keys(rooms).map((id) => (
              <div
                key={id}
                className={`nav-item ${currentRoom === id ? 'active' : ''}`}
                onClick={() => handleNavClick(id)}
              >
                {rooms[id].name}
              </div>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
};

export default function App() {
  const [room, setRoom] = useState("livingroom");
  const [fade, setFade] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTransition = () => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loader"></span>
        <div className="loading-text">Preparing Experience</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#000" }}>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={null}>
          <Scene
            currentRoom={room}
            setRoom={setRoom}
            onTransitionStart={handleTransition}
          />
        </Suspense>
      </Canvas>

      <UIOverlay
        currentRoom={room}
        setRoom={setRoom}
        fade={fade}
        onTransitionStart={handleTransition}
      />
    </div>
  );
}