# UX4G System Design Documentation

## 1. Executive Summary

This document captures the system design, asset architecture, integration model, dependencies, component scope, and implementation guidance for the uploaded `UX4G.zip` package.

The ZIP contains a frontend UX/design-system bundle for **UX4G v2.0.8**. It is not a full-stack application and does not include backend code, APIs, database schemas, authentication services, deployment manifests, or application routes. The package is a reusable UI layer composed of CSS, JavaScript, charting, date/time, and map assets.

**Product/technical positioning:** UX4G is delivered as a static frontend design-system bundle that can be integrated into websites, portals, dashboards, admin panels, and government/public-service web applications. It provides styling primitives, responsive layout utilities, form components, navigation patterns, interactive plugins, chart examples, date-range support, and India map data.

---

## 2. Source Package Overview

### 2.1 Package Metadata

| Attribute | Value |
|---|---|
| Package name | `UX4G.zip` |
| Framework/library version mentioned in files | `UX4G v2.0.8` |
| Documentation URL mentioned | `https://doc.ux4g.gov.in` |
| Copyright | UX4G Authors, NeGD, MeitY |
| License | MIT |
| Primary asset type | Static frontend UI bundle |
| Main technology areas | CSS design system, JavaScript UI behavior, Chart.js, date/time picker, India map data, responsive utilities |

### 2.2 Folder Structure

```text
UX4G.zip
├── css/
│   ├── ux4g.css
│   ├── ux4g-min.css
│   ├── ux4g.rtl.css
│   ├── ux4g.rtl.min.css
│   ├── ux4g-grid.css
│   ├── ux4g-grid.min.css
│   ├── ux4g-grid.rtl.css
│   ├── ux4g-grid.rtl.min.css
│   ├── ux4g-reboot.css
│   ├── ux4g-reboot.min.css
│   ├── ux4g-reboot.rtl.css
│   ├── ux4g-reboot.rtl.min.css
│   ├── ux4g-utilities.css
│   ├── ux4g-utilities.min.css
│   ├── ux4g-utilities.rtl.css
│   ├── ux4g-utilities.rtl.min.css
│   └── ux4g-date-time.css
├── js/
│   ├── ux4g.js
│   ├── ux4g.min.js
│   ├── ux4g.bundle.js
│   ├── ux4g.bundle.min.js
│   ├── ux4g.esm.js
│   ├── ux4g.esm.min.js
│   ├── ux4g-main.js
│   ├── ux4g-chart.js
│   ├── ux4g-chart-script.js
│   ├── ux4g-date-time-1.js
│   ├── ux4g-date-time-2.js
│   ├── ux4g-map.js
│   └── ux4g-map-all.js
└── fonts/
    └── NotoSans-Regular.ttf
```

---

## 3. Asset Inventory

### 3.1 CSS Assets

| File | Approx. Size | Purpose |
|---|---:|---|
| `css/ux4g.css` | 349 KB | Primary readable UX4G stylesheet. Contains core variables, typography, reset/reboot styles, layout, components, utilities, responsive rules, and theme classes. |
| `css/ux4g-min.css` | 270 KB | Minified/production-oriented stylesheet. |
| `css/ux4g.rtl.css` | 207 KB | Right-to-left stylesheet for RTL language support. |
| `css/ux4g.rtl.min.css` | 170 KB | Minified RTL stylesheet. |
| `css/ux4g-grid.css` | 76 KB | Grid-only layout system. |
| `css/ux4g-grid.min.css` | 51 KB | Minified grid-only stylesheet. |
| `css/ux4g-grid.rtl.css` | 76 KB | RTL grid-only stylesheet. |
| `css/ux4g-grid.rtl.min.css` | 51 KB | Minified RTL grid stylesheet. |
| `css/ux4g-reboot.css` | 6 KB | Reboot/reset stylesheet for browser normalization. |
| `css/ux4g-reboot.min.css` | 4 KB | Minified reboot stylesheet. |
| `css/ux4g-reboot.rtl.css` | 6 KB | RTL reboot stylesheet. |
| `css/ux4g-reboot.rtl.min.css` | 4 KB | Minified RTL reboot stylesheet. |
| `css/ux4g-utilities.css` | 74 KB | Utility classes for spacing, display, flex, text, alignment, colors, etc. |
| `css/ux4g-utilities.min.css` | 56 KB | Minified utilities stylesheet. |
| `css/ux4g-utilities.rtl.css` | 73 KB | RTL utilities stylesheet. |
| `css/ux4g-utilities.rtl.min.css` | 56 KB | Minified RTL utilities stylesheet. |
| `css/ux4g-date-time.css` | 9 KB | Date/time picker styling, calendar layout, ranges, active states, and picker-specific UI. |

