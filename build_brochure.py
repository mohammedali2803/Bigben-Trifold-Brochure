#!/usr/bin/env python3
"""Rebuild of the BigBen x NDA Apparels 6-panel accordion brochure (A4 landscape, Z-fold).

Changes vs. the original artwork (source/BigBen_Accordion_original.pdf):
  * every text size raised to a print-safe scale (see TYPE below)
  * panel 5 ("How we work") gets the fabric photo as a full-bleed background
  * spacing / alignment rebuilt on one grid so nothing is cramped
Photos, the India map, logos, QR codes and icons are re-used from the original.

Run:  python3 build_brochure.py            -> output/BigBen_Accordion_6pnl_v2.pdf
"""
import os
import sys

from reportlab.pdfgen import canvas

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bb_helpers import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "source", "BigBen_Accordion_original.pdf")
OUT = os.path.join(HERE, "output", "BigBen_Accordion_6pnl_v2.pdf")
IMG = lambda n: os.path.join(HERE, "assets", "img", n)
FABRIC_BG = IMG("panel5_fabric_bg.png")

# ------------------------------------------------------------------ type scale (pt)
TYPE = dict(
    h1=22,          # panel titles
    h2=15,          # sub-heads
    lead=8.6,       # body copy
    lead_lead=13.6, # body leading
    small=7.8,      # secondary copy / timeline descriptions
    small_lead=11.4,
    contact=9,      # phone / e-mail
    eyebrow=7,      # tracked caps labels
    label=6.6,      # tiny caps labels, chips, pills
    map=6.4,        # city names
)
M = 25.51           # side margin inside a panel (9 mm)
CW = PANEL_W - 2 * M  # content width (229.6 pt)

F_L, F_R, F_M, F_SB, F_B = ("Poppins-Light", "Poppins-Regular", "Poppins-Medium",
                            "Poppins-SemiBold", "Poppins-Bold")


# ------------------------------------------------------------------ panel helpers
class Panel:
    """Panel-local coordinates: u from the panel's left trim edge, v from the trim top."""

    def __init__(self, c, col):
        self.c, self.col = c, col
        self.x0 = TRIM_X0 + col * PANEL_W

    def X(self, u): return self.x0 + u
    def Y(self, v): return TRIM_TOP + v

    def rect(self, u, v, w, h, **kw): rect(self.c, self.X(u), self.Y(v), w, h, **kw)
    def circle(self, u, v, r, **kw): circle(self.c, self.X(u), self.Y(v), r, **kw)

    def text(self, u, v, s, font, size, color, track=0.0, align="left"):
        return text(self.c, self.X(u), self.Y(v), s, font, size, color, track, align)

    def para(self, u, v, w, s, font, size, leading, color, **kw):
        return paragraph(self.c, self.X(u), self.Y(v), w, s, font, size, leading, color, **kw) - TRIM_TOP

    def wordmark(self, u, v, size, color): draw_wordmark(self.c, self.X(u), self.Y(v), size, color)

    def vec(self, items, region, u, v, scale=1.0, **kw):
        draw_vectors(self.c, items, region, self.X(u), self.Y(v), scale, **kw)

    def pill(self, u, v, s, font, size, fg, bg, padx=7, h=None, track=0.5, align="left", alpha=1.0):
        """Rounded label. (u, v) = left/top (align=left) or centre/top (align=center)."""
        w = sw(s, font, size, track) - track + 2 * padx
        h = h or size + 6.4
        left = u if align == "left" else u - w / 2.0
        self.rect(left, v, w, h, fill=bg, r=h / 2.0, alpha=alpha)
        self.text(left + w / 2.0, v + h / 2.0 + size * 0.35, s, font, size, fg, track, align="center")
        return w

    def caps_wm(self, u, v, pre, post, size, color, track, align="left"):
        """Tracked caps with the BigBen wordmark in the middle; returns total width."""
        wp, wq = sw(pre, F_B, size, track), sw(post, F_B, size, track)
        wm = wordmark_width(size + 0.8)
        total = wp + wm + wq
        if align == "center":
            u -= total / 2.0
        self.text(u, v, pre, F_B, size, color, track=track)
        self.wordmark(u + wp, v, size + 0.8, color)
        self.text(u + wp + wm, v, post, F_B, size, color, track=track)
        return total

    def eyebrow(self, u, v, s, color, align="left", wm=False):
        return self.text(u, v, s, F_B, TYPE["eyebrow"], color, track=1.7, align=align)


# ------------------------------------------------------------------ shared artwork
V1 = load_vectors(SRC, 0)   # page 1 vectors (outside)
V2 = load_vectors(SRC, 1)   # page 2 vectors (inside)


def infinity_icon(p, which, u, v, scale=1.0):
    region = {"p6": (525.0, 74.0, 586.0, 96.0), "p3": (367.0, 321.5, 401.2, 334.0),
              "eq": (77.5, 506.5, 121.0, 522.5)}[which]
    items = V1 if which == "p6" else V2
    p.vec(items, region, u, v, scale)


