import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { displayScores } from '../model/math';
import type { SimulatedResult, TrajectoryPoint } from '../model/simulate';
import { formatDate } from './form';
import styles from './App.module.css';

export type ChartSection = 'total' | 'math' | 'readingWriting';
const sectionNames = { total: 'Total', math: 'Math', readingWriting: 'Reading & Writing' };
export function ScoreChart({ result, comparison, section, compact = false }: { result: SimulatedResult; comparison?: SimulatedResult; section: ChartSection; compact?: boolean }) {
  const points = result.trajectories.central.points;
  const [selected, setSelected] = useState(points.length - 1);
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const id = useId();
  useEffect(() => {
    const observer = new ResizeObserver(entries => { const entry = entries[0]; if (entry) setWidth(Math.max(260, entry.contentRect.width)); });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const left = 46, right = width - 18, top = 32, bottom = compact ? 195 : 245;
  const maximum = section === 'total' ? 1600 : 800;
  const floor = section === 'total' ? 400 : 200;
  const goal = section === 'total' ? result.input.targetScore : undefined;
  const values = [result.observedBaseline[section], result.trajectories.faster.endpoint[section], comparison?.trajectories.central.endpoint[section] ?? 0, goal ?? 0].filter(value => value >= floor);
  const low = Math.max(floor, Math.floor(Math.min(...values) / 50) * 50 - 50);
  const high = Math.min(maximum, Math.ceil(Math.max(...values) / 50) * 50 + 50);
  const horizon = result.trajectories.central.endpoint.weeks;
  const x = (point: TrajectoryPoint) => left + point.weeks / horizon * (right - left);
  const y = (value: number) => bottom - (value - low) / (high - low) * (bottom - top);
  const line = (series: TrajectoryPoint[]) => series.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point).toFixed(2)},${y(point[section]).toFixed(2)}`).join(' ');
  const area = line(result.trajectories.faster.points) + result.trajectories.slower.points.toReversed().map(point => ` L${x(point).toFixed(2)},${y(point[section]).toFixed(2)}`).join('') + ' Z';
  const point = points[Math.min(selected, points.length - 1)]!;
  const rounded = displayScores(point);
  const otherPoint = comparison?.trajectories.central.points[Math.min(selected, points.length - 1)];
  const otherRounded = otherPoint ? displayScores(otherPoint) : undefined;
  function explore(event: PointerEvent<SVGSVGElement>) {
    if (compact) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, ((event.clientX - rect.left) / rect.width * width - left) / (right - left)));
    const week = fraction * horizon;
    let nearest = 0;
    points.forEach((item, index) => { if (Math.abs(item.weeks - week) < Math.abs(points[nearest]!.weeks - week)) nearest = index; });
    setSelected(nearest);
  }
  const shortDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
  return <div ref={container} className={styles.chart}>
    <svg viewBox={`0 0 ${width} ${bottom + 35}`} role="img" aria-labelledby={`${id}-title ${id}-description`} onPointerMove={explore} onPointerDown={explore}>
      <title id={`${id}-title`}>{sectionNames[section]} score over time under experimental assumptions</title>
      <desc id={`${id}-description`}>Current plan from {result.observedBaseline[section]} to {result.trajectories.central.displayedEndpoint[section]}. Shading varies current-plan learning rates. {comparison ? `Comparison reaches ${comparison.trajectories.central.displayedEndpoint[section]}.` : ''} {goal ? `Target ${goal}.` : ''} Axis spans {low} to {high}. Use the date control and data table for exact displayed values.</desc>
      <defs><linearGradient id={`${id}-band`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#126279" stopOpacity=".18" /><stop offset="100%" stopColor="#126279" stopOpacity=".04" /></linearGradient></defs>
      {Array.from({ length: 5 }, (_, index) => {
        const value = low + (high - low) * index / 4;
        return <g key={index}><line x1={left} x2={right} y1={y(value)} y2={y(value)} stroke="#d7e5eb" /><text x={left - 9} y={y(value) + 4} textAnchor="end">{Math.round(value)}</text></g>;
      })}
      {goal !== undefined && <g><line x1={left} x2={right} y1={y(goal)} y2={y(goal)} stroke="#667e8b" strokeDasharray="4 5" /><text x={right} y={y(goal) - 8} textAnchor="end">Target {goal}</text></g>}
      <path d={area} fill={`url(#${id}-band)`} />
      <path key={section} d={line(points)} fill="none" stroke="#126279" strokeWidth="3" strokeLinecap="round" pathLength="1" className={styles.drawLine} />
      {comparison && <path d={line(comparison.trajectories.central.points)} fill="none" stroke="#316c57" strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" />}
      {!compact && <g><line x1={x(point)} x2={x(point)} y1={top} y2={bottom} stroke="#a4bcc7" strokeDasharray="3 4" /><circle cx={x(point)} cy={y(point[section])} r="5" fill="#126279" stroke="white" strokeWidth="2" />{otherPoint && <circle cx={x(otherPoint)} cy={y(otherPoint[section])} r="5" fill="#316c57" stroke="white" strokeWidth="2" />}</g>}
      <text x={left} y={bottom + 26}>{shortDate(points[0]!.date)}</text>
      <text x={right} y={bottom + 26} textAnchor="end">{shortDate(result.input.targetDate)}</text>
    </svg>
    {!compact && <>
      <div className={styles.chartReadout}><strong>{formatDate(point.date)}</strong><span>Current plan <b>{rounded[section]}</b>{otherRounded && <> · Comparison <b>{otherRounded[section]}</b></>}</span></div>
      <label htmlFor={`${id}-date`} className={styles.hint}>Explore timeline · use arrows, touch, or numeric data below</label>
      <input id={`${id}-date`} aria-label="Explore timeline" type="range" min={0} max={points.length - 1} step={1} value={Math.min(selected, points.length - 1)} aria-valuetext={`${formatDate(point.date)}, current ${rounded[section]}${otherRounded ? `, comparison ${otherRounded[section]}` : ''}`} onChange={event => setSelected(Number(event.target.value))} />
      <p className={styles.hint}>Vertical axis: {low}–{high}, zoomed within the score scale. Curves use raw values; displayed scores round each section to tens, then sum.</p>
    </>}
  </div>;
}
