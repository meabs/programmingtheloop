---
name: Programming the Loop
description: Evidence-led engineering for coding agents.
colors:
  midnight: "#0b1220"
  midnight-deep: "#080e19"
  slate: "#121d2c"
  slate-raised: "#172437"
  ivory: "#f4efe4"
  ivory-soft: "#c3c4c1"
  muted: "#9da9b7"
  subdued: "#77869a"
  rule: "#2b3a4d"
  rule-soft: "#1c2a3c"
  teal: "#64d9c8"
  teal-deep: "#0b766d"
  brass: "#d6b170"
  brass-soft: "#efcf92"
  violet: "#aaa0df"
  light-ground: "#f4f1e9"
  light-ground-deep: "#eae6dc"
  light-surface: "#fffdf7"
  light-ink: "#182338"
  light-muted: "#4f5f73"
  light-rule: "#c8c1b2"
  light-teal: "#087f73"
  light-brass: "#8e652b"
typography:
  display:
    fontFamily: "Manrope Variable, Helvetica Neue, sans-serif"
    fontSize: "clamp(48px, 5.6vw, 94px)"
    fontWeight: 580
    lineHeight: 0.99
    letterSpacing: "-0.064em"
  headline:
    fontFamily: "Newsreader Variable, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.7rem, 5.7vw, 4.4rem)"
    fontWeight: 450
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Manrope Variable, Helvetica Neue, sans-serif"
    fontSize: "clamp(34px, 4vw, 56px)"
    fontWeight: 560
    lineHeight: 1.08
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Manrope Variable, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.83
  label:
    fontFamily: "JetBrains Mono Variable, SFMono-Regular, Consolas, monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  fine: "2px"
  small: "3px"
  circular: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "#171a1d"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "47px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-soft}"
    rounded: "{rounded.none}"
    padding: "0 2px"
    height: "43px"
    typography: "{typography.label}"
  navigation-active:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "0"
    height: "100%"
    typography: "{typography.label}"
  evidence-panel:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.ivory-soft}"
    rounded: "{rounded.none}"
    padding: "18px 20px"
  research-record:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "16px 5px"
---

# Design System: Programming the Loop

## Overview

**Creative North Star: “The Research Observatory.”**

Programming the Loop presents coding-agent research with the calm precision of a field journal and the visual language of an engineering laboratory. Midnight navy and warm ivory establish the reading environment; brass carries editorial emphasis, while teal marks active systems, evidence links, and feedback paths. The orbital mark and loop diagram connect the site to the ebook's visual identity.

The composition is editorial rather than dashboard-like: generous headline scale, asymmetrical feature layouts, open data presentations, compact monospaced annotations, and fine rules that organize the page. Long-form lessons remain restrained and readable. Dark is the preferred appearance, with a coordinated paper-toned light theme.

**Key Characteristics:**
- Editorial type carries the hierarchy; interface ornament stays quiet.
- Research claims sit beside their conditions, limits, and evidence paths.
- Orbital geometry represents task, context, code, verification, and feedback.
- Brass marks editorial emphasis; teal marks active technical relationships.

## Colors

The palette pairs deep blue-black surfaces with warm ivory text, a measured brass accent, and a clear teal signal color. Light mode keeps the same roles on warm paper.

