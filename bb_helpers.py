"""Shared helpers for the BigBen x NDA Apparels accordion brochure build.

All layout coordinates in this project are TOP-BASED points (origin top-left of the
page, y growing downwards) so they line up with what pdfplumber reports for the
original PDF.  The helpers convert to ReportLab's bottom-up space internally.
"""
import os
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from reportlab.lib.colors import CMYKColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLTTFont
from reportlab.pdfgen.pathobject import PDFPathObject

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(HERE, "assets", "fonts")

# ---------------------------------------------------------------- page geometry
PAGE_W, PAGE_H = 926.929, 680.315
MM = 72 / 25.4
BLEED = 3 * MM
TRIM_X0, TRIM_TOP = 42.52, 42.52           # top-left corner of the trim box
PANEL_W = 99 * MM                          # 280.63 pt
PANEL_H = 210 * MM                         # 595.28 pt
TRIM_X1, TRIM_BOTTOM = TRIM_X0 + 3 * PANEL_W, TRIM_TOP + PANEL_H

# ---------------------------------------------------------------- brand colours
# (identical CMYK values to the original artwork)
def cmyk(c, m, y, k, alpha=1.0):
    return CMYKColor(c, m, y, k, alpha=alpha)

PINK = (0.0, 0.55, 0.27, 0.0)
BLUE = (0.84, 0.38, 0.04, 0.30)
BLUE_D = (0.84, 0.38, 0.04, 0.48)
RICH_BLACK = (0.6, 0.4, 0.4, 1.0)
INK = (0.0, 0.0, 0.0, 1.0)
WHITE = (0.0, 0.0, 0.0, 0.0)
PALE_PINK = (0.0, 0.12, 0.06, 0.0)
PALE_BLUE = (0.10, 0.04, 0.0, 0.03)
REG = (1.0, 1.0, 1.0, 1.0)                 # registration colour for marks

# ---------------------------------------------------------------- fonts
FONTS = {
    "Light": "Poppins-Light.ttf",
    "Regular": "Poppins-Regular.ttf",
    "Medium": "Poppins-Medium.ttf",
    "SemiBold": "Poppins-SemiBold.ttf",
    "Bold": "Poppins-Bold.ttf",
}


def register_fonts():
    for key, fn in FONTS.items():
        pdfmetrics.registerFont(RLTTFont("Poppins-" + key, os.path.join(FONT_DIR, fn)))


# The "BigBen" wordmark ships as a 6-glyph subset with no cmap, so it is drawn as
# outlines.  Glyph ids were identified by rendering them: 2=B 3=e 4=g 5=i 6=n.
_WM = TTFont(os.path.join(FONT_DIR, "BigBenLogo-subset.ttf"))
_WM_GS = _WM.getGlyphSet()
_WM_ORDER = ["glyph00002", "glyph00005", "glyph00004", "glyph00002", "glyph00003", "glyph00006"]  # B i g B e n
_WM_ADV = {g: _WM["hmtx"][g][0] for g in _WM.getGlyphOrder()}
WORDMARK_EM = sum(_WM_ADV[g] for g in _WM_ORDER) / 1000.0   # width in em


class _GlyphPen(BasePen):
    def __init__(self, gs, path, scale, ox, oy):
        super().__init__(gs)
        self.p, self.s, self.ox, self.oy = path, scale, ox, oy

    def _t(self, pt):
        return self.ox + pt[0] * self.s, self.oy + pt[1] * self.s

    def _moveTo(self, pt): self.p.moveTo(*self._t(pt))
    def _lineTo(self, pt): self.p.lineTo(*self._t(pt))
    def _curveToOne(self, a, b, c): self.p.curveTo(*self._t(a), *self._t(b), *self._t(c))
    def _closePath(self): self.p.close()


def wordmark_width(size):
    return WORDMARK_EM * size


def draw_wordmark(c, x, base_top, size, color):
    """Draw the 'BigBen' wordmark with its baseline at base_top (top-based)."""
    path = c.beginPath()
    ox, oy = x, PAGE_H - base_top
    for g in _WM_ORDER:
        _WM_GS[g].draw(_GlyphPen(_WM_GS, path, size / 1000.0, ox, oy))
        ox += _WM_ADV[g] * size / 1000.0
    c.setFillColor(cmyk(*color))
    c.drawPath(path, fill=1, stroke=0, fillMode=1)   # 1 = non-zero winding