def nda_logo(p, u, v, scale=1.0):
    p.vec(V1, (103.5, 97.4, 262.2, 144.7), u, v, scale)


# ================================================================== PANEL 4 — NDA Apparels
def panel4(c, col):
    p = Panel(c, col)
    block_h = 176
    # black masthead (bleeds left + top)
    rect(c, TRIM_X0 - BLEED, TRIM_TOP - BLEED, PANEL_W + BLEED, block_h + BLEED, fill=RICH_BLACK)
    # eyebrow: THE COMPANY BEHIND BigBen
    p.caps_wm(PANEL_W / 2, 34, "THE COMPANY BEHIND ", "", TYPE["eyebrow"], PINK, 1.7, align="center")
    # NDA Apparels logo (vector, white)
    nda_logo(p, (PANEL_W - 158.0) / 2.0, 52, 1.0)
    # descriptor
    p.text(PANEL_W / 2, 123, "MANUFACTURERS OF HOSIERY", F_M, 7, PINK, track=1.0, align="center")
    p.text(PANEL_W / 2, 135, "& READYMADE T-SHIRTS", F_M, 7, PINK, track=1.0, align="center")
    p.text(PANEL_W / 2, 157, "Tirupur, Tamil Nadu, India", F_R, 8.6, WHITE, align="center")

    # intro
    p.text(M, 211, "Introducing NDA Apparels", F_B, TYPE["h2"], INK)
    end = p.para(M, 222, CW,
                 "Since 2018, we have been shaping fabric into everyday favourites. From the first "
                 "sketch and the right fabric to cutting, stitching, finishing and the final fold, "
                 "every piece passes through careful hands — made with the same joy {BB} promises "
                 "every child.", F_R, TYPE["lead"], TYPE["lead_lead"], INK)

    # fact table
    rows = [("ESTABLISHED", "2018", False), ("BASE", "Tirupur, Tamil Nadu", False),
            ("SPECIALISATION", "Hosiery & readymade T-shirts", False), ("OWN BRAND", "{BB} kidswear", True)]
    y = end + 12
    pitch = 25.5
    for i, (k, val, wm) in enumerate(rows):
        p.rect(M, y + i * pitch, CW, 0.5, fill=(0, 0, 0, 0.12))
        base = y + i * pitch + pitch / 2 + 3
        p.text(M, base, k, F_B, TYPE["label"], BLUE, track=1.0)
        if wm:
            tail = " kidswear"
            wtail = sw(tail, F_M, 8.6)
            ww = wordmark_width(8.6)
            p.wordmark(M + CW - wtail - ww, base, 8.6, INK)
            p.text(M + CW, base, tail, F_M, 8.6, INK, align="right")
        else:
            p.text(M + CW, base, val, F_M, 8.6, INK, align="right")
    p.rect(M, y + len(rows) * pitch, CW, 0.5, fill=(0, 0, 0, 0.12))

    # premises photo
    top = y + len(rows) * pitch + 14
    h = PANEL_H - 24 - top
    draw_image_cover(c, IMG("i-000.jpg"), p.X(M), p.Y(top), CW, h, r=7.1, focus=(0.5, 0.35))
    p.pill(M + 8, top + h - 8 - 14, "Our premises", F_B, TYPE["label"], INK, WHITE, padx=8, h=14, track=0.2)
    return p


# ================================================================== PANEL 6 — Work with us
CITY_DOTS = {  # original page-1 coordinates (top-based) of each network-city dot
    "Srinagar": (432.4, 305.9), "Haryana": (441.0, 342.1), "Delhi": (448.4, 345.3),
    "Jaipur": (439.0, 357.6), "Lucknow": (473.4, 358.0), "Ajmer": (431.3, 360.9),
    "Kanpur": (469.3, 360.9), "Jodhpur": (420.5, 362.4), "Himmatnagar": (420.1, 381.4),
    "Ahmedabad": (417.5, 385.6), "Indore": (439.4, 387.8), "Kolkata": (522.9, 388.8),
    "Rourkela": (499.5, 391.1), "Raipur": (478.0, 398.3), "Surat": (419.2, 398.9),
    "Nagpur": (461.0, 399.1), "Bhubaneswar": (505.9, 405.2), "Mumbai": (419.5, 414.0),
    "Visakhapatnam": (488.6, 424.0), "Solapur": (439.8, 424.2), "Hyderabad": (457.0, 426.1),
    "Amaravati": (470.6, 432.5), "Vijayawada": (471.4, 432.5), "Belgaum": (430.4, 437.2),
    "Hubballi": (434.5, 440.8), "Chennai": (468.9, 457.2), "Bengaluru": (451.0, 458.0),
    "Mysore": (444.6, 462.8), "Salem": (454.7, 467.4), "Calicut": (438.9, 470.3),
    "Tirur": (439.8, 472.8), "Cochin": (442.2, 479.9), "Madurai": (454.5, 479.9),
    "Kollam": (444.4, 487.4),
}
HQ_DOT = (449.3, 471.4)
MAP_REGION = (380.0, 280.0, 596.0, 512.0)