### 3.2 JavaScript Assets

| File | Approx. Size | Purpose |
|---|---:|---|
| `js/ux4g.js` | 147 KB | Main UX4G JavaScript library, readable build. Similar in role to Bootstrap-style component JavaScript. |
| `js/ux4g.min.js` | 60 KB | Minified UX4G JavaScript for production. |
| `js/ux4g.bundle.js` | 208 KB | Bundled UX4G JavaScript build, likely includes required internal dependencies such as positioning utilities. |
| `js/ux4g.bundle.min.js` | 79 KB | Minified bundled build for production. |
| `js/ux4g.esm.js` | 134 KB | ES module build for modern bundlers/import-based usage. |
| `js/ux4g.esm.min.js` | 74 KB | Minified ES module build. |
| `js/ux4g-main.js` | 7 KB | Site/demo interaction script using jQuery plugins such as meanmenu, slick slider, scrollUp, WOW, and isotope-related hooks. |
| `js/ux4g-chart.js` | 206 KB | Chart.js-compatible charting library build exposed as `Chart`. |
| `js/ux4g-chart-script.js` | 15 KB | Example/demo chart initialization file. Creates bar, line, pie, polar area, radar, scatter, mixed, event, and bubble charts. |
| `js/ux4g-date-time-1.js` | 51 KB | Moment.js-style date/time utility library exposed as `moment`. |
| `js/ux4g-date-time-2.js` | 33 KB | Date range picker plugin built on jQuery + Moment. |
| `js/ux4g-map.js` | 351 KB | Highcharts/Highmaps-style map engine or map runtime. |
| `js/ux4g-map-all.js` | 52 KB | India map GeoJSON/feature data registered under `UX4Gmap.maps["countries/in/in-all"]`. |

### 3.3 Font Assets

| File | Approx. Size | Purpose |
|---|---:|---|
| `fonts/NotoSans-Regular.ttf` | 2 MB | Noto Sans regular font used by the UX4G design system. |

The main stylesheet defines `@font-face` for `Noto Sans` and attempts to load `.woff2`, `.woff`, and `.ttf` formats from the `fonts/` folder. The ZIP only contains the `.ttf` file, so the browser will fall back to the TTF source unless WOFF/WOFF2 files are added later.

---

## 4. High-Level System Architecture

```text
Application / Portal HTML
        |
        | includes
        v
UX4G CSS Layer
- ux4g.css or ux4g-min.css
- ux4g-grid.css when only layout is required
- ux4g-utilities.css when only utility classes are required
- ux4g-date-time.css for date picker UI
- RTL CSS variants for right-to-left language layouts
        |
        | includes
        v
UX4G JavaScript Layer
- ux4g.bundle.min.js or ux4g.min.js
- ux4g-main.js for demo/site interactions
- ux4g-chart.js + ux4g-chart-script.js for dashboards/charts
- ux4g-date-time-1.js + ux4g-date-time-2.js for date range interactions
- ux4g-map.js + ux4g-map-all.js for India map visualizations
        |
        | renders/enhances
        v
User Interface
- Responsive pages
- Forms
- Navigation
- Tables
- Alerts
- Modals
- Accordions
- Cards
- Dashboards
- Charts
- Maps
- Date range pickers
```

### 4.1 Runtime Model

UX4G is a **client-side static asset bundle**. It does not require a server-side runtime by itself. Any backend application can consume it by serving the CSS, JS, and font files and linking them in HTML templates.

Typical consuming platforms:

- Static HTML website
- Government portal/CMS
- React/Angular/Vue frontend using global assets
- Server-rendered app such as Java, PHP, Node.js, Python, .NET, or Ruby
- Admin dashboard/reporting system
- Data visualization portal

---

## 5. Recommended Integration Architecture

### 5.1 Production Include Strategy

Use minified production assets for live environments:

```html
<link rel="stylesheet" href="/css/ux4g-min.css">
<script src="/js/ux4g.bundle.min.js"></script>
```

Use readable assets in development/debugging:

```html
<link rel="stylesheet" href="/css/ux4g.css">
<script src="/js/ux4g.bundle.js"></script>
```

