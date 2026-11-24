export function outline(flat: any): string;
/** The pieces to draw for frame `index` of `size`: [{ fill, d }, …]. */
export function framePieces(size: any, index: any): any;
export { SPINNERS };
export namespace OUTLINE {
    namespace normal {
        let light: string;
        let dark: string;
    }
    namespace large {
        let light_1: string;
        export { light_1 as light };
        let dark_1: string;
        export { dark_1 as dark };
    }
}
export const OUTLINE_VAR: "--mochi-spinner-outline";
export const OUTLINE_WIDTH: 1;
export const MAX_PIECES: number;
export namespace CALM_FRAMES {
    let normal_1: number[];
    export { normal_1 as normal };
    let large_1: number[];
    export { large_1 as large };
}
export const CALM_HOLD: 1000;
export const CALM_FADE: 250;
import { SPINNERS } from './spinnerFrames';
