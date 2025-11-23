import React from 'react';
import '../styles/skeleton.css';

export default function Skeleton({ height = 16, width = '100%', radius = 6 }) {
  const style = { height, width, borderRadius: radius };
  return <div className="skeleton" style={style} />;
}