### 5.2 Modular Include Strategy

Use modular files only when the application needs a subset:

| Need | CSS | JS |
|---|---|---|
| Full UX4G design system | `ux4g-min.css` | `ux4g.bundle.min.js` |
| Only grid/layout | `ux4g-grid.min.css` | Not required |
| Only utility classes | `ux4g-utilities.min.css` | Not required |
| Browser reset/reboot | `ux4g-reboot.min.css` | Not required |
| Date range picker | `ux4g-date-time.css` | `ux4g-date-time-1.js`, `ux4g-date-time-2.js` |
| Charts | Existing UX4G CSS or custom page CSS | `ux4g-chart.js`, chart initialization script |
| India map | Existing UX4G CSS or custom page CSS | `ux4g-map.js`, `ux4g-map-all.js` |
| RTL language support | RTL CSS variant | Same JS as LTR |

### 5.3 Suggested Asset Loading Order

```html
<!-- 1. Font/CSS -->
<link rel="stylesheet" href="/css/ux4g-min.css">

<!-- Optional: date picker CSS -->
<link rel="stylesheet" href="/css/ux4g-date-time.css">

<!-- 2. Core JS dependencies, if used by the page -->
<script src="/path/to/jquery.min.js"></script>

<!-- 3. UX4G core JS -->
<script src="/js/ux4g.bundle.min.js"></script>

<!-- 4. Optional modules -->
<script src="/js/ux4g-date-time-1.js"></script>
<script src="/js/ux4g-date-time-2.js"></script>
<script src="/js/ux4g-chart.js"></script>
<script src="/js/ux4g-map.js"></script>
<script src="/js/ux4g-map-all.js"></script>

<!-- 5. Page-specific initialization -->
<script src="/js/ux4g-main.js"></script>
<script src="/js/ux4g-chart-script.js"></script>
```

Important: `ux4g-main.js` uses jQuery syntax and external plugins. It should only be loaded when those plugins are available or after removing unused blocks.

---

## 6. CSS Design System Architecture

### 6.1 Design Token Layer

The core stylesheet defines UX4G/Bootstrap-style CSS variables under `:root`.

Key tokens include:

| Token Group | Examples |
|---|---|
| Brand colors | `--bs-primary: #613AF5`, `--bs-link-color: #613AF5`, `--bs-link-hover-color: #774BFF` |
| Semantic colors | `--bs-success`, `--bs-info`, `--bs-warning`, `--bs-danger` |
| Neutral scale | `--bs-gray-50` through `--bs-gray-900` |
| RGB values | `--bs-primary-rgb`, `--bs-secondary-rgb`, etc. |
| Typography | `--bs-font-sans-serif`, `--bs-body-font-family`, `--bs-body-font-size` |
| Layout/base | `--bs-body-bg`, `--bs-body-color`, `--bs-body-line-height` |
| Borders | `--bs-border-width`, `--bs-border-style`, `--bs-border-radius`, `--bs-border-radius-pill` |

### 6.2 Typography

Primary typography is based on **Noto Sans**:

```css
@font-face {
  font-family: 'Noto Sans';
  src: url('../fonts/NotoSans-Regular.woff2') format('woff2'),
       url('../fonts/NotoSans-Regular.woff') format('woff'),
       url('../fonts/NotoSans-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

The body font stack uses:

```text
'Noto Sans', system-ui, -apple-system, 'Segoe UI', 'Noto', 'Helvetica', 'Arial', sans-serif
```

### 6.3 Color System

The design system includes:

- Primary color scale from `50` to `900`
- Background utility classes such as `bg-primary-900`, `bg-primary-800`, etc.
- Text utility classes such as `text-primary-900`, `text-primary-800`, etc.
- Semantic classes for success, info, warning, danger, light, and dark states
- RGB variables for opacity-based utilities

Core brand palette:

| Role | Color |
|---|---|
| Primary | `#613AF5` |
| Primary hover/link hover | `#774BFF` |
| Secondary | `#938BB6` |
| Success | `#3C9718` |
| Info | `#00AAFF` |
| Warning | `#B77224` |
| Danger | `#B7131A` |
| Dark | `#212121` |
| White | `#FFFFFF` |

### 6.4 Layout System

The package includes a Bootstrap-style responsive grid system:

