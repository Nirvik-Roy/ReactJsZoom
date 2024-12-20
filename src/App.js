import logo from './logo.svg';
import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [imageSrc, setimagesrc] = useState('https://picsum.photos/id/242/200/300')
  const [count, setCount] = useState(0)
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const lensRef = useRef(null);
  const resultRef = useRef(null);
  const [containerRect, setContainerRect] = useState({});
  const [imageRect, setImageRect] = useState({});
  const [lensRect, setLensRect] = useState({});
  const [resultRect, setResultRect] = useState({});
  const [position,setPostion]=useState({
    x:0,
    y:0,
  })
  useEffect(() => {
    // Get dimensions of the elements after the component mounts
    setContainerRect(containerRef.current.getBoundingClientRect());
    setImageRect(imageRef.current.getBoundingClientRect());
    setLensRect(lensRef.current.getBoundingClientRect());
    setResultRect(resultRef.current.getBoundingClientRect());
    // Set the background image for the zoomed result
    resultRef.current.style.backgroundImage = `url(${imageSrc})`;
  }, [count]) // Use state will be called when ever the count value changes, and handlemouse event is called;

  const handleMouseMove = (e) => {
    setPostion({
      x:e.clientX,
      y:e.clientY,
    })
    const { x, y } = getMousePos(e);
    setCount(count + 1)
    // Move the lens
    lensRef.current.style.left = `${x}px`;
    lensRef.current.style.top = `${y}px`;
    // Calculate zoom factor
    const fx = resultRect.width / lensRect.width;
    const fy = resultRect.height / lensRect.height;

    // Adjust the zoomed background size and position
    resultRef.current.style.backgroundSize = `${imageRect.width * fx}px ${imageRect.height * fy}px`;
    resultRef.current.style.backgroundPosition = `-${x * fx}px -${y * fy}px`;
  };

  const getMousePos = (e) => {
    const x = e.clientX - containerRect.left - lensRect.width / 2;
    const y = e.clientY - containerRect.top - lensRect.height / 2;

    // Clamp values to keep the lens within the container
    const minX = 0;
    const minY = 0;
    const maxX = containerRect.width - lensRect.width;
    const maxY = containerRect.height - lensRect.height;

    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    };
  };

const handleMouseMoveLeave = () =>{
  setPostion(
    {
      x:0,
      y:0,
    }
  )
}
  return (

    <>
      <div
        className="container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseMoveLeave}
      >
        <img src={imageSrc} alt="Zoomable" className="image" ref={imageRef} />
        <div className="lens" style={{visibility:'hidden'}} ref={lensRef}></div>
        <div className="result" style={{position:'fixed',left:position.x,top:position.y,borderRadius:'50%'}}  ref={resultRef}></div>
      </div>

    </>
  );
}

export default App;