# ---------------------------------------------------------------- text
def sw(text, font, size, track=0.0):
    return pdfmetrics.stringWidth(text, font, size) + track * len(text)


def text(c, x, base_top, s, font, size, color, track=0.0, align="left"):
    """Single line of text, baseline at base_top.  align = left|right|center."""
    w = sw(s, font, size, track)
    if align == "right":
        x -= w - (track if track else 0)
    elif align == "center":
        x -= (w - track) / 2.0
    t = c.beginText(x, PAGE_H - base_top)
    t.setFont(font, size)
    t.setFillColor(cmyk(*color))
    t.setCharSpace(track)          # always set: Tc persists across text objects
    t.textOut(s)
    c.drawText(t)
    return w


def _tokens(s):
    """Split a string into word tokens; '{BB}' is the wordmark token."""
    out = []
    for word in s.split(" "):
        out.append(word)
    return out


def _tok_w(tok, font, size):
    if tok.startswith("{BB}"):
        return wordmark_width(size) + sw(tok[4:], font, size)
    return sw(tok, font, size)


def wrap(s, font, size, width):
    lines, cur, cur_w = [], [], 0.0
    space = sw(" ", font, size)
    for tok in _tokens(s):
        w = _tok_w(tok, font, size)
        if cur and cur_w + space + w > width + 0.01:
            lines.append(cur)
            cur, cur_w = [tok], w
        else:
            cur_w = cur_w + (space if cur else 0) + w
            cur.append(tok)
    if cur:
        lines.append(cur)
    return lines


def paragraph(c, x, top, width, s, font, size, leading, color, wm_color=None,
              align="left", draw=True, bold_font=None):
    """Draw wrapped text.  `top` is the top of the first line box.  Returns the
    y (top-based) of the bottom of the last line box.  '{BB}' marks the wordmark."""
    lines = wrap(s, font, size, width)
    space = sw(" ", font, size)
    y = top
    for line in lines:
        base = y + size * 0.78 + (leading - size) / 2.0 + size * 0.0
        base = y + leading * 0.5 + size * 0.34   # optical vertical centring
        if draw:
            lw = sum(_tok_w(t, font, size) for t in line) + space * (len(line) - 1)
            cx = x
            if align == "center":
                cx = x + (width - lw) / 2.0
            elif align == "right":
                cx = x + width - lw
            for i, tok in enumerate(line):
                if tok.startswith("{BB}"):
                    draw_wordmark(c, cx, base, size, wm_color or color)
                    cx += wordmark_width(size)
                    rest = tok[4:]
                    if rest:
                        text(c, cx, base, rest, font, size, color)
                        cx += sw(rest, font, size)
                else:
                    text(c, cx, base, tok, font, size, color)
                    cx += sw(tok, font, size)
                cx += space
        y += leading
    return y


# ---------------------------------------------------------------- shapes
def rect(c, x, top, w, h, fill=None, stroke=None, lw=0.5, r=0, alpha=1.0):
    c.saveState()
    if fill is not None:
        c.setFillColor(cmyk(*fill, alpha=alpha))   # alpha must ride on the colour
    if stroke is not None:
        c.setStrokeColor(cmyk(*stroke))
        c.setLineWidth(lw)
    y = PAGE_H - top - h
    if r:
        c.roundRect(x, y, w, h, r, fill=1 if fill is not None else 0,
                    stroke=1 if stroke is not None else 0)
    else:
        c.rect(x, y, w, h, fill=1 if fill is not None else 0,
               stroke=1 if stroke is not None else 0)
    c.restoreState()


def circle(c, cx, cy_top, r, fill=None, stroke=None, lw=0.5):
    c.saveState()
    if fill is not None:
        c.setFillColor(cmyk(*fill))
    if stroke is not None:
        c.setStrokeColor(cmyk(*stroke))
        c.setLineWidth(lw)
    c.circle(cx, PAGE_H - cy_top, r, fill=1 if fill is not None else 0,
             stroke=1 if stroke is not None else 0)
    c.restoreState()


def rounded_clip(c, x, top, w, h, r):
    p = c.beginPath()
    p.roundRect(x, PAGE_H - top - h, w, h, r)
    c.clipPath(p, stroke=0, fill=0)