- `.container`
- `.container-fluid`
- `.row`
- `.col-*`
- responsive breakpoints for `sm`, `md`, `lg`, `xl`, and `xxl`
- grid-only CSS available separately via `ux4g-grid.css`
- RTL-compatible grid variants

### 6.5 Utility System

The utilities layer supports common layout and formatting needs:

- Display utilities: `d-*`
- Flex utilities: `flex-*`, `justify-content-*`, `align-items-*`, `align-self-*`
- Spacing utilities: `m-*`, `mt-*`, `mb-*`, `p-*`, `px-*`, `py-*`
- Gap utilities: `gap-*`
- Float utilities: `float-*`
- Text alignment: `text-start`, `text-end`, `text-center`
- Responsive variants: `*-sm-*`, `*-md-*`, `*-lg-*`, `*-xl-*`, `*-xxl-*`
- Print display utilities: `d-print-*`

### 6.6 Component Layer

The main CSS includes styling for a broad Bootstrap-compatible component set, including:

| Component | Description |
|---|---|
| Buttons | Standard button variants, focus states, disabled states, button groups/check buttons. |
| Forms | Inputs, textarea, file input, color input, floating labels, checks, radios, switches, validation states. |
| Input groups | Grouped controls with buttons, prefixes, suffixes. |
| Tables | Base tables, striped tables, bordered tables, hover states, responsive tables, semantic table variants. |
| Cards | Content containers for dashboards and page layouts. |
| Alerts | Status messaging and feedback blocks. |
| Badges | Inline status labels and counters. |
| Breadcrumbs | Hierarchical navigation paths. |
| Pagination | Page navigation components. |
| Navs and tabs | Navigation groups and tabbed UI patterns. |
| Navbar | Responsive header/navigation patterns. |
| Dropdowns | Toggleable action/menu lists. |
| Accordions | Collapsible content sections. |
| Modals | Dialog overlays. |
| Offcanvas | Side panels and drawer-style UI. |
| Carousel | Rotating content/slides. |
| Tooltips/popovers | Contextual overlays. |
| Toasts | Lightweight notification components. |
| Spinners/progress | Loading and progress indicators. |

---

## 7. JavaScript Architecture

### 7.1 UX4G Core JavaScript Builds

The package provides multiple builds for different environments:

| Build | Use Case |
|---|---|
| `ux4g.js` | Development/debug build for browser globals. |
| `ux4g.min.js` | Production browser global build. |
| `ux4g.bundle.js` | Development bundle with bundled dependency/runtime behavior. |
| `ux4g.bundle.min.js` | Recommended production browser bundle. |
| `ux4g.esm.js` | ES module build for bundlers and modern build pipelines. |
| `ux4g.esm.min.js` | Minified ES module build. |

### 7.2 Site Interaction Script: `ux4g-main.js`

This script initializes interactive behavior for demo/website pages.

Key behavior:

| Feature | Implementation Detail |
|---|---|
| Mobile menu | Initializes `#mobile-menu` using `meanmenu`, renders into `.mobile-menu`, breakpoint `992px`. |
| Data background images | Reads `data-background` attributes and applies them as CSS background images. |
| Pricing/card hover | Adds `.active` to `.chose-box` on mouse enter and removes active state from siblings. |
| Slider | Initializes `.slider-active` with Slick slider. Uses fade transition, no arrows, no dots, autoplay disabled. |
| Slider animations | Reads `data-animation` and `data-delay` from slide elements and applies animation classes. |
| Portfolio filtering | Listens to `.portfolio-menu button` and applies `data-filter` to an isotope grid variable. |
| Active filter state | Toggles `.active` class on selected portfolio menu buttons. |
| Scroll to top | Uses `$.scrollUp()` with element ID `scrollUp`, top distance `300`, fade animation. |
| WOW animations | Initializes `new WOW().init()`. |

External dependencies implied by this file:

- jQuery
- jQuery MeanMenu
- Slick Slider
- scrollUp
- WOW.js
- Isotope/imagesLoaded if portfolio filtering is enabled
- CSS animation classes compatible with the `animated` class pattern

Several blocks in this file are commented out, including:

- one-page nav
- sticky header scroll behavior
- testimonial sliders
- Owl Carousel screenshot carousel
- Magnific Popup image/video viewer
- Isotope grid initialization

These commented blocks indicate optional site features but are not active in the current file.

---

## 8. Charting Architecture

### 8.1 Chart Library

