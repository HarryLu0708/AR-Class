import { VRButton, ARButton, XR, Hands, Controllers, useController, useXREvent, useHitTest, Interactive, RayGrab } from '@react-three/xr'
import { Canvas } from '@react-three/fiber'
import { extend } from '@react-three/fiber'
import { Text } from "@react-three/drei"
import { LineSegments, EdgesGeometry, LineBasicMaterial, BoxGeometry } from 'three';
import { useFrame } from '@react-three/fiber';

import React, {useState, useEffect, useRef} from "react";
extend({ Controllers });


/*
创建一个新的bar，这个bar会根据控制器的移动而改变位置
- 获取控制器坐标 - 完成
- 获取是哪个控制器进行的交互
- 创建bar -> 更新bar坐标
*/
/*
when user hover the bar: color: blue -> red
when user press the button AND hover the bar: generate a new bar and new bar will follow the hand movement, original bar alpha: 1 -> 0.5
when user release the button: destroy the bar; color: red -> blue; original bar alpha: 0.5 -> 1

*/
function Bar({data, pos}){
  const leftController = useController('left');
  const rightController = useController('right');

  const [color, setColor] = useState("blue");
  const [opacity, setOpacity] = useState(1);

  const [hovered, setHovered] = useState(false);
  const [copy, setCopy] = useState(false);

  const ref = useRef(null);
  
  useXREvent('selectstart', (event) => {
    console.log("--------SELECT START---------");
    console.log("selectstart: ", event);
    console.log("nativeEvent: ", event.nativeEvent);
    console.log("target: ", event.target);
    console.log("DATA: ", data);
    setCopy(true);
    if (event && event.inputSource) {
      console.log('Button pressed on controller:', event.inputSource);
      if (event.target === ref.current) {
        console.log('Button pressed on controller:', event.inputSource.handedness);
      }
    } else {
      console.error('Event or event.inputSource is undefined:', event);
    }
  }, ref);

  useXREvent('selectend', (event) => {
    console.log("--------SELECT END---------");
    console.log("selectend: ", event);
    console.log("nativeEvent: ", event.nativeEvent);
    console.log("target: ", event.target);
    console.log("DATA: ", data);
    //setCopy(false);
    if (event && event.inputSource) {
      console.log('Button released on controller:', event.inputSource);
      if (event.target === ref.current) {
        console.log('Button released on controller:', event.inputSource.handedness);
      }
    } else {
      console.error('Event or event.inputSource is undefined:', event);
    }
  }, ref);

  //console.log("position of bar:",pos);

  function handleOnHover(){
    setColor("red"); //blue -> red
    setHovered(true); //enter
  }

  function handleOnBlur(){
    setColor("blue");
    setHovered(false); //quit
  }

  function handleOnSelectStart(){
    //setCopy(true); //create
    //setOpacity(0.5); //1 -> 0.5
    console.log("clicked");
    if (leftController) {
      console.log('Left Controller Position:', leftController.controller.position);
    }
    if (rightController) {
      console.log('Right Controller Position:', rightController.controller.position);
    }
  }

  function handleOnSelectEnd(){
    //setCopy(false); //destroy
    //setOpacity(1); //0.5 -> 1
    //setColor("blue"); //red -> blue
    console.log("quit clicked");
  }

  return (
    <Interactive
      onHover={handleOnHover}
      onBlur={handleOnBlur}
    >
      <mesh ref={ref} position={pos}>
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
        hovered && 
        <mesh ref={ref} position={pos}>
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


