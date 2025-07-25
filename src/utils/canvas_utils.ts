const positionMapper = (
    pX: number,
    pY: number,
    vs: number,
    w: number,
    h: number,
    pl: number,
    pr: number,
    pt: number,
    pb: number
) => [
    pl + (w - pl - pr) * (pX / vs),
    h - pb - (h - pt - pb) * (pY / vs)
];

export interface PositionMapperConfig {
    canvasInstance: HTMLCanvasElement
    virtualSize?: number
    paddingLeft?: number
    paddingRight?: number
    paddingTop?: number
    paddingBottom?: number
    dpr?: number
}

function isNumberElseDefault(value: any, defaultValue = 0): number {
    return typeof value == "number" ? value : defaultValue;
}

export const definePositionMapperOf = (
    canvasInstance: HTMLCanvasElement,
    virtualSize: number = 1000,
    paddingLeft: number = 0,
    paddingRight: number = 0,
    paddingTop: number = 0,
    paddingBottom: number = 0
) => definePositionMapper({
    canvasInstance,
    virtualSize,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
});

export const definePositionMapper = (
    config: PositionMapperConfig
) => ((pX: number, pY: number) => positionMapper(
    pX,
    pY,
    isNumberElseDefault(config.virtualSize, 1000),
    config.canvasInstance.width,
    config.canvasInstance.height,
    isNumberElseDefault(config.paddingLeft),
    isNumberElseDefault(config.paddingRight),
    isNumberElseDefault(config.paddingTop),
    isNumberElseDefault(config.paddingBottom),
));


