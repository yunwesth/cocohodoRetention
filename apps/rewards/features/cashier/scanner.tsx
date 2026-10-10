'use client';

import { useEffect, useRef, useState } from 'react';
import { CameraOff } from 'lucide-react';
import type { IScannerControls } from '@zxing/browser';

export function Scanner({ onScan }: { onScan: (value: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);
  const [error, setError] = useState('');
  useEffect(() => {
    let disposed = false;
    let detected = false;
    let controls: IScannerControls | undefined;
    const videoElement = video.current;
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('A camera needs a secure HTTPS connection. Use the member code below instead.');
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        if (disposed || !videoElement) return;
        const reader = new BrowserQRCodeReader();
        controls = await reader.decodeFromConstraints({ video: { facingMode: { ideal: 'environment' } }, audio: false }, videoElement, (result, _error, scannerControls) => {
          if (result && !disposed && !detected) {
            detected = true;
            scannerControls.stop();
            onScanRef.current(result.getText());
          }
        });
        if (disposed || detected) controls.stop();
      } catch (error) {
        if (!disposed) {
          const name = error instanceof Error ? error.name : '';
          setError(name === 'NotAllowedError' ? 'Camera access was denied. Allow camera access in your browser, or enter the member code below.' : name === 'NotFoundError' ? 'No camera found. Enter the member code below instead.' : error instanceof Error ? error.message : 'Could not start the camera. Use manual entry below.');
        }
      }
    }
    void start();
    return () => { disposed = true; controls?.stop(); if (videoElement?.srcObject instanceof MediaStream) videoElement.srcObject.getTracks().forEach((track) => track.stop()); };
  }, []);
  return <div className="scanner-view">{error ? <div className="camera-error" role="alert"><CameraOff size={30} /><p>{error}</p></div> : <><video ref={video} autoPlay muted playsInline aria-label="Camera QR code scanner" /><div className="scan-frame" /><span className="scanner-instruction">Position the member’s QR code inside the frame</span></>}</div>;
}
