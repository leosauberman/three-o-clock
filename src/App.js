import './App.css';
import {Canvas} from "@react-three/fiber";
import {Box, Circle, Cylinder, OrbitControls, PerspectiveCamera, Text} from "@react-three/drei";
import {useEffect, useRef} from "react";

const mainTicks = Array(12).fill(0).map((e, i) => {
    const ang = i * Math.PI / 6;
    return [Math.cos(ang), Math.sin(ang), ang]
});
const minorTicks = Array(60).fill(0).map((e, i) => {
    const ang = i * Math.PI / 30;
    return [Math.cos(ang), Math.sin(ang), ang]
});

const raio = 10;

const Base = () => {

    return (<group>
            <Cylinder args={[raio, raio, 1, 32, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial/>
            </Cylinder>
            {mainTicks.map((t, i) => (
                <Box key={i}
                   args={[1, 1, 1]}
                   rotation={[Math.PI / 2, t[2], 0]}
                   position={[t[0] * raio, t[1] * raio, 0.1]}
                >
                    <meshStandardMaterial color="black"/>
                </Box>))}
            {minorTicks.map((t, i) => (
                <Box key={i}
                    args={[0.2, 0.2, 0.2]}
                    rotation={[Math.PI / 2, t[2], 0]}
                    position={[t[0] * raio, t[1] * raio, 1]}
                >
                    <meshStandardMaterial color="black"/>
                </Box>))}
        </group>)
}

const Pointers = () => {
    const secPointerRef = useRef();
    const minPointerRef = useRef();
    const hrPointerRef = useRef();

    const getHrAngle = (time) => (time.getHours() + time.getMinutes() / 60 + time.getSeconds() / (60 * 60)) / 12 * -2 * Math.PI;
    const getMinAngle = (time) => (time.getMinutes() + time.getSeconds() / 60) / 60 * -2 * Math.PI;
    const getSecAngle = (time) => time.getSeconds() / 60 * -2 * Math.PI;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const date = new Date();
            secPointerRef.current?.rotation.set(0, 0, getSecAngle(date));
            minPointerRef.current?.rotation.set(0, 0, getMinAngle(date));
            hrPointerRef.current?.rotation.set(0, 0, getHrAngle(date));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);


    return (<group>
            <group ref={secPointerRef}>
                <Box args={[0.3, 8, 0.2]} position={[0, 3.7, 5]}>
                    <meshStandardMaterial color="red"/>
                </Box>
            </group>
            <group ref={minPointerRef}>
                <Box args={[0.5, 7, 0.2]} position={[0, 3.7, 3]}>
                    <meshStandardMaterial color="black"/>
                </Box>
            </group>
            <group ref={hrPointerRef}>
                <Box args={[1, 3, 0.2]} position={[0, 1.7, 2]}>
                    <meshStandardMaterial color="black"/>
                </Box>
            </group>
        </group>)
}


const Numbers = () => {
    const horas = [3, 2, 1, 12, 11, 10, 9, 8, 7, 6, 5, 4];
    const raioG = raio * 1.3;

    return (
        <group position={[0, 0, 0]}>
            {
                mainTicks.map((t, id) => (
                    <Text
                        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                        size={2}
                        height={4}
                        curveSegments={12}
                        bevelEnabled={false}
                        rotation={[0, 0, 0]}
                        position={[t[0] * raioG, t[1] * raioG, 0.1]}
                        key={id}
                        color={'#EC2D2D'}
                        fontSize={3}
                        maxWidth={200}
                        lineHeight={1}
                        letterSpacing={0.02}
                        textAlign={'left'}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0}
                    >
                        {horas[id]}
                        <meshStandardMaterial color="black"/>
                    </Text>
                ))}
        </group>)
}

function App() {
    return (<div id="canvas-container">
            <Canvas>
                <ambientLight intensity={0.1}/>
                <directionalLight color="white" position={[0, 0, 5]}/>
                <mesh>
                    <Base/>
                    <Circle position={[0, 0, 1]} args={[0.5, 32]}>
                        <meshStandardMaterial color="red"/>
                    </Circle>
                    <Pointers/>
                    <Numbers/>
                    <meshStandardMaterial/>
                </mesh>
                <OrbitControls makeDefault>
                    <PerspectiveCamera makeDefault fov={75} near={0.1} far={1000} position={[0, 0, 30]}/>
                </OrbitControls>
            </Canvas>
        </div>);
}

export default App;
