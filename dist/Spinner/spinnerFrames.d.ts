export const FILLS: string[];
export namespace SPINNERS {
    namespace normal {
        let width: number;
        let height: number;
        let delay: number;
        let frames: (number | number[])[][][];
    }
    namespace large {
        let width_1: number;
        export { width_1 as width };
        let height_1: number;
        export { height_1 as height };
        let delay_1: number;
        export { delay_1 as delay };
        let frames_1: (number | number[])[][][];
        export { frames_1 as frames };
    }
}