`ux4g-chart.js` exposes a Chart.js-compatible global named `Chart`. The file includes chart controllers, scales, animation logic, legends, titles, tooltips, plugins, and color utilities.

Use it when creating dashboard/reporting pages.

### 8.2 Chart Example Script

`ux4g-chart-script.js` creates example chart instances against canvas elements.

Expected canvas IDs:

| Canvas ID | Chart Type |
|---|---|
| `myChart` | Bar chart |
| `myLineChart` | Line chart |
| `myPieChart` | Pie chart |
| `myPolarAreaChart` | Polar area chart |
| `myRadarChart` | Radar chart |
| `myScatterChart` | Scatter chart |
| `myMultitypeChart` | Mixed bar + line chart |
| `myEventsChart` | Event/line chart |
| `myBubbleChart` | Bubble chart |

### 8.3 Chart Integration Pattern

```html
<canvas id="myChart"></canvas>
<script src="/js/ux4g-chart.js"></script>
<script>
  const ctx = document.getElementById('myChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March'],
      datasets: [{
        label: 'Dataset',
        data: [12, 19, 3]
      }]
    }
  });
</script>
```

### 8.4 Dashboard System Design Implication

For analytical products, UX4G can support:

- KPI dashboards
- Report cards
- Month-wise trend charts
- Event-based line charts
- Category split charts
- Scatter/bubble analytics
- Mixed bar-line performance charts

Recommended production approach:

- Keep `ux4g-chart.js` as the chart runtime.
- Replace `ux4g-chart-script.js` demo data with API-driven data.
- Create one chart-init file per dashboard/module.
- Validate canvas existence before initializing charts to avoid runtime errors on pages where a canvas is absent.

---

## 9. Date and Time Picker Architecture

### 9.1 Date Utility Layer

`ux4g-date-time-1.js` is a Moment.js-style date/time library. It provides date parsing, formatting, validation, locale handling, date arithmetic, and time calculations.

### 9.2 Date Range Picker Layer

`ux4g-date-time-2.js` provides a jQuery date range picker plugin. It depends on:

- jQuery
- Moment/date utility from `ux4g-date-time-1.js`
- `ux4g-date-time.css`

Capabilities visible in the bundled plugin include:

- single date picker
- date range picker
- custom ranges
- linked calendars
- left/right calendars
- time picker support
- 12-hour/24-hour handling
- seconds support
- min/max date constraints
- auto apply
- apply/cancel actions
- keyboard handling for Tab, Enter, and Escape
- event triggers such as show, hide, apply, cancel, outside click, show calendar, hide calendar

### 9.3 Date Picker Integration Pattern

```html
<input type="text" id="dateRange" class="form-control">

<link rel="stylesheet" href="/css/ux4g-date-time.css">
<script src="/path/to/jquery.min.js"></script>
<script src="/js/ux4g-date-time-1.js"></script>
<script src="/js/ux4g-date-time-2.js"></script>
<script>
  $('#dateRange').daterangepicker({
    autoUpdateInput: true,
    locale: {
      format: 'YYYY-MM-DD'
    }
  });
</script>
```

### 9.4 UX Use Cases

- Report date filters
- Dashboard time windows
- MIS export filters
- SLA monitoring periods
- User activity date ranges
- Appointment/date selection workflows
- Admin audit log filters

---

## 10. Map Architecture

### 10.1 Map Runtime

`ux4g-map.js` is the map runtime layer. It appears aligned with Highcharts/Highmaps-style map rendering based on the `UX4Gmap` namespace used in the map data file.

### 10.2 India Map Data

`ux4g-map-all.js` registers India map data under:

```js
UX4Gmap.maps["countries/in/in-all"]
```

The registered object is a GeoJSON-like `FeatureCollection` with:

- title: `India`
- version: `2.3.0`
- map type: `FeatureCollection`
- copyright: Highsoft AS / Natural Earth
- coordinate reference metadata
- `hc-transform` projection configuration
- state/UT features with properties and polygon/multipolygon geometry

Feature properties include fields such as:

- `hc-key`
- `hc-a2`
- `hasc`
- `postal-code`
- `name`
- `country`
- `type-en`
- `region`
- `longitude`
- `latitude`
- `woe-name`
- `woe-label`
- `type`

States/UT examples visible in the data include Puducherry, Lakshadweep, West Bengal, Orissa/Odisha, Bihar, Sikkim, Chhattisgarh, Punjab, Rajasthan, Uttar Pradesh, Uttaranchal/Uttarakhand, and Jharkhand. The file contains India administrative boundary geometry intended for thematic map visualizations.