# label placement: name -> (side, extra_dx, extra_dy[, leader])   side = r | l | t | b
LABELS = {
    "Srinagar": ("r", 0, 0), "Haryana": ("l", 0, 0), "Delhi": ("r", 0, 0),
    "Jaipur": ("l", 0, -5), "Lucknow": ("r", 0, 0), "Ajmer": ("r", 0, 5),
    "Kanpur": ("r", 0, 8), "Jodhpur": ("l", 0, 0), "Himmatnagar": ("r", 0, -2.5),
    "Ahmedabad": ("l", 0, 0), "Indore": ("r", 0, 0), "Kolkata": ("r", 0, 0),
    "Rourkela": ("r", 5, 8), "Raipur": ("r", 0, -14), "Surat": ("l", 0, 0),
    "Nagpur": ("l", 0, 0), "Bhubaneswar": ("r", 0, 5), "Mumbai": ("r", 0, 0),
    "Visakhapatnam": ("r", 0, 0), "Solapur": ("l", 0, 0), "Hyderabad": ("r", 0, -11),
    "Amaravati": ("r", 0, 11), "Vijayawada": ("r", 0, 2.5), "Belgaum": ("l", 0, 0),
    "Hubballi": ("r", 0, 0), "Chennai": ("r", 0, 0), "Bengaluru": ("l", 0, -5),
    "Mysore": ("l", 5, 0), "Salem": ("r", 0, 0), "Calicut": ("l", 0, 11),
    "Tirur": ("l", 0, 0), "Cochin": ("r", 0, 14), "Madurai": ("r", 0, 0),
    "Kollam": ("l", 0, 5),
}


def contact_icon(c, kind, x, top, color=PINK):
    """Tiny 10 x 10 pt outline icons (x, top = top-left corner, top-based)."""
    c.saveState()
    c.setStrokeColor(cmyk(*color))
    c.setFillColor(cmyk(*color))
    c.setLineWidth(0.9)
    c.setLineCap(1)
    c.setLineJoin(1)

    def P(px, py): return x + px, PAGE_H - (top + py)

    p = c.beginPath()
    if kind == "person":
        c.circle(*P(5, 2.9), 2.3, stroke=1, fill=0)
        p.moveTo(*P(1.1, 9.8)); p.curveTo(*P(1.1, 6.9), *P(3.0, 6.3), *P(5, 6.3))
        p.curveTo(*P(7.0, 6.3), *P(8.9, 6.9), *P(8.9, 9.8))
        c.drawPath(p, stroke=1, fill=0)
    elif kind == "phone":
        c.roundRect(x + 2.0, PAGE_H - (top + 9.8), 6.0, 9.6, 1.4, stroke=1, fill=0)
        p.moveTo(*P(4.0, 1.9)); p.lineTo(*P(6.0, 1.9))
        c.drawPath(p, stroke=1, fill=0)
        c.circle(*P(5, 8.0), 0.45, stroke=0, fill=1)
    elif kind == "mail":
        c.roundRect(x + 0.4, PAGE_H - (top + 8.6), 9.2, 7.0, 1.3, stroke=1, fill=0)
        p.moveTo(*P(0.9, 2.3)); p.lineTo(*P(5, 5.7)); p.lineTo(*P(9.1, 2.3))
        c.drawPath(p, stroke=1, fill=0)
    elif kind == "pin":
        p.moveTo(*P(5, 10.0))
        p.curveTo(*P(2.6, 6.9), *P(1.2, 5.3), *P(1.2, 3.8))
        p.curveTo(*P(1.2, 1.9), *P(2.9, 0.6), *P(5, 0.6))
        p.curveTo(*P(7.1, 0.6), *P(8.8, 1.9), *P(8.8, 3.8))
        p.curveTo(*P(8.8, 5.3), *P(7.4, 6.9), *P(5, 10.0))
        c.drawPath(p, stroke=1, fill=0)
        c.circle(*P(5, 3.8), 1.3, stroke=1, fill=0)
    c.restoreState()


MAP_SCALE = 0.9
MAP_U, MAP_V = 41.0, 270.0          # where the map region's top-left lands (panel coords)
LEGEND_UV = (178.0, 172.0)         # legend dot position relative to the map top


def map_xy(p, name_or_pt):
    x, y = CITY_DOTS[name_or_pt] if isinstance(name_or_pt, str) else name_or_pt
    return (p.X(MAP_U + (x - MAP_REGION[0]) * MAP_SCALE),
            p.Y(MAP_V + (y - MAP_REGION[1]) * MAP_SCALE))


