'use strict';

module.exports = UnitBezier;

function UnitBezier(p1x, p1y, p2x, p2y) {
    // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;

    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;

    this.p1x = p1x;
    this.p1y = p1y;
    this.p2x = p2x;
    this.p2y = p2y;
}

UnitBezier.prototype = {
    sampleCurveX: function (t) {
        // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
        return ((this.ax * t + this.bx) * t + this.cx) * t;
    },

    sampleCurveY: function (t) {
        return ((this.ay * t + this.by) * t + this.cy) * t;
    },

    sampleCurveDerivativeX: function (t) {
        return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
    },

    solveCurveX: function (x, epsilon) {
        if (epsilon === undefined) epsilon = 1e-6;

        if (x < 0.0) return 0.0;
        if (x > 1.0) return 1.0;

        var t = x;

        // First try a few iterations of Newton's method - normally very fast.
        for (var i = 0; i < 8; i++) {
            var x2 = this.sampleCurveX(t) - x;
            if (Math.abs(x2) < epsilon) return t;

            var d2 = this.sampleCurveDerivativeX(t);
            if (Math.abs(d2) < 1e-6) break;

            t = t - x2 / d2;
        }

        // Fall back to the bisection method for reliability.
        var t0 = 0.0;
        var t1 = 1.0;
        t = x;

        for (i = 0; i < 20; i++) {
            x2 = this.sampleCurveX(t);
            if (Math.abs(x2 - x) < epsilon) break;

            if (x > x2) {
                t0 = t;
            } else {
                t1 = t;
            }

            t = (t1 - t0) * 0.5 + t0;
        }

        return t;
    },

    solve: function (x, epsilon) {
        return this.sampleCurveY(this.solveCurveX(x, epsilon));
    }
};
