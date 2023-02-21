[![Build Status](https://travis-ci.org/mapbox/unitbezier.svg)](https://travis-ci.org/mapbox/unitbezier)

# unitbezier

Unit bezier interpolation function: a port to JavaScript from Webkit:

http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/UnitBezier.h

## api

### new UnitBezier(p1x, p1y, p2x, p2y)

Initialize a new bezier curve given the points

### bezier.solve(x, epsilon)

Evaluate bezier for value `x` (ranging from 0 to 1) with `epsilon` precision (1e-6 by default).
