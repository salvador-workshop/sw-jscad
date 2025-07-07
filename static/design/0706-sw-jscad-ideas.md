# sw-jscad ideas

## Plinth Data Points

- `type` -- `rect` or `ellipse`
- `topHeight`
- `topOffset`
- `bodySize` -- [x,y,z]
- `baseHeight`
- `baseOffset`

## 2D 90-deg Corner Cutting

- `type`-- `interior` or `exterior`
- `cornerSize` -- [cornerWidth, cornerHeight]
- `point`

## Super primitives

Extract these to be independent from mesh. The mesh primitives can then just use these as building blocks

- `flangedPanel()`
- `flangedCuboid()`
- `flangedCylinderElliptic()`

Use the same approach for mouldings

- `panelMoulding()`
    + args: (`insetProfile`, `offsetProfile`)
- `cuboidMoulding()`
    + args: (`profile`)
    + generated with two intersected `panelMoulding` geoms
- `cylinderEllipticMoulding()`
    + args: (`profile`)

More meshy goodness

- `shapedMeshPanel`
    + type: `ellipse`, `triangle`, `star`
    + triangleOpts: type, values
    + ellipseOpts: center, radius, startAngle, endAngle, segments
    + starOpts: center, vertices, density, outerRadius, innerRadius, startAngle
- `reinforcedMeshPanel()`
- `reinforcedMeshCuboid()`
- `reinforcedMeshCylinderElliptic()`

## Cuboid with 30-deg internal angle

```
TOP           BOTTOM
              
B--------A    F--------E
|        |    |        |
|        |    |        |
|        |    |        |
|        |    |        |
D--------C    H--------G

AB = AC
EF = EG
```

```
SIDE

D--------C
|        |
|        |
|        |
|        |
H--------G

DC = HG
```

```
DIAGONAL

D----------A
|          |
|          |
|          |
|          |
H----------E

HDA = 90 deg
DHA = 30 deg
DAH = 60 deg

DA = DH / 2
DH = DA * 2

DA = DC * sqrt(2)
```
