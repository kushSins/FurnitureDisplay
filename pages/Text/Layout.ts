import wordWrap from "word-wrapper";
var xtend = require("xtend");
var number = require("as-number");

var X_HEIGHTS = [
  "x",
  "e",
  "a",
  "o",
  "n",
  "s",
  "r",
  "c",
  "u",
  "m",
  "v",
  "w",
  "z",
];
var M_WIDTHS = ["m", "w"];
var CAP_HEIGHTS = [
  "H",
  "I",
  "N",
  "E",
  "F",
  "K",
  "L",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

var TAB_ID = "\t".charCodeAt(0);
var SPACE_ID = " ".charCodeAt(0);
var ALIGN_LEFT = 0,
  ALIGN_CENTER = 1,
  ALIGN_RIGHT = 2;

export default function createLayout(opt: any) {
  return new TextLayout(opt);
}

class TextLayout {
  glyphs: any;
  _measure: (
    text: any,
    start: any,
    end: any,
    width: any
  ) => { start: any; end: any; width: number };
  opt: any;
  width: any;
  height!: number;
  descender!: number;
  baseline: any;
  xHeight: any;
  capHeight: any;
  lineHeight: any;
  ascender!: number;
  linesTotal: any;
  fallbackSpaceGlyph!: null;
  fallbackTabGlyph!: null;
  constructor(opt: any) {
    this.glyphs = [];
    this._measure = this.computeMetrics.bind(this);
    this.update(opt);
  }
  update(opt: {
    font: any;
    text: string;
    width: number;
    lineHeight: any;
    letterSpacing: number;
  }) {
    opt = xtend(
      {
        measure: this._measure,
      },
      opt
    );
    this.opt = opt;
    this.opt.tabSize = number(this.opt.tabSize, 4);

    if (!opt.font) throw new Error("must provide a valid bitmap font");

    var glyphs: {
      position: any;
      data: any;
      index: any;
      line: any;
      length: any;
      push: any;
    } = this.glyphs;
    var text = opt.text || "";
    var font = opt.font;
    this._setupSpaceGlyphs(font);

    var lines = wordWrap.lines(text, opt);
    var minWidth = opt.width || 0;

    //clear glyphs
    glyphs.length = 0;

    //get max line width
    var maxLineWidth = lines.reduce(function (
      prev: number,
      line: { width: number }
    ) {
      return Math.max(prev, line.width, minWidth);
    },
    0);

    //the pen position
    var x = 0;
    var y = 0;

    var lineHeight = number(opt.lineHeight, font.common.lineHeight as any);
    var baseline = font.common.base;
    var descender = lineHeight - baseline;
    var letterSpacing = opt.letterSpacing || 0;
    var height = lineHeight * lines.length - descender;
    var align = getAlignType(this.opt.align);

    //draw text along baseline
    y -= height;

    //the metrics for this text layout
    this.width = maxLineWidth;
    this.height = height;
    this.descender = lineHeight - baseline;
    this.baseline = baseline;
    this.xHeight = getXHeight(font);
    this.capHeight = getCapHeight(font);
    this.lineHeight = lineHeight;
    this.ascender = lineHeight - descender - this.xHeight;

    //layout each glyph
    var self = this;
    lines.forEach(function (
      line: { start: any; end: any; width: any },
      lineIndex: any
    ) {
      var start = line.start;
      var end = line.end;
      var lineWidth = line.width;
      var lastGlyph: any;

      //for each glyph in that line...
      for (var i = start; i < end; i++) {
        var id = text.charCodeAt(i);
        var glyph = self.getGlyph(font, id);
        if (glyph) {
          if (lastGlyph) x += getKerning(font, lastGlyph.id, glyph.id);

          var tx = x;
          if (align === ALIGN_CENTER) tx += (maxLineWidth - lineWidth) / 2;
          else if (align === ALIGN_RIGHT) tx += maxLineWidth - lineWidth;

          glyphs.push({
            position: [tx, y],
            data: glyph,
            index: i,
            line: lineIndex,
          });

          //move pen forward
          x += glyph.xadvance + letterSpacing;
          lastGlyph = glyph;
        }
      }

      //next line down
      y += lineHeight;
      x = 0;
    });
    this.linesTotal = lines.length;
  }
  _setupSpaceGlyphs(font: { chars: string | any[] }) {
    //These are fallbacks, when the font doesn't include
    //' ' or '\t' glyphs
    this.fallbackSpaceGlyph = null;
    this.fallbackTabGlyph = null;

    if (!font.chars || font.chars.length === 0) return;

    //try to get space glyph
    //then fall back to the 'm' or 'w' glyphs
    //then fall back to the first glyph available
    var space =
      getGlyphById(font, SPACE_ID) || getMGlyph(font) || font.chars[0];

    //and create a fallback for tab
    var tabWidth = this.opt.tabSize * space.xadvance;
    this.fallbackSpaceGlyph = space;
    this.fallbackTabGlyph = xtend(space, {
      x: 0,
      y: 0,
      xadvance: tabWidth,
      id: TAB_ID,
      xoffset: 0,
      yoffset: 0,
      width: 0,
      height: 0,
    });
  }
  getGlyph(font: any, id: number) {
    var glyph = getGlyphById(font, id);
    if (glyph) return glyph;
    else if (id === TAB_ID) return this.fallbackTabGlyph;
    else if (id === SPACE_ID) return this.fallbackSpaceGlyph;
    return null;
  }
  computeMetrics(text: string, start: number, end: number, width: number) {
    var letterSpacing = this.opt.letterSpacing || 0;
    var font = this.opt.font;
    var curPen = 0;
    var curWidth = 0;
    var count = 0;
    var glyph: { xoffset: any; id: any; xadvance: number; width: number };
    var lastGlyph: any;

    if (!font.chars || font.chars.length === 0) {
      return {
        start: start,
        end: start,
        width: 0,
      };
    }

    end = Math.min(text.length, end);
    for (var i = start; i < end; i++) {
      var id = text.charCodeAt(i);
      var glyphh = this.getGlyph(font, id);

      if (glyphh) {
        //move pen forward
        var xoff = glyphh.xoffset;
        var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyphh.id) : 0;
        curPen += kern;

        var nextPen = curPen + glyphh.xadvance + letterSpacing;
        var nextWidth = curPen + glyphh.width;

        //we've hit our limit; we can't move onto the next glyph
        if (nextWidth >= width || nextPen >= width) break;

        //otherwise continue along our line
        curPen = nextPen;
        curWidth = nextWidth;
        lastGlyph = glyphh;
      }
      count++;
    }

    //make sure rightmost edge lines up with rendered glyphs
    if (lastGlyph) curWidth += lastGlyph.xoffset;

    return {
      start: start,
      end: start + count,
      width: curWidth,
    };
  }
}

