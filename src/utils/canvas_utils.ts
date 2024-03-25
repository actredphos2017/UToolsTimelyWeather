const positionMapper = (
    pX: number,
    pY: number,
    vs: number,
    w: number,
    h: number,
    pl: number,
    pr: number,
    pt: number,
    pb: number,
) => [
    pl + (w - pl - pr) * (pX / vs),
    h - pb - (h - pt - pb) * (pY / vs)
];

export const definePositionMapper = (
    canvasInstance: HTMLCanvasElement,
    virtualSize: number = 1000,
    paddingLeft: number = 0,
    paddingRight: number = 0,
    paddingTop: number = 0,
    paddingBottom: number = 0
) => ((pX: number, pY: number) => positionMapper(
    pX,
    pY,
    virtualSize,
    canvasInstance.width,
    canvasInstance.height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom
));


