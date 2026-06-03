import React, { useState, useEffect, useRef } from 'react';

/**
 * Mochi Badge React Component
 * 
 * A badge component in the Mochi style that dynamically adjusts between
 * circular (round) and oval shapes based on content length.
 * 
 * Props:
 *   - content: String or number to display in the badge
 *   - background: CSS color string for background (default: '#69cdff')
 *   - color: CSS color string for text (default: '#ffffff')
 */
const Badge = ({ content = '', background = '#69cdff', color = '#ffffff' }) => {
    const [isRound, setIsRound] = useState(true);
    const [displayBackground, setDisplayBackground] = useState(background);

    const originalBackground = useRef(background);

    useEffect(() => {
        originalBackground.current = background;
    }, [background]);

    // contentChanged logic
    useEffect(() => {
        if (content === '' || content === null || content === undefined) {
            setDisplayBackground('transparent');
        } else {
            setDisplayBackground(originalBackground.current);
            const contentStr = content.toString();

            // More than 2 characters = oval, otherwise round
            if (contentStr.length > 2) {
                setIsRound(false);
            } else {
                setIsRound(true);
            }
        }
    }, [content]);

    const innerClassName = isRound ? 'mochi-badge-inner round' : 'mochi-badge-inner oval';

    const innerStyle = {
        background: displayBackground,
        color: color
    };

    return (
        <div className="mochi-badge">
            <div className={innerClassName} style={innerStyle}>
                {content}
            </div>
        </div>
    );
};

export { Badge };