def draw_map(p, report=None):
    c = p.c
    p.vec(V1, MAP_REGION, MAP_U, MAP_V, MAP_SCALE)
    boxes = {}
    fs = TYPE["map"]
    for name, spec in LABELS.items():
        side, ddx, ddy = spec[:3]
        cx, cy = map_xy(p, name)
        w = sw(name, F_M, fs)
        if side == "r":
            x, b = cx + 4.6 + ddx, cy + 2.3 + ddy
            al = "left"
        elif side == "l":
            x, b = cx - 4.6 - ddx, cy + 2.3 + ddy
            al = "right"
        elif side == "t":
            x, b = cx + ddx, cy - 5.2 + ddy
            al = "center"
        else:
            x, b = cx + ddx, cy + 9.4 + ddy
            al = "center"
        text(c, x, b, name, F_M, fs, WHITE, align=al)
        x0 = x if al == "left" else (x - w if al == "right" else x - w / 2)
        if side in ("l", "r") and (abs(ddy) >= 3.0 or ddx >= 4.0):      # short leader to the dot
            sgn = 1 if side == "r" else -1
            c.saveState()
            c.setStrokeColor(cmyk(*WHITE, alpha=0.75))
            c.setLineWidth(0.35)
            c.line(cx + sgn * 2.9, PAGE_H - cy, x - sgn * 0.6, PAGE_H - (b - fs * 0.33))
            c.restoreState()
        boxes[name] = (x0, b - fs * 0.72, x0 + w, b + fs * 0.12)
    if report is not None:
        report.update(boxes)
    return boxes


def panel6(c, col):
    p = Panel(c, col)
    rect(c, p.x0, TRIM_TOP - BLEED, PANEL_W, PANEL_H + 2 * BLEED, fill=BLUE)

    p.eyebrow(M, 35, "WORK WITH US", PINK)
    infinity_icon(p, "p6", PANEL_W - M - 60.1, 22.0, 1.0)
    p.text(M, 69, "Let’s grow together.", F_B, TYPE["h1"], WHITE)
    end = p.para(M, 82, CW, "For wholesalers, distributors, retailers, sourcing teams and partners — "
                 "talk to our sales team about {BB}.", F_R, TYPE["lead"], TYPE["lead_lead"], WHITE)
    p.pill(M, end + 9, "OEM / ODM ENQUIRIES WELCOME", F_B, TYPE["label"], BLUE, WHITE, padx=9, h=15, track=0.9)

    # contacts
    y = end + 45
    ix, tx = M, M + 19
    contact_icon(c, "person", p.X(ix), p.Y(y - 8))
    p.text(tx, y, "Mohammed Ali · 97511 33009", F_M, TYPE["contact"], WHITE)
    p.text(tx, y + 10.5, "FOUNDER & CEO", F_B, TYPE["label"] - 0.4, PINK, track=1.0)
    y += 30
    contact_icon(c, "phone", p.X(ix), p.Y(y - 8))
    p.text(tx, y, "SALES", F_B, TYPE["label"], PINK, track=1.0)
    p.text(tx + 36, y, "63793 14002", F_M, TYPE["contact"], WHITE)
    y += 18
    contact_icon(c, "mail", p.X(ix), p.Y(y - 8))
    p.text(tx, y, "ndaapparels.tup@gmail.com", F_M, TYPE["contact"], WHITE)
    y += 18
    contact_icon(c, "pin", p.X(ix), p.Y(y - 8))
    end = p.para(tx, y - 7, PANEL_W - 14 - tx,
                 "27C/2, ERP Layout, Near Sowdambikai Amman Kalyana Mandapam, College Road, "
                 "Tirupur – 641602, Tamil Nadu, India", F_R, 7.2, 10.4, WHITE)

    # network map
    p.eyebrow(M, end + 20, "OUR NETWORK ACROSS INDIA", PINK)
    global MAP_V
    MAP_V = end + 29
    draw_map(p)
    lx, ly = LEGEND_UV[0], MAP_V + LEGEND_UV[1]
    p.circle(lx, ly, 3.4, fill=WHITE)
    p.circle(lx, ly, 2.4, fill=PINK)
    p.text(lx + 8, ly + 2.3, "Tirupur — HQ", F_B, TYPE["map"], WHITE)
    p.circle(lx, ly + 11, 2.6, fill=WHITE)
    p.circle(lx, ly + 11, 1.8, fill=PINK)
    p.text(lx + 8, ly + 13.3, "Network city", F_M, TYPE["map"], WHITE)

    # QR + links
    qv = MAP_V + (MAP_REGION[3] - MAP_REGION[1]) * MAP_SCALE - 10
    qv = max(qv, 484.0)
    p.vec(V1, (348.5, 518.4, 402.8, 572.9), M, qv, 1.0)
    sx = M + 54 + 12
    p.caps_wm(sx, qv + 11, "SCAN FOR ", " LINKS", TYPE["label"], PINK, 1.0)
    for i, (k, vtxt) in enumerate((("Instagram", "bigben_clothing"), ("YouTube", "@bigbenindia"),
                                   ("Facebook", "@bigbenindia"))):
        p.text(sx, qv + 25 + 12 * i, k, F_B, 7.4, WHITE)
        p.text(sx + 44, qv + 25 + 12 * i, vtxt, F_R, 7.4, WHITE)

    # house-of footer
    fy = 562.0
    p.text(M, fy + 14, "FROM THE HOUSE OF", F_B, TYPE["label"], PINK, track=1.4)
    nda_logo(p, PANEL_W - M - 158 * 0.66, fy, 0.66)
    return p


