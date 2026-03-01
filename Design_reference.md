# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

---
Visual Style

Color Palette:
- Primary background: Soft light gray (#F5F6F8) for main workspace, with slightly darker gray (#E8E9EC) for card backgrounds
- Accent color: Vibrant lime green (#C9FF52) for highlighting key actions, events, and active states
- Secondary colors: Pure white (#FFFFFF) for card and modal surfaces, deep black (#18191A) for navigation and summary panels, and mid-gray (#B6B7BA) for dividers and muted text
- Text: Dark gray (#232323) for primary text, lighter gray (#6B6B6B) for secondary text, and white (#FFFFFF) on dark backgrounds
- Additional accents: Red (#FF5E5E) for warning or error states, orange (#FFC85E) and sky blue (#6ECFFF) for secondary status and tags
- Color relationships: High contrast between accent green and muted neutrals for clear focus; black panels create visual anchor points

Typography & Layout:
- Font family: Clean, geometric sans-serif (e.g., Inter, SF Pro, or Circular)
- Font weights: Regular for body, bold for headings, medium for labels and CTAs
- Hierarchy: Large, bold headings; medium-weight subheads; lighter secondary labels and metadata
- Spacing: Generous padding and margin between cards and sections (24–32px), with consistent vertical rhythm
- Alignment: Left-aligned text, center-aligned key metrics, and edge-to-edge card layouts
- Treatments: Subtle use of color and weight for emphasis; iconography paired with text for clarity

Key Design Elements

Card Design:
- Card styling: Rounded corners (16–24px radius), mild drop shadows for elevation, white or very light gray backgrounds
- Borders: Minimal or none, relying on shadow and spacing for separation
- Hover/active: Subtle shadow intensification or light outline; accent green highlight for selected cards
- Visual hierarchy: Prominent title, secondary metadata, compact icons and tags at the bottom

Navigation:
- Top bar: Pill-shaped, black with white and accent green highlights for active items
- Sidebar: Minimal vertical icon stack, outlined with subtle dividers
- Active states: High-contrast color (green or white on black) and pill backgrounds for current section
- Collapsible/expandable: Not explicitly shown, but navigation elements are designed to support modular expansion

Data Visualization:
- Chart styles: Not directly visible, but summary panels hint at card-style stat blocks with bold numerals and compact labels
- Visual treatments: Use of accent colors for status, white/black backgrounds for strong separation
- Patterns: Inline mini-charts or status pills likely for quick-glance metrics

Interactive Elements:
- Button styles: Rounded pill-shaped buttons, filled (accent green or black) or outlined, minimal iconography
- Form elements: Soft, rounded fields with subtle shadows or outlines, clear focus states
- Hover effects: Mild shadow intensification, color fill transitions, and micro-interactions (icon movement/scale)
- Micro-interactions: Subtle, reinforcing clarity and responsiveness

Design Philosophy
This interface embodies:
- A modern, minimalist, and professional aesthetic with high clarity and focus on actionable elements
- Design principles of simplicity, whitespace, and visual hierarchy to reduce cognitive load and drive efficiency
- Rounded, approachable shapes and high-contrast accenting to guide user attention
- User experience goals centered on frictionless navigation, quick scanning, and confident action-taking with clear status and feedback
- Visual strategy prioritizing enterprise trust, approachability, and clear modularity for scalable workflows

---

Mandatory Coding Standards — Runtime Safety

CRITICAL: Follow these rules in ALL generated code to prevent runtime crashes.

1. Supabase query results: Always use nullish coalescing — const items = data ?? []. Supabase returns null (not []) when there are no rows.
2. Array methods (.map(), .filter(), .reduce(), .forEach(), .find(), .some(), .every()): Never call on a value that could be null, undefined, or a non-array. Always guard:
   - (items ?? []).map(...) or
   - Array.isArray(items) ? items.map(...) : []
3. React useState for arrays/objects: Always initialize with the correct type — useState<Type[]>([]) (e.g., useState<Group[]>([])), never useState() or useState(null) for arrays.
4. API response shapes: Always validate — const list = Array.isArray(response?.data) ? response.data : [].
5. Optional chaining: Use obj?.property?.nested when accessing nested objects from API responses or database queries.
6. Destructuring with defaults: const { items = [], count = 0 } = response ?? {}.

---

This prompt provides a complete, actionable specification for building the Merge & Duplicate Resolution feature with explicit runtime safety rules, UI/UX design guidance, data models, and integration points suitable for an AI development tool to implement the feature end-to-end.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