[
  "width",
  "height",
  "descender",
  "ascender",
  "xHeight",
  "baseline",
  "capHeight",
  "lineHeight",
].forEach(addGetter);

function addGetter(name: string) {
  Object.defineProperty(TextLayout.prototype, name, {
    get: wrapper(name),
    configurable: true,
  });
}

//create lookups for private vars
function wrapper(name: string) {
  return new Function(
    ["return function " + name + "() {", "  return this._" + name, "}"].join(
      "\n"
    )
  )();
}

function getGlyphById(font: { chars: any }, id: number) {
  if (!font.chars || font.chars.length === 0) return null;

  var glyphIdx = findChar(font.chars, id, undefined);
  if (glyphIdx >= 0) return font.chars[glyphIdx];
  return null;
}

function getXHeight(font: { chars: any }) {
  for (var i = 0; i < X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0);
    var idx = findChar(font.chars, id, undefined);
    if (idx >= 0) return font.chars[idx].height;
  }
  return 0;
}

function getMGlyph(font: { chars: any }) {
  for (var i = 0; i < M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0);
    var idx = findChar(font.chars, id, undefined);
    if (idx >= 0) return font.chars[idx];
  }
  return 0;
}

function getCapHeight(font: { chars: any }) {
  for (var i = 0; i < CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0);
    var idx = findChar(font.chars, id, undefined);
    if (idx >= 0) return font.chars[idx].height;
  }
  return 0;
}

function getKerning(font: { kernings: string | any[] }, left: any, right: any) {
  if (!font.kernings || font.kernings.length === 0) return 0;

  var table = font.kernings;
  for (var i = 0; i < table.length; i++) {
    var kern = table[i];
    if (kern.first === left && kern.second === right) return kern.amount;
  }
  return 0;
}

function getAlignType(align: string) {
  if (align === "center") return ALIGN_CENTER;
  else if (align === "right") return ALIGN_RIGHT;
  return ALIGN_LEFT;
}

function findChar(array: any[], value: number, start: number | undefined) {
  start = start || 0;
  for (var i = start; i < array.length; i++) {
    if (array[i].id === value) {
      return i;
    }
  }
  return -1;
}
