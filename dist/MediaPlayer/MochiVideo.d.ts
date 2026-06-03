export default MochiVideo;
declare function MochiVideo({ src, poster, autoPlay, loop, muted, controls, className, onPlay, onPause, onEnded, onTimeUpdate }: {
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
}): any;