### 10.3 Map Use Cases

- India state-wise dashboards
- Geographic KPI heatmaps
- Scheme/program monitoring by region
- District/state reporting views, if extended with more granular data
- Public portal visualizations
- Operational monitoring dashboards

### 10.4 Map Integration Pattern

```html
<div id="indiaMap"></div>
<script src="/js/ux4g-map.js"></script>
<script src="/js/ux4g-map-all.js"></script>
<script>
  // Initialize the map using the UX4Gmap/Highmaps-compatible API.
  // Bind data using hc-key or state/UT name, depending on the runtime API.
</script>
```

Implementation note: the ZIP contains the runtime and map data, but not a dedicated example initialization script for map rendering. The consuming app must create the actual map instance and bind metrics to the registered map key.

---

## 11. RTL and Multilingual Support

The package includes RTL variants for core CSS, grid, reboot, and utilities. This enables support for right-to-left language layouts.

Available RTL files:

- `ux4g.rtl.css`
- `ux4g.rtl.min.css`
- `ux4g-grid.rtl.css`
- `ux4g-grid.rtl.min.css`
- `ux4g-reboot.rtl.css`
- `ux4g-reboot.rtl.min.css`
- `ux4g-utilities.rtl.css`
- `ux4g-utilities.rtl.min.css`

### Recommended RTL Loading Pattern

```html
<html lang="ar" dir="rtl">
<head>
  <link rel="stylesheet" href="/css/ux4g.rtl.min.css">
</head>
```

For Indian multilingual products, RTL may be less frequently required than LTR, but keeping RTL variants supports broader language extensibility.

---

## 12. Accessibility and Inclusive Design Considerations

The bundle includes a Bootstrap-compatible component model, but accessibility quality depends on implementation markup.

Recommended implementation checklist:

| Area | Recommendation |
|---|---|
| Buttons | Use semantic `<button>` elements for actions. Avoid clickable `<div>` patterns. |
| Forms | Add visible labels or accessible labels for every input. |
| Validation | Pair visual errors with text and `aria-describedby`. |
| Modals | Ensure focus trapping, `aria-modal`, title references, and keyboard close behavior. |
| Dropdowns | Use keyboard-accessible toggles and menus. |
| Charts | Provide text summaries and data tables for screen readers. |
| Maps | Do not rely only on color. Provide tabular equivalents for map data. |
| Color contrast | Validate custom theme colors against WCAG contrast requirements. |
| Motion | Provide reduced-motion alternatives where animations are used. |
| Date picker | Ensure keyboard operability and readable focus states. |

---

## 13. Performance Architecture

### 13.1 Production Optimization

Use minified files in production:

- `ux4g-min.css`
- `ux4g.bundle.min.js`
- `ux4g-chart.js` only on chart pages
- `ux4g-map.js` and `ux4g-map-all.js` only on map pages
- `ux4g-date-time-*.js` only on date-filter pages

### 13.2 Avoid Unnecessary Payload

The full asset set is large because it includes:

- full CSS framework
- RTL versions
- grid and utility standalone versions
- chart runtime
- map runtime
- India GeoJSON-like map data
- Moment/date libraries
- font file

Do not load every file on every page.

### 13.3 Suggested Page-Level Loading

| Page Type | Recommended Assets |
|---|---|
| Marketing/content page | `ux4g-min.css`, `ux4g.bundle.min.js`, optionally `ux4g-main.js` |
| Form-heavy admin page | `ux4g-min.css`, `ux4g.bundle.min.js`, date picker files only if needed |
| Dashboard page | `ux4g-min.css`, `ux4g.bundle.min.js`, `ux4g-chart.js`, dashboard-specific chart init |
| Geo dashboard page | `ux4g-min.css`, `ux4g.bundle.min.js`, `ux4g-map.js`, `ux4g-map-all.js` |
| Static layout-only page | `ux4g-grid.min.css` or `ux4g-utilities.min.css` only |

### 13.4 Caching Strategy

Serve assets with long-lived cache headers and versioned filenames or paths:

```text
Cache-Control: public, max-age=31536000, immutable
```

Recommended deployment path:

```text
/assets/ux4g/2.0.8/css/ux4g-min.css
/assets/ux4g/2.0.8/js/ux4g.bundle.min.js
/assets/ux4g/2.0.8/fonts/NotoSans-Regular.ttf
```

