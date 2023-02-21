export default class UnitBezier {
    constructor(p1x: number, p1y: number, p2x: number, p2y: number);
    sampleCurveX(t: number): number;
    sampleCurveY(t: number): number;
    sampleCurveDerivativeX(t: number): number;
    solveCurveX(x: number, epsilon?: number): number;
    solve(x: number, epsilon?: number): number;
}
