# Corpus Hermitica — Visual Enhancement Plan
## GPU-Accelerated Interactive Elements

**Target Devices:**
- **Mobile:** iPhone 12+ (A14 Bionic, 4GB RAM)
- **Desktop:** Intel i5 10th Gen+ / Apple M1+
- **Browser:** Chromium (Chrome, Edge, Brave) & Safari

---

## 🎯 Phase 1: WebGL Foundations (Week 1-2)

### 1.1 Sacred Geometry Background
**Technology:** Three.js + GLSL Shaders

Create an interactive background with slowly rotating sacred geometry patterns:
- **Flower of Life** — Interlocking circles that pulse with scroll position
- **Metatron's Cube** — 3D rotating wireframe that follows mouse/touch
- **Platonic Solids** — Floating tetrahedron, icosahedron, dodecahedron

```
Performance Budget:
- 60 FPS target on iPhone 12
- Max 50k vertices
- Single draw call via instancing
- Reduced motion for prefers-reduced-motion
```

### 1.2 Particle Constellation System
**Technology:** GPU Particles via WebGL

Replace current CSS particles with GPU-accelerated system:
- Stars that form constellation patterns from hermetic symbols
- Mouse/finger repels nearby particles (force field effect)
- Particles connect with golden threads when proximity < threshold
- ~2000 particles at 60fps (instanced rendering)

---

## 🌀 Phase 2: Interactive Ritual Elements (Week 3-4)

### 2.1 Alchemical Transmutation Visualizer
**Location:** New section or Oracle enhancement

Interactive 3D crucible/vessel:
- Drag elements (Earth, Water, Fire, Air) into vessel
- GPU-computed fluid simulation (2D texture feedback)
- Color mixing with additive blending
- Result produces a "transmutation" reading

### 2.2 Enhanced Alchemy Dial
**Upgrade existing dial:**

- 3D rendered dial with depth and lighting
- Particle trails following rotation
- Glow effects via post-processing bloom
- Haptic feedback on Chrome Android

### 2.3 Chakra/Energy Visualization
**Technology:** Shader-based color flow

- Vertical energy column that responds to scroll
- Pulsing nodes at 7 positions (chakra-like)
- User can "charge" each node via touch/hover
- Connects to Polarity Assessment visually

---

## ✨ Phase 3: Immersive Reading Experience (Week 5-6)

### 3.1 Reader Ambient Mode
**For the Reader Modal:**

- Animated parchment/paper texture (subtle shader noise)
- Flickering candlelight effect at edges
- Gentle smoke/incense rising animation
- Audio ambience option (rain, fire, meditation)

### 3.2 Text Highlight Glow
**On text selection:**

- Selected text gets animated golden glow
- Particles emanate from selection
- Smooth morphing highlight box

### 3.3 Chapter Transitions
**When navigating chapters:**

- Page-turn effect (WebGL plane morphing)
- Or: Fade through mystic portal effect
- Or: Text particles reassembling

---

## 🪴 Phase 4: Zen Garden Game (Week 7-8)

### 4.1 Core Concept
A meditative digital sand garden where users:
- Rake patterns in sand (touch/mouse trails)
- Place stones, plants, and hermetic symbols
- Sand slowly "heals" over time
- Optional: Link garden state to daily ritual

### 4.2 Technical Implementation Options

**Option A: 2D Canvas + WebGL Hybrid**
- Canvas for UI/controls
- WebGL for sand simulation
- Heightmap-based sand deformation
- ~120fps capable on target devices

**Option B: Full WebGL**
- Three.js scene with orthographic camera
- Custom sand shader with normal mapping
- Physics for stone placement
- More premium look, higher dev effort

**Option C: Existing Libraries to Evaluate**
- Look for: three.js sand garden examples
- Potential: Matter.js for physics
- Consider: PixiJS for 2D performance

### 4.3 Features Wishlist
- [ ] Rake tool with customizable patterns (straight, wave, spiral)
- [ ] Stone collection (various sizes/colors)
- [ ] Miniature bonsai/plants
- [ ] Hermetic symbols as placeable objects
- [ ] Undo/redo with smooth animation
- [ ] Screenshot/share garden
- [ ] Ambient sound (wind, water features)
- [ ] Day/night cycle tied to real time

---

## 🔧 Technical Architecture

### Shader Library Structure
```
/shaders/
├── particles.vert          # Instanced particle vertex
├── particles.frag          # Particle with glow
├── sacred-geometry.vert    # Rotating geometry
├── sacred-geometry.frag    # Golden wireframe effect
├── sand-deform.vert        # Heightmap displacement
├── sand-deform.frag        # Sand color + shadows
└── post-bloom.frag         # Full-screen glow post-process
```

### Performance Monitoring
```javascript
// Built-in FPS monitoring
const stats = {
    targetFPS: 60,
    minAcceptable: 45,
    autoQualityReduce: true,  // Reduce particles/effects if dropping
    respectReducedMotion: true
};
```

### Accessibility Considerations
- Respect `prefers-reduced-motion`
- All visuals are enhancement, not required
- Keyboard navigation still works
- Screen reader compatibility maintained

---

## 📦 Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 HIGH | GPU Particles | Medium | High |
| 🔴 HIGH | Sacred Geometry BG | Medium | High |
| 🟡 MED | Enhanced Alchemy Dial | Low | Medium |
| 🟡 MED | Reader Ambient Mode | Medium | High |
| 🟢 LOW | Zen Garden (Phase 1) | High | Very High |
| 🟢 LOW | Transmutation Viz | High | Medium |

---

## 🔗 Resources & References

### Libraries to Use
- **Three.js** — Primary 3D engine (r150+)
- **GSAP** — Animation orchestration
- **Lenis** — Smooth scroll with WebGL sync
- **Howler.js** — Audio (if adding ambient sounds)

### Inspiration
- [Awwwards WebGL](https://www.awwwards.com/websites/webgl/)
- [Codrops experiments](https://tympanus.net/codrops/)
- [Three.js examples](https://threejs.org/examples/)

### Performance Testing
- Chrome DevTools Performance panel
- Safari Web Inspector → Timelines
- Test on actual iPhone 12 device

---

## 💡 Quick Wins (Can Do Now)

1. **CSS 3D Transforms on Cards** — Add perspective and rotateY on hover
2. **Backdrop Filter Glass** — Enhance modals with real blur
3. **Gradient Mesh Backgrounds** — Animated via CSS @property
4. **Cursor Glow Effect** — Custom cursor with trailing glow
5. **Scroll-linked Animations** — CSS scroll-driven animations (Chrome 115+)

---

*This plan balances visual impact with performance constraints. Start with Phase 1 foundations, then layer additional features based on testing results.*
