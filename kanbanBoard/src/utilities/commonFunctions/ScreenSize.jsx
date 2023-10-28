import { useState, useEffect } from "react";

function useScreenSize() {
  const [screenSize, setScreenSize] = useState('');

  useEffect(() => {
    function handleResize() {
      setScreenSize( window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
}
export default useScreenSize;