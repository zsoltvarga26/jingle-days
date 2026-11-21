/** A fa rajzának mérete; a díszek helye (slot) ebben a koordinátarendszerben van. */
export const TREE_VIEWBOX = { width: 100, height: 120 } as const

/** Az a HTML-azonosító, amelyhez a dialógus bezárása után az oldal görget. */
export const TREE_ID = 'tree'

/**
 * A szoba (kandalló, cica) és a fa közös színpada. A fa 100 × 120-as doboza x = 30-nál kezdődik,
 * így a bal oldalon marad hely a kandallónak és az előtte alvó cicának.
 */
export const ROOM_VIEWBOX = { width: 130, height: 120 } as const
export const TREE_OFFSET_X = 30
