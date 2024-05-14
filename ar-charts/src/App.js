import { VRButton, ARButton, XR, Hands, Controllers, useXR, useHitTest, Interactive, RayGrab } from '@react-three/xr'
import { Canvas } from '@react-three/fiber'
import { extend } from '@react-three/fiber'
import { Text } from "@react-three/drei"
import { LineSegments, EdgesGeometry, LineBasicMaterial, BoxGeometry } from 'three';

import React, {useState, useEffect} from "react";
extend({ Controllers });

/*
when user hover the bar: color: blue -> red
when user press the button AND hover the bar: generate a new bar and new bar will follow the hand movement, original bar alpha: 1 -> 0.5
when user release the button: destroy the bar; color: red -> blue; original bar alpha: 0.5 -> 1

*/
function Bar({data, pos}){
  const [color, setColor] = useState("blue");
  const [opacity, setOpacity] = useState(1);

  const [hovered, setHovered] = useState(false);
  const [copy, setCopy] = useState(false);

  const {
    // An array of connected `XRController`
    controllers,
    // Whether the XR device is presenting in an XR session
    isPresenting,
    // Whether hand tracking inputs are active
    isHandTracking,
    // A THREE.Group representing the XR viewer or player
    player,
    // The active `XRSession`
    session,
    // `XRSession` foveation. This can be configured as `foveation` on <XR>. Default is `0`
    foveation,
    // `XRSession` reference-space type. This can be configured as `referenceSpace` on <XR>. Default is `local-floor`
    referenceSpace
  } = useXR();

  console.log("controllers",controllers);
  console.log("hand tracking", isHandTracking);

  console.log(pos);

  function handleOnHover(){
    setColor("red"); //blue -> red
    setHovered(true); //enter
  }

  function handleOnBlur(){
    setColor("blue");
    setHovered(false); //quit
  }

  function handleOnSelectStart(){
    setCopy(true); //create
    //setOpacity(0.5); //1 -> 0.5
    console.log("clicked");
  }

  function handleOnSelectEnd(){
    setCopy(false); //destroy
    //setOpacity(1); //0.5 -> 1
    //setColor("blue"); //red -> blue
    console.log("quit clicked");
  }

  return (
    <Interactive
      onHover={handleOnHover}
      onBlur={handleOnBlur}
      onSelectStart={handleOnSelectStart}
      onSelectEnd={handleOnSelectEnd}
    >
      <mesh position={pos}>
        <boxGeometry args={[0.1, data / 4, 0]}/>
        <meshBasicMaterial color={color} opacity={opacity} transparent={true}/>
      </mesh>
      {hovered &&
        //<RayGrab>
          //<mesh position={[pos[0], pos[1] + 1, pos[2]]}>
            //<boxGeometry args={[0.1, data / 4, 0]}/>
            //<meshBasicMaterial color={color} />
          //</mesh>
        //</RayGrab>
        <>
        <Text position={[pos[0],pos[1]+data/8+0.1,pos[2]]} fontSize={0.1}>
          {data}
        </Text>
        </>
      }
      {
        hovered && copy && 
        <mesh position={pos}>
          <boxGeometry args={[0.1, data / 4, 0]}/>
          <lineSegments>
            <edgesGeometry attach="geometry" args={[new BoxGeometry(0.1, data / 4, 0)]} />
            <lineBasicMaterial color="white" />
          </lineSegments>
        </mesh>
      }
    </Interactive>
  );
}

function BarChart({data}){
  return (
    <>
      {data.map((item, index)=>(
        <Bar key={index} data={item} pos={[index * 0.2, item/8, 0]}/>)
      )}
    </>
  );
}

function App() {
  const dummies = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4];

  return (
    <>
      <ARButton />
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <XR>
          <Controllers />
          <Hands />
          <BarChart data={dummies} />
        </XR>
      </Canvas>
    </>
  )
}
export default App;


