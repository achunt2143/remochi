export default MochiVideo;
declare function MochiVideo({ src, poster, autoPlay, loop, muted, controls, className, onPlay, onPause, onEnded, onTimeUpdate, onMouseMove: userOnMouseMove, onMouseEnter: userOnMouseEnter, onMouseLeave: userOnMouseLeave, ...rest }: {
    [x: string]: any;
    src: any;
    poster: any;
    autoPlay?: boolean | undefined;
    loop?: boolean | undefined;
    muted?: boolean | undefined;
    controls?: boolean | undefined;
    className?: string | undefined;
    onPlay: any;
    onPause: any;
    onEnded: any;
    onTimeUpdate: any;
    onMouseMove: any;
    onMouseEnter: any;
    onMouseLeave: any;
}): any;