---

## 14. Security Considerations

Since this is a static frontend package, security risks are mostly integration-level risks.

| Risk | Mitigation |
|---|---|
| Supply-chain tampering | Store assets in a controlled repository/CDN and checksum releases. |
| Cross-site scripting through dynamic HTML | Sanitize application data before injecting into DOM, charts, tooltips, popovers, or map labels. |
| Third-party plugin vulnerabilities | Maintain versions for jQuery, Slick, MeanMenu, WOW, Isotope, and any other dependencies. |
| CDN dependency failure | Self-host critical assets where possible. |
| CSP violations | Define an explicit Content Security Policy and avoid inline scripts where feasible. |
| Chart/map tooltip injection | Escape labels and values before rendering. |
| Font loading privacy | Self-host fonts instead of relying on external font CDNs. |

---

## 15. Dependency Matrix

| Module/File | Dependency | Required? | Notes |
|---|---|---:|---|
| `ux4g.css` | Font files | Recommended | Uses Noto Sans from `../fonts/`. |
| `ux4g.bundle.min.js` | Browser DOM | Yes | Main UI JavaScript runtime. |
| `ux4g-main.js` | jQuery | Yes | Uses `$(...)` extensively. |
| `ux4g-main.js` | MeanMenu | For mobile menu | Required if `#mobile-menu` is used. |
| `ux4g-main.js` | Slick Slider | For `.slider-active` | Required if slider code is active. |
| `ux4g-main.js` | scrollUp | For scroll-to-top | Required because `$.scrollUp()` is called. |
| `ux4g-main.js` | WOW.js | For scroll animations | Required because `new WOW().init()` is called. |
| `ux4g-main.js` | Isotope | For portfolio filtering | Current code references `$grid`; initialization is commented, so this may break unless restored. |
| `ux4g-chart-script.js` | `ux4g-chart.js` / `Chart` | Yes | Demo script assumes `Chart` exists. |
| `ux4g-date-time-2.js` | jQuery + Moment | Yes | Date range picker plugin. |
| `ux4g-map-all.js` | `ux4g-map.js` / `UX4Gmap` | Yes | Registers map data into global map object. |

---

## 16. Known Implementation Caveats

### 16.1 `ux4g-main.js` References `$grid`

The portfolio filter click handler calls:

```js
$grid.isotope({ filter: filterValue });
```

But the `$grid` initialization block is commented out. If `.portfolio-menu` exists and users click buttons, this can cause a runtime error unless `$grid` is defined globally or the Isotope initialization is restored.

Recommended fix:

```js
if (typeof $grid !== 'undefined' && $grid.isotope) {
  $grid.isotope({ filter: filterValue });
}
```

### 16.2 Chart Demo Script Assumes Canvas Elements Exist

`ux4g-chart-script.js` directly calls `document.getElementById(...).getContext('2d')`. If a page does not contain a matching canvas, it can fail.

Recommended pattern:

```js
const canvas = document.getElementById('myChart');
if (canvas) {
  const ctx = canvas.getContext('2d');
  new Chart(ctx, config);
}
```

### 16.3 Font References Include WOFF/WOFF2 but ZIP Only Contains TTF

`ux4g.css` references:

- `NotoSans-Regular.woff2`
- `NotoSans-Regular.woff`
- `NotoSans-Regular.ttf`

Only the TTF is included. Browser fallback should still work, but production optimization should include WOFF2 for better compression.

### 16.4 Do Not Load Demo Scripts Globally

`ux4g-chart-script.js` and `ux4g-main.js` contain demo/page-specific initialization. They should not be loaded globally across all pages unless the required DOM nodes and dependencies exist.

---

## 17. Recommended Target Architecture for a Product Using UX4G

```text
Frontend App
├── Layout Shell
│   ├── Header/Navbar
│   ├── Sidebar/Offcanvas navigation
│   ├── Main content area
│   └── Footer
├── UI Foundation
│   ├── UX4G CSS tokens
│   ├── UX4G grid
│   ├── UX4G utilities
│   └── Noto Sans typography
├── Feature Modules
│   ├── Forms and workflows
│   ├── Tables and lists
│   ├── Dashboards and charts
│   ├── Map-based reporting
│   ├── Date range filters
│   └── Notifications/modals
├── Data Layer
│   ├── REST/GraphQL APIs from consuming app
│   ├── JSON responses
│   └── Client-side formatting/adapters
└── Deployment Layer
    ├── Static asset hosting/CDN
    ├── Cache busting/versioning
    ├── CSP/SRI policy
    └── Monitoring/logging from consuming app
```

