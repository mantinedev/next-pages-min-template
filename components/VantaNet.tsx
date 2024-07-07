// components/VantaNet.js
import { useEffect, useRef } from 'react';
import Script from 'next/script';

const VantaNet = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;
    const loadVanta = () => {
      if (vantaRef.current && !vantaEffect) {
        vantaEffect = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xe64f57,
          backgroundColor: 0x242424,
        });
      }
    };

    // Load Vanta after the scripts are loaded
    if (typeof window !== 'undefined' && window.VANTA) {
      console.log('Vanta loaded');
      loadVanta();
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <>
      <div ref={vantaRef} style={{ width: '100%', height: '100vh' }}>vanta</div>
    </>
  );
};

export default VantaNet;