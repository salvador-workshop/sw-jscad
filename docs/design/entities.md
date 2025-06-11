# entities

## SwDesign

| property | type | description |
| --- | --- | --- |
| name | string | Human-readable name |
| id | string | Alphanumeric ID |
| description | string | Short description |
| data | string | Arbitrary data for extension use |
| parts | SwPart[] | SwParts that compose the design |

## SwPart

| property | type | description |
| --- | --- | --- |
| name | string | Human-readable name |
| id | string | Alphanumeric ID |
| description | string | Short description |
| data | string | Arbitrary data for extension use |
| colour | number[] | Colour (RGB, 0.0 to 1.0) |
| geom | geom | JSCAD Geometry |
