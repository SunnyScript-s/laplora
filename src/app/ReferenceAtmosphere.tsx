import { useId } from 'react';
import styles from './App.module.css';

/** Original vector artwork inspired by the owner's reference; no remote image request. */
export function ReferenceAtmosphere() {
  const id = useId();
  const ribbon = `${id}-ribbon`;
  const amber = `${id}-amber`;
  const shine = `${id}-shine`;
  return <svg className={styles.referenceArt} viewBox="0 0 1600 1120" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={ribbon} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff988" /><stop offset=".25" stopColor="#ffdf3f" />
        <stop offset=".6" stopColor="#ff891f" /><stop offset=".82" stopColor="#ffc640" /><stop offset="1" stopColor="#fff6aa" />
      </linearGradient>
      <radialGradient id={amber} cx="35%" cy="30%" r="76%">
        <stop offset="0" stopColor="#ffd551" /><stop offset=".4" stopColor="#ffa600" />
        <stop offset=".74" stopColor="#f47d00" /><stop offset="1" stopColor="#b94900" />
      </radialGradient>
      <linearGradient id={shine} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity=".12" />
      </linearGradient>
    </defs>
    <path d="M-180 65C260-90 1260-30 1230 345C1210 590 800 360 900 655C985 905 1500 525 1740 850" fill="none" stroke={`url(#${ribbon})`} strokeWidth="125" opacity=".64" />
    <path d="M1480-110C1290 110 1620 330 1460 500C1330 650 1100 545 1075 880" fill="none" stroke={`url(#${ribbon})`} strokeWidth="88" opacity=".74" />
    <g fill="none" stroke="#fff" strokeWidth="3" opacity=".8">
      <ellipse cx="1405" cy="890" rx="375" ry="340" transform="rotate(-28 1405 890)" />
      <ellipse cx="1405" cy="890" rx="400" ry="365" transform="rotate(-28 1405 890)" />
      <ellipse cx="1405" cy="890" rx="425" ry="390" transform="rotate(-28 1405 890)" />
    </g>
    <g className={styles.giantBubble}>
      <circle cx="-65" cy="1010" r="365" fill={`url(#${amber})`} stroke="#ffb92f" strokeWidth="7" />
      <ellipse cx="-65" cy="825" rx="270" ry="112" fill={`url(#${shine})`} transform="rotate(-15 -65 825)" />
      <path d="M75 1055C165 995 220 1025 155 1115" fill="none" stroke="#ffdb72" strokeWidth="48" strokeLinecap="round" opacity=".65" />
      <circle cx="1540" cy="1110" r="275" fill={`url(#${amber})`} stroke="#ffe6a5" strokeWidth="6" />
      <ellipse cx="1500" cy="985" rx="205" ry="78" fill={`url(#${shine})`} transform="rotate(-20 1500 985)" />
    </g>
    <g className={styles.floatingBubbles}>
      <circle cx="1250" cy="220" r="128" fill={`url(#${amber})`} stroke="#ffc54e" strokeWidth="4" />
      <ellipse cx="1225" cy="165" rx="82" ry="48" fill={`url(#${shine})`} transform="rotate(-12 1225 165)" />
      <path d="M1220 265Q1250 285 1285 260" fill="none" stroke="#ffe17e" strokeWidth="18" strokeLinecap="round" opacity=".7" />
      <circle cx="220" cy="440" r="45" fill={`url(#${amber})`} stroke="#ffd274" strokeWidth="2" />
      <ellipse cx="212" cy="420" rx="27" ry="14" fill={`url(#${shine})`} />
      <circle cx="1130" cy="860" r="70" fill={`url(#${amber})`} stroke="#ffd274" strokeWidth="2" />
      <ellipse cx="1118" cy="832" rx="43" ry="22" fill={`url(#${shine})`} />
    </g>
    <path d="M-140 640A510 510 0 0 1 480 1120" fill="none" stroke={`url(#${ribbon})`} strokeWidth="13" strokeDasharray="100 35" opacity=".8" />
    <path d="M-140 620A540 540 0 0 1 510 1120" fill="none" stroke="#fff2ae" strokeWidth="3" opacity=".7" />
  </svg>;
}