### Primary
- **Orbital Teal** (#64d9c8): Active feedback paths, evidence links, selected navigation, and technical states in dark mode.
- **Editorial Brass** (#d6b170): Headline emphasis, labels, chart values, and primary calls to action.

### Secondary
- **Quiet Violet** (#aaa0df): A restrained secondary accent available for distinct secondary categories; it is not used as a broad gradient.

### Neutral
- **Midnight Field** (#0b1220): Preferred page background.
- **Deep Midnight** (#080e19): Deeper bands and footer surfaces.
- **Slate Surface** (#121d2c): Raised evidence and documentation panels.
- **Raised Slate** (#172437): Higher contrast panel layer.
- **Warm Ivory** (#f4efe4): Primary text in dark mode.
- **Soft Ivory** (#c3c4c1): Supporting text in dark mode.
- **Muted Blue Grey** (#9da9b7): Secondary descriptions and captions.
- **Fine Rule** (#2b3a4d): Structural borders and separators.
- **Paper Ground** (#f4f1e9): Light theme page background.
- **Paper Surface** (#fffdf7): Light theme content surface.
- **Ink Navy** (#182338): Primary light-theme text.
- **Light Rule** (#c8c1b2): Light-theme borders.

### Named Rules
**The Signal Rule.** Teal identifies active technical information; brass identifies editorial emphasis. Keep both accents purposeful and distinct.

## Typography

**Display Font:** Manrope Variable (with Helvetica Neue, sans-serif fallback)  
**Body Font:** Manrope Variable (with Helvetica Neue, sans-serif fallback)  
**Editorial Font:** Newsreader Variable (with Iowan Old Style, Georgia, serif fallback)  
**Label/Mono Font:** JetBrains Mono Variable (with SFMono-Regular, Consolas, monospace fallback)

**Character:** Manrope gives the interface a precise contemporary voice. Newsreader adds a literary contrast for editorial phrases and long-form titles; JetBrains Mono carries compact experiment metadata without competing with the reading text.

### Hierarchy
- **Display** (weight 580, clamp(48px, 5.6vw, 94px), 0.99 line-height): Main homepage statement, with a restrained Newsreader phrase for contrast.
- **Headline** (weight 450, clamp(2.7rem, 5.7vw, 4.4rem), 1.02 line-height): Lesson and publication titles.
- **Title** (weight 560, clamp(34px, 4vw, 56px), 1.08 line-height): Major section headings.
- **Body** (weight 400, 15px, 1.83 line-height): Long-form technical reading, kept to a comfortable measure.
- **Label** (weight 400, 9px, 1.5 line-height, 0.08em tracking): Experiment IDs, section labels, chart metadata, and small technical annotations.

### Named Rules
**The Two Voices Rule.** Use the sans family for interface and body copy. Reserve the serif for selected editorial titles and emphasis, not for dense data labels.

## Layout

The main publication canvas is capped around 1,480px and centered, with a slightly wider masthead. Desktop pages use split editorial compositions and data rows; learning content narrows to a readable line length. At tablet widths, feature layouts stack and research grids simplify. At phone widths, navigation becomes a compact menu, evidence rows stack, and orbital artwork scales within the viewport. Section spacing is generous, while metadata and supporting labels stay compact.

## Elevation & Depth

Depth comes primarily from tonal layers, fine borders, and composition. Panels use adjacent navy or paper tones instead of dashboard-style floating cards. Shadows are limited to the mobile navigation popover and the ebook cover image; focus and hover are communicated with clear accent borders, color changes, and small translations.

### Shadow Vocabulary
- **Mobile menu:** `0 18px 40px #0004` separates the open navigation from page content.
- **Ebook cover:** `drop-shadow(12px 17px 19px #0007)` gives the source cover modest physical depth.

### Named Rules
**The Flat-By-Default Rule.** Use rules and tonal surfaces to organize the page; reserve shadows for overlays and the book artwork.

## Shapes

The form language is mostly square-cornered and architectural. Panels and calls to action use crisp edges; small badges may use a 2px radius, and orbit nodes alone use circular geometry. Borders are thin and low contrast. The orbital loops provide the identity's curved counterpoint to the rectangular page structure.

## Components

### Buttons
- **Shape:** Square corners (0px).
- **Primary:** Editorial brass fill, dark ink text, 47px minimum height, compact horizontal padding.
- **Hover / Focus:** Primary lifts by 2px and shifts to soft brass; keyboard focus uses a 2px teal outline with 4px offset.
- **Secondary:** Text-first, soft ivory, underlined by a fine rule; teal on hover.

### Cards / Containers
- **Corner Style:** Square by default; 2–3px only for small badges and pagination affordances.
- **Background:** Slate surface over midnight; white paper surface over the light ground.
- **Shadow Strategy:** Flat by default; see Elevation & Depth.
- **Border:** Fine rule in the palette, with teal reserved for active or hover states.
- **Internal Padding:** Common compact steps are 16px, 20px, and 24px; featured evidence panels use more room where needed.

### Navigation
- **Style:** Sticky, 78px desktop masthead with wordmark, centered section links, theme control, and ebook action. Active page is marked by a thin brass baseline; hover changes text and reveals the baseline.
- **Typography:** Small Manrope navigation labels; documentation sections use compact monospaced uppercase group headings.
- **Mobile:** 65px homepage masthead with a square disclosure menu; documentation uses Starlight's accessible sidebar control and grouped contents.

### Evidence Panels and Research Records
- **Evidence panels:** Use a slate-toned surface and a fine border. Put limitations close to the finding, separated by a rule.
- **Research records:** Use open rows divided by horizontal rules, status metadata, a prominent experiment identifier, concise summary, and a directional affordance.
- **Charts:** Use measured source data only. Teal identifies the comparison value; neutral grey identifies the baseline; labels and units remain visible.

### Feedback Loop Diagram
- **Signature:** Fine orbital paths connect task, context, code, verification, and the next attempt. Teal indicates the active path; brass marks context and verification. The center names the change under test.
- **Behavior:** Motion is subtle and disabled for reduced-motion preferences. Labels remain legible and the diagram has an explanatory caption.

## Do's and Don'ts

### Do:
- **Do** keep research conditions and limitations adjacent to measured claims.
- **Do** use a maximum content width near 1,480px for wide editorial surfaces and a readable measure for lessons.
- **Do** preserve the dark navy, warm ivory, brass, and teal roles across new pages.
- **Do** use Newsreader selectively to create editorial emphasis within the Manrope hierarchy.
- **Do** use thin rules, data labels, and orbital geometry to express research structure.
- **Do** honor reduced-motion preferences and keyboard focus visibility.

### Don't:
- **Don't** present experiment-specific observations as universal conclusions.
- **Don't** add decorative charts or unsupported metrics.
- **Don't** use generic blue-purple gradients, stock imagery, or repetitive dashboard-card grids.
- **Don't** use glow and shadow as the default way to create hierarchy.
