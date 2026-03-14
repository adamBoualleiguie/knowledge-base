'use client'

import Script from 'next/script'

/**
 * Loads Three.js and Vanta NET scripts in the layout so they persist across
 * client-side navigation. When user navigates back to home, VANTA is already
 * available and the background displays immediately.
 */
export function VantaScripts() {
  return (
    <Script
      id="three-js"
      src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (document.getElementById('vanta-net')) return
        const script = document.createElement('script')
        script.id = 'vanta-net'
        script.src = 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js'
        script.onload = () => {
          window.dispatchEvent(new CustomEvent('vanta-ready'))
        }
        document.body.appendChild(script)
      }}
    />
  )
}