---

## 18. Suggested Design-System Governance

For enterprise/product usage, maintain UX4G as a governed design-system package.

### 18.1 Repository Structure

```text
ux4g-design-system/
├── dist/
│   ├── css/
│   ├── js/
│   └── fonts/
├── docs/
│   ├── getting-started.md
│   ├── components.md
│   ├── charts.md
│   ├── maps.md
│   └── accessibility.md
├── examples/
│   ├── dashboard.html
│   ├── form.html
│   ├── map.html
│   └── date-filter.html
└── CHANGELOG.md
```

### 18.2 Release Checklist

- Version folder created, e.g. `2.0.8`
- Minified and readable assets included
- Checksums generated
- WOFF2 font added for production
- Demo scripts separated from core package
- Browser compatibility tested
- RTL pages tested
- Accessibility smoke test completed
- CSP compatibility reviewed
- Changelog updated

---

## 19. Implementation Roadmap

### Phase 1: Baseline Integration

- Add `ux4g-min.css` and `ux4g.bundle.min.js`
- Configure font path
- Build base layout shell
- Validate core components: buttons, forms, tables, cards, navs, modals

### Phase 2: Interactive Components

- Add date range picker only where needed
- Add page-specific initialization files
- Remove unused plugin calls from `ux4g-main.js`
- Guard all DOM-specific JS initializers

### Phase 3: Dashboard Enablement

- Add `ux4g-chart.js`
- Replace demo chart data with API-driven datasets
- Standardize chart color palette using UX4G tokens
- Add accessible chart summaries and export tables

### Phase 4: Map Enablement

- Add `ux4g-map.js` and `ux4g-map-all.js`
- Create India map wrapper component/module
- Bind state-wise data using `hc-key` or state names
- Add non-map table fallback for accessibility

### Phase 5: Production Hardening

- Enable asset versioning
- Configure cache headers
- Add CSP
- Add SRI/checksum verification if CDN is used
- Run cross-browser and responsive QA
- Validate RTL where applicable

---

## 20. QA Checklist

| Category | Checks |
|---|---|
| Layout | Responsive behavior at mobile, tablet, desktop, and large desktop widths. |
| Typography | Noto Sans loads correctly; fallback stack behaves properly. |
| Forms | Inputs, selects, validation messages, disabled states, file upload, date fields. |
| Components | Buttons, cards, modals, dropdowns, accordions, navs, alerts, toasts. |
| JavaScript | No console errors when optional DOM nodes are absent. |
| Charts | Each chart initializes only when its canvas exists; data is sanitized. |
| Date picker | Apply/cancel flows, min/max dates, keyboard behavior, mobile usability. |
| Maps | Map data loads after runtime; state data binding works; fallback table exists. |
| Accessibility | Keyboard navigation, focus visibility, ARIA labels, contrast. |
| RTL | Layout mirroring, spacing utilities, text alignment, nav behavior. |
| Performance | Only page-required modules loaded; minified files used in production. |
| Security | CSP compatibility, no unsafe dynamic HTML injection. |

---

## 21. Final System Design Summary

The uploaded ZIP is best understood as a **static UX4G frontend design-system distribution**. It provides:

- A complete CSS framework with design tokens, typography, grid, reboot, utilities, RTL support, and component styling.
- Multiple JavaScript build formats for UI component behavior.
- jQuery-based demo/site interactivity through `ux4g-main.js`.
- Chart.js-compatible visualization support through `ux4g-chart.js` and demo chart configurations.
- Moment/date-range-picker support through date/time scripts and CSS.
- India map visualization assets through `ux4g-map.js` and `ux4g-map-all.js`.
- Noto Sans typography asset.

The package does **not** include backend services, API contracts, database design, authentication/authorization, CI/CD, or deployment infrastructure. Those must be defined by the consuming product/application.

Recommended production baseline:

```html
<link rel="stylesheet" href="/assets/ux4g/2.0.8/css/ux4g-min.css">
<script src="/assets/ux4g/2.0.8/js/ux4g.bundle.min.js"></script>
```

Load chart, map, and date/time modules only on pages that require them.
