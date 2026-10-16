"""WCAG AA contrast check for every text/background pair used on the site."""
C = dict(paper="F5F0E6", surface="FFFDF8", ink="1B2438", soft="4A5368", vermilion="C2411F", sage="7F9477",
         wash="9DB4C8", dusk="232C4A")
PAIRS = [("ink", "paper"), ("ink", "surface"), ("soft", "paper"), ("soft", "surface"), ("vermilion", "paper"),
         ("vermilion", "surface"), ("surface", "vermilion"), ("paper", "ink"), ("ink", "wash")]


def lum(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)


bad = 0
for fg, bg in PAIRS:
    a, b = sorted((lum(C[fg]), lum(C[bg])), reverse=True)
    ratio = (a + .05) / (b + .05)
    ok = ratio >= 4.5
    bad += not ok
    print(f"{fg:>9} on {bg:<9} {ratio:5.2f} {'PASS' if ok else 'FAIL'}")
raise SystemExit(bad)
