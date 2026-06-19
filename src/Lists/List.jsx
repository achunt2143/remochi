import React, { useState, useRef, useEffect } from 'react';
import './List.scss';

/**
 * Mochi ScrollFade Component
 * Shows gradient fade at top/bottom during scrolling
 */
const ScrollFade = ({ show, position = 'top' }) => {
  if (!show) return null;

  return (
    <div className={`mochi-list-scroll-fade ${position}`}>
      <div className="mochi-list-scroll-fade-content">
        <div className="mochi-list-scroll-fade-row row-1" />
        <div className="mochi-list-scroll-fade-row row-2" />
        <div className="mochi-list-scroll-fade-row row-3" />
        <div className="mochi-list-scroll-fade-row row-4" />
      </div>
    </div>
  );
};

/**
 * Mochi List React Component
 * 
 * A scrollable list container with gradient fade effects at top/bottom.
 * Detects scroll direction and shows appropriate fade effect.
 * 
 * Props:
 *   - children: List items to display
 *   - onScrollStart: Callback when scrolling starts
 *   - onScrollStop: Callback when scrolling stops
 */
const List = ({ 
  children, 
  onScrollStart = () => {},
  onScrollStop = () => {}
}) => {
  const [scrollDirection, setScrollDirection] = useState(null);
  const [showFade, setShowFade] = useState(false);
  const scrollRef = useRef(null);
  const yValsRef = useRef([]);
  const scrollTimeoutRef = useRef(null);
  const scrollEventsReq = 10;

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      // Collect scroll events to determine direction
      const currentY = scrollElement.scrollTop;
      yValsRef.current.push(currentY);

      if (yValsRef.current.length >= scrollEventsReq) {
        const oldY = yValsRef.current[0];
        const newY = yValsRef.current[yValsRef.current.length - 1];
        const direction = newY - oldY;

        updateScrollFade(direction);
        yValsRef.current = [];
      }

      onScrollStart();

      // Clear timeout and set new one to detect scroll stop
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setShowFade(false);
        onScrollStop();
      }, 150);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [onScrollStart, onScrollStop]);

  const updateScrollFade = (direction) => {
    if (direction < 0) {
      // Scrolling up - show top fade
      setScrollDirection('top');
      setShowFade(true);
    } else if (direction > 0) {
      // Scrolling down - show bottom fade
      setScrollDirection('bottom');
      setShowFade(true);
    }
  };

  return (
    <div className="mochi-list-container">
      <ScrollFade show={showFade && scrollDirection === 'top'} position="top" />
      
      <div className="mochi-list" ref={scrollRef}>
        {children}
      </div>

      <ScrollFade show={showFade && scrollDirection === 'bottom'} position="bottom" />
    </div>
  );
};

export default List;
export { ScrollFade };