# ================================================================== PANEL 1 — Cover
def panel1(c, col):
    p = Panel(c, col)
    # photo, clipped by the wavy lower edge
    c.saveState()
    clip = c.beginPath()
    x0, x1 = p.x0, p.x0 + PANEL_W + BLEED
    top = TRIM_TOP - BLEED
    clip.moveTo(x0, PAGE_H - top)
    clip.lineTo(x1, PAGE_H - top)
    clip.lineTo(x1, PAGE_H - p.Y(323.15))
    clip.curveTo(p.X(182.41), PAGE_H - p.Y(351.50), p.X(98.22), PAGE_H - p.Y(300.48),
                 x0, PAGE_H - p.Y(334.49))
    clip.close()
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(os.path.join(HERE, "assets", "img", "i-001.jpg"), x0, PAGE_H - 399.7,
                289.1, 365.7)
    c.restoreState()
    # the two ribbon lines that follow the wave (pink + blue)
    p.vec(V1, (603.5, 375.0, 893.5, 397.5), 603.78 - p.x0 + 0 * 1, 375.6 - TRIM_TOP, 1.0)

    # logo group
    dy = -6.0
    p.vec(V1, (666.0, 413.0, 822.0, 537.0), 667.6 - 603.78 + 0.0, 414.5 - TRIM_TOP + dy, 1.0)
    # (registered mark, as in the original)
    text(c, 806.2, 504.0 + dy, "®", F_R, 11, INK)

    p.text(PANEL_W / 2, 507, "KIDSWEAR · BRAND & COMPANY PORTFOLIO", F_B, 6.8, BLUE, track=1.1, align="center")

    # Instagram card
    cv, ch = 520.0, 58.0
    cw = CW - 6
    cu = (PANEL_W - cw) / 2
    p.rect(cu, cv, cw, ch, fill=PALE_PINK, r=9)
    qs = 46.0
    p.vec(V1, (658.0, 570.0, 705.6, 617.6), cu + 6, cv + (ch - qs) / 2, qs / 47.1)
    tx = cu + 6 + qs + 11
    p.text(tx, cv + 17, "FOLLOW US ON INSTAGRAM", F_B, 6.4, PINK, track=0.9)
    p.text(tx, cv + 33, "@bigben_clothing", F_B, 11, BLUE)
    p.text(tx, cv + 47, "From the house of NDA Apparels", F_R, 6.8, INK)
    return p


# ================================================================== PANEL 2 — Meet BigBen
def panel2(c, col):
    p = Panel(c, col)
    c.saveState()
    clip = c.beginPath()
    x0 = p.x0 - BLEED
    top = TRIM_TOP - BLEED
    clip.moveTo(x0, PAGE_H - top)
    clip.lineTo(p.x0 + PANEL_W, PAGE_H - top)
    clip.lineTo(p.x0 + PANEL_W, PAGE_H - p.Y(215.44))
    clip.curveTo(p.X(168.38), PAGE_H - p.Y(238.11), p.X(84.19), PAGE_H - p.Y(198.43),
                 x0, PAGE_H - p.Y(221.11))
    clip.close()
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(IMG("i-002.jpg"), 34.0, PAGE_H - 292.0, 289.1, 258.0)
    c.restoreState()

    # heading block
    t = "MEET "
    p.text(M, 268, t, F_B, 14, PINK, track=2.6)
    p.wordmark(M + sw(t, F_B, 14, 2.6), 268, 14, PINK)
    p.text(M, 298, "Let kids be kids.", F_B, TYPE["h1"], INK)
    end = p.para(M, 309, CW,
                 "{BB} is not just a clothing brand; it celebrates childhood in all its infinite "
                 "joyful energy and spirited wonder. Our collection is meticulously designed to "
                 "let kids be kids, embracing every moment of exploration and play.",
                 F_R, TYPE["lead"], TYPE["lead_lead"], INK)

    # value pills (two rows of three)
    tags = [["JOYFUL", "PLAYFUL", "IMAGINATIVE"], ["COMFORT", "QUALITY", "SPORTY"]]
    colours = [[PINK, BLUE, PINK], [BLUE, PINK, BLUE]]
    y = end + 12
    for r, row in enumerate(tags):
        u = M
        for i, tg in enumerate(row):
            w = p.pill(u, y + r * 20, tg, F_B, TYPE["label"], WHITE, colours[r][i], padx=9, h=15, track=0.8)
            u += w + 6

    # logo-meaning card
    cv = y + 2 * 20 + 6
    ch = PANEL_H - 26 - cv
    p.rect(M, cv, CW, ch, fill=PALE_PINK, r=10)
    ey = cv + 18
    infinity_icon(p, "eq", M + 14, ey, 1.0)
    p.text(M + 14 + 43 + 11, ey + 14, "+", F_B, 10, BLUE, align="center")
    p.text(M + 14 + 43 + 34, ey + 18, "bb", F_B, 15, INK, align="center")
    p.text(M + 14 + 43 + 62, ey + 14, "=", F_B, 10, BLUE, align="center")
    p.vec(V2, (189.5, 498.0, 238.6, 534.8), M + CW - 14 - 48.6, ey - 7, 1.0)
    cap_v = ey + 44
    p.text(M + 14, cap_v + 8, "Infinity + B-alphabet.", F_B, TYPE["small"], INK)
    p.para(M + 14, cap_v + 11, CW - 28, "Limitless childhood — to ignite kids’ curiosity, mental and "
           "physical confidence.", F_R, TYPE["small"], TYPE["small_lead"], INK)
    return p


# ================================================================== PANEL 3 — The Journey
def panel3(c, col):
    p = Panel(c, col)
    rect(c, p.x0, TRIM_TOP - BLEED, PANEL_W, PANEL_H + 2 * BLEED, fill=PALE_BLUE)
    p.eyebrow(M, 35, "THE JOURNEY", BLUE)
    p.text(M, 68, "How ", F_B, TYPE["h1"], INK)
    p.wordmark(M + sw("How ", F_B, TYPE["h1"]), 68, TYPE["h1"], INK)
    p.text(M, 95, "came to play", F_B, TYPE["h1"], INK)

    # timeline
    nx = 34.0
    ux = 54.0
    tw = PANEL_W - M - ux
    entries = [
        ("2018", PINK, "NDA Apparels begins", None, "Hosiery & readymade T-shirts, Tirupur."),
        ("2019", BLUE, "{BB} is born", True, "Kidswear from the house of NDA Apparels."),
        ("2024", PINK, "The identity takes shape", None,
         "Brand guidelines set the infinity + bb logo and “Playing Infinite”."),
        (None, BLUE, "The collection grows infinitely", None,
         "Tees, polos, collar shirts, zip jackets and co-ord sets — for boys and girls."),
    ]
    v = 118.0
    nodes = []
    for year, colr, title, wm, desc in entries:
        nodes.append((v + 6, colr))
        if year:
            p.text(ux, v + 10.4, year, F_B, 12, colr)
        else:
            infinity_icon(p, "p3", ux, v + 0.2, 1.0)
        # title (wordmark inline if present)
        tb = v + 27
        if wm:
            p.wordmark(ux, tb, 9.2, INK)
            p.text(ux + wordmark_width(9.2) + 2.6, tb, "is born", F_B, 9.2, INK)
        else:
            p.text(ux, tb, title, F_B, 9.2, INK)
        endv = p.para(ux, tb + 5.2, tw, desc, F_R, TYPE["small"], TYPE["small_lead"], INK)
        v = endv + 15
    # dotted connector + nodes
    c.saveState()
    c.setStrokeColor(cmyk(*BLUE))
    c.setLineWidth(1.2)
    c.setLineCap(1)
    c.setDash([0.1, 2.9], 0)
    c.line(p.X(nx), PAGE_H - p.Y(nodes[0][0]), p.X(nx), PAGE_H - p.Y(nodes[-1][0]))
    c.restoreState()
    for nv, colr in nodes:
        p.circle(nx, nv, 6.4, fill=colr)
        p.circle(nx, nv, 2.7, fill=WHITE)

    # collection grid
    gv = v + 2
    p.text(M, gv + 7, "THE COLLECTION TODAY", F_B, TYPE["eyebrow"] - 0.4, BLUE, track=1.4)
    top = gv + 17
    gap = 7.3
    avail = PANEL_H - 26 - top
    th = (avail - 2 * gap) / 3.0
    th = min(th, 64.6)
    wide_w = (CW - gap) * 0.60
    narrow_w = CW - gap - wide_w
    layout = [
        (("i-003.jpg", "Round-neck tees", "w"), ("i-004.jpg", "Drop-shoulder", "n")),
        (("i-005.jpg", "Polos", "n"), ("i-006.jpg", "Collar shirts", "w")),
        (("i-007.jpg", "Zip jackets", "w"), ("i-008.jpg", "Co-ord sets", "n")),
    ]
    for row, pair in enumerate(layout):
        u = M
        v0 = top + row * (th + gap)
        for img, label, kind in pair:
            w = wide_w if kind == "w" else narrow_w
            draw_image_cover(c, IMG(img), p.X(u), p.Y(v0), w, th, r=8)
            p.pill(u + 7, v0 + th - 7 - 13.5, label, F_B, TYPE["label"], INK, WHITE, padx=7, h=13.5, track=0.2)
            if label == "Co-ord sets":
                wg = sw("GIRLS", F_B, 6.2, 0.8) - 0.8 + 12
                p.pill(u + w - 7 - wg, v0 + 7, "GIRLS", F_B, 6.2, WHITE, PINK, padx=6, h=12, track=0.8)
            u += w + gap
    return p


# ================================================================== PANEL 5 — How we work
STEPS = [  # (label, image, side) in order 1..8 ; rows alternate L->R, R->L
    ("Design & prints", "i-009.jpg"), ("Fabric selection", "i-010.jpg"),
    ("Sampling", "i-011.jpg"), ("Cutting", "i-012.jpg"),
    ("Stitching", "i-013.jpg"), ("Finishing &\nquality check", "i-014.jpg"),
    ("Branded trims &\npacking", "i-015.jpg"), ("Dispatch", "i-016.jpg"),
]


def panel5(c, col):
    p = Panel(c, col)
    # --- full-bleed fabric photo + white veil for legibility
    x0 = p.x0
    bw, bh = PANEL_W + BLEED, PANEL_H + 2 * BLEED
    draw_image_cover(c, FABRIC_BG, x0, TRIM_TOP - BLEED, bw, bh, focus=(0.55, 0.5))
    rect(c, x0, TRIM_TOP - BLEED, bw, bh, fill=WHITE, alpha=0.80)

    p.eyebrow(M, 35, "HOW WE WORK", BLUE)
    p.text(M, 68, "From idea", F_B, TYPE["h1"], INK)
    p.text(M, 95, "to garment", F_B, TYPE["h1"], INK)

    # --- serpentine road
    r = 47.0
    xl, xr = 76.0, 206.0
    pitch = 2 * r
    rows = [186.0 + i * pitch for i in range(4)]

    def P(u, v): return p.X(u), PAGE_H - p.Y(v)

    k = 0.5523 * r
    path = c.beginPath()
    path.moveTo(*P(xl - r, rows[0]))
    path.lineTo(*P(xr, rows[0]))
    for i in range(3):
        v0, v1 = rows[i], rows[i + 1]
        if i % 2 == 0:      # right-hand turn, then run right -> left
            path.curveTo(*P(xr + k, v0), *P(xr + r, v0 + r - k), *P(xr + r, v0 + r))
            path.curveTo(*P(xr + r, v0 + r + k), *P(xr + k, v1), *P(xr, v1))
            path.lineTo(*P(xl, v1))
        else:               # left-hand turn, then run left -> right
            path.curveTo(*P(xl - k, v0), *P(xl - r, v0 + r - k), *P(xl - r, v0 + r))
            path.curveTo(*P(xl - r, v0 + r + k), *P(xl - k, v1), *P(xl, v1))
            path.lineTo(*P(xr, v1))
    path.lineTo(*P(xl - r + 4, rows[3]))
    for lw, colr, dash in ((27.0, PALE_BLUE, None), (18.4, BLUE, None), (0.7, WHITE, [3.2, 2.6])):
        c.saveState()
        c.setStrokeColor(cmyk(*colr))
        c.setLineWidth(lw)
        c.setLineCap(1)
        c.setLineJoin(1)
        if dash:
            c.setDash(dash, 0)
        c.drawPath(path, stroke=1, fill=0)
        c.restoreState()

    # arrow at the end of the road
    ar = c.beginPath()
    ar.moveTo(*P(xl - r - 3, rows[3]))
    ar.lineTo(*P(xl - r + 11, rows[3] - 10))
    ar.lineTo(*P(xl - r + 11, rows[3] + 10))
    ar.close()
    c.setFillColor(cmyk(*PINK))
    c.drawPath(ar, stroke=0, fill=1)
    # START tag
    p.pill(xl - r - 9, rows[0] - 6.5, "START", F_B, 6.0, WHITE, PINK, padx=6, h=13, track=0.9)

    # --- step circles, labels, number badges
    pos = [(xl, 0), (xr, 0), (xr, 1), (xl, 1), (xl, 2), (xr, 2), (xr, 3), (xl, 3)]
    for n, ((label, img), (cu, ri)) in enumerate(zip(STEPS, pos), start=1):
        cv = rows[ri]
        R = 24.0
        p.circle(cu, cv, R, fill=WHITE)
        c.saveState()
        cp = c.beginPath()
        cp.circle(p.X(cu), PAGE_H - p.Y(cv), R - 2.4)
        c.clipPath(cp, stroke=0, fill=0)
        c.drawImage(IMG(img), p.X(cu) - R + 2.4, PAGE_H - p.Y(cv) - R + 2.4, 2 * R - 4.8, 2 * R - 4.8)
        c.restoreState()
        bc = PINK if n % 2 == 1 else BLUE
        p.circle(cu + 17.5, cv - 17.5, 8.4, fill=bc, stroke=WHITE, lw=1.2)
        p.text(cu + 17.5, cv - 17.5 + 2.9, str(n), F_B, 8.2, WHITE, align="center")
        lines = label.split("\n")
        base0 = cv - R - 6 - (len(lines) - 1) * 10.6
        for j, ln in enumerate(lines):
            p.text(cu, base0 + j * 10.6, ln, F_B, 8.2, INK, align="center")

    # --- fabrics
    fv = rows[3] + 24 + 22
    p.text(M, fv, "FABRIC WE DEAL WITH", F_B, TYPE["label"], BLUE, track=1.1)
    p.para(M, fv + 4, CW, "100% Cotton jersey · Cotton lycra · French terry (loopknit) · Tencil lycra · "
           "Scuba tencil · Blended fabrics · Imported fabrics · Jacquards, etc.",
           F_R, TYPE["small"], TYPE["small_lead"] + 0.6, INK)
    return p


# ================================================================== slugs / marks
def slug(c, page_no):
    c.saveState()
    c.setStrokeColor(cmyk(*REG))
    c.setLineWidth(0.25)
    tx0, tx1 = TRIM_X0, TRIM_X1
    ty0, ty1 = TRIM_TOP, TRIM_BOTTOM
    L = 17.0
    off = 11.3
    for x in (tx0, tx1):
        for yy, sgn in ((ty0, -1), (ty1, 1)):
            c.line(x, PAGE_H - (yy + sgn * off), x, PAGE_H - (yy + sgn * (off + L)))
    for y in (ty0, ty1):
        for xx, sgn in ((tx0, -1), (tx1, 1)):
            c.line(xx + sgn * off, PAGE_H - y, xx + sgn * (off + L), PAGE_H - y)
    c.setDash([2, 1.5], 0)
    for k in (1, 2):
        x = TRIM_X0 + k * PANEL_W
        c.line(x, PAGE_H - (ty0 - off), x, PAGE_H - (ty0 - off - L))
        c.line(x, PAGE_H - (ty1 + off), x, PAGE_H - (ty1 + off + L))
    c.restoreState()
    note = ("Trim 297 x 210 mm · Bleed 3 mm · CMYK (FOGRA39) · FONTS PROVISIONAL: Poppins stands in "
            "for Baloo 2 / Nunito — reset before print")
    text(c, TRIM_X0, 12.1 - 1.2, note, F_R, 5.5, REG)
    if page_no == 1:
        labels = ["PANEL 4 — NDA APPARELS", "PANEL 6 — WORK WITH US", "PANEL 1 — FRONT COVER"]
        info = ("NDA_BIGBEN_Accordion_6pnl | Side A (outside) — panels 4 | 6 | 1 cover | Fold: mountain "
                "at 198 mm, valley at 99 mm (viewed from this side)")
    else:
        labels = ["PANEL 2 — MEET {BB}", "PANEL 3 — THE JOURNEY", "PANEL 5 — HOW WE WORK (FOLDED BACK)"]
        info = ("NDA_BIGBEN_Accordion_6pnl | Side B (inside) — panels 2 | 3 | 5 | Turn on the vertical "
                "(short) edge: panel 2 backs the cover; panel 5 is the folded back")
    for i, lab in enumerate(labels):
        cx = TRIM_X0 + (i + 0.5) * PANEL_W
        if "{BB}" in lab:
            pre = "PANEL 2 — MEET "
            w = sw(pre, F_B, 5.4, 0.6) + wordmark_width(5.4)
            text(c, cx - w / 2, 666.6, pre, F_B, 5.4, REG, track=0.6)
            draw_wordmark(c, cx - w / 2 + sw(pre, F_B, 5.4, 0.6), 666.6, 5.4, REG)
        else:
            text(c, cx, 666.6, lab, F_B, 5.4, REG, track=0.6, align="center")
    text(c, TRIM_X0, 675.4, info, F_R, 5.5, REG)


# ================================================================== main
def build(path=OUT):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    register_fonts()
    c = canvas.Canvas(path, pagesize=(PAGE_W, PAGE_H), pageCompression=1)
    c.setTitle("BigBen × NDA Apparels — 6-panel accordion (Z-fold, DL panels)")
    c.setAuthor("NDA Apparels / BIGBEN")
    c.setSubject("NDA_BIGBEN_Accordion_6pnl")

    for page_no, panels in ((1, (panel4, panel6, panel1)), (2, (panel2, panel3, panel5))):
        rect(c, TRIM_X0 - BLEED, TRIM_TOP - BLEED, 3 * PANEL_W + 2 * BLEED, PANEL_H + 2 * BLEED, fill=WHITE)
        for col, fn in enumerate(panels):
            fn(c, col)
        slug(c, page_no)
        c.showPage()
    c.save()
    print("wrote", path)


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else OUT)
