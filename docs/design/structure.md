# structure

## ideal structure v1

In initialization order:

1. **core** -- key definitions for system
    - std-specs
    - geometry
    - position -- calculations for navigating 2D and 3D space.
1. **utils** -- key actions that support system
    - transform
    - misc
1. **models** -- creates `geom` models
    - profiles
    - prefab -- _super primitives_ renamed (basically 3D version of profiles)
    - text
1. **expansions** -- building up models around input `geom` entities
    - moulds

NOTES

- _foils_ moved to `sw-jscad-families`
- rect/cuboid coord funcs moved to `core.position` (`getRectangleCtrlPoints()`, etc)