def draw_image_cover(c, path, x, top, w, h, r=0, focus=(0.5, 0.5)):
    """Draw an image to fill (x, top, w, h), cropping overflow ('object-fit: cover')."""
    from PIL import Image
    with Image.open(path) as im:
        iw, ih = im.size
    s = max(w / iw, h / ih)
    dw, dh = iw * s, ih * s
    ox = x - (dw - w) * focus[0]
    oy_top = top - (dh - h) * focus[1]
    c.saveState()
    if r:
        rounded_clip(c, x, top, w, h, r)
    else:
        p = c.beginPath()
        p.rect(x, PAGE_H - top - h, w, h)
        c.clipPath(p, stroke=0, fill=0)
    c.drawImage(path, ox, PAGE_H - oy_top - dh, dw, dh, mask=None)
    c.restoreState()


# ---------------------------------------------------------------- vector reuse
def load_vectors(pdf_path, page_index):
    """Return the page's vector paths in painting (z) order, in native PDF
    (bottom-up) coordinates."""
    import pdfplumber
    from pdfminer.layout import LTCurve, LTFigure
    pdf = pdfplumber.open(pdf_path)
    page = pdf.pages[page_index]
    items = []

    def walk(objs):
        for o in objs:
            if isinstance(o, LTCurve):          # LTRect / LTLine / LTCurve
                items.append(o)
            elif isinstance(o, LTFigure):
                walk(o)
    walk(page.layout)
    return items


def _rgb_ok(col):
    return col is not None and len(col) == 4


def draw_vectors(c, items, region, dx, dy_top, scale=1.0, exclude=None,
                 recolor=None, skip_bigger_than=None):
    """Re-draw the original vector paths that fall inside `region`.

    region  = (x0, top, x1, bottom) in ORIGINAL top-based coordinates
    dx/dy_top = where region's top-left corner lands on the new page (top-based)
    recolor = optional {orig_fill_tuple: new_fill_tuple} map
    """
    rx0, rtop, rx1, rbot = region
    tol = 0.6
    for o in items:
        ox0, ox1 = o.x0, o.x1
        otop, obot = PAGE_H - o.y1, PAGE_H - o.y0
        if not (ox0 >= rx0 - tol and ox1 <= rx1 + tol and otop >= rtop - tol and obot <= rbot + tol):
            continue
        if skip_bigger_than and (ox1 - ox0) > skip_bigger_than[0] and (obot - otop) > skip_bigger_than[1]:
            continue
        if exclude and exclude(o):
            continue
        fill = bool(o.fill)
        stroke = bool(o.stroke)
        if not fill and not stroke:
            continue
        c.saveState()
        p = c.beginPath()
        for seg in o.original_path:
            op = seg[0]
            if op == "m":
                p.moveTo(*_tx(seg[1], rx0, rtop, dx, dy_top, scale))
            elif op == "l":
                p.lineTo(*_tx(seg[1], rx0, rtop, dx, dy_top, scale))
            elif op == "c":
                p.curveTo(*_tx(seg[1], rx0, rtop, dx, dy_top, scale),
                          *_tx(seg[2], rx0, rtop, dx, dy_top, scale),
                          *_tx(seg[3], rx0, rtop, dx, dy_top, scale))
            elif op == "h":
                p.close()
        if fill:
            fc = tuple(round(v, 3) for v in o.non_stroking_color)
            if recolor and fc in recolor:
                fc = recolor[fc]
            c.setFillColor(cmyk(*fc))
        if stroke:
            sc = tuple(round(v, 3) for v in o.stroking_color)
            if recolor and sc in recolor:
                sc = recolor[sc]
            c.setStrokeColor(cmyk(*sc))
            c.setLineWidth(max(o.linewidth * scale, 0.05))
            if o.dashing_style and o.dashing_style[0]:
                c.setDash([d * scale for d in o.dashing_style[0]], o.dashing_style[1])
        c.drawPath(p, fill=1 if fill else 0, stroke=1 if stroke else 0,
                   fillMode=0 if o.evenodd else 1)
        c.restoreState()


def _tx(pt, rx0, rtop, dx, dy_top, scale):
    x, y_up = pt
    top = PAGE_H - y_up
    nx = dx + (x - rx0) * scale
    ntop = dy_top + (top - rtop) * scale
    return nx, PAGE_H - ntop

