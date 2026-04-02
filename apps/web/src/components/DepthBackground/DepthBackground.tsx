import './DepthBackground.css';

/**
 * Fixed full-viewport ocean depth field (Phase 1 base + Phase 2 atmosphere).
 * Presentational only — no scroll logic; optional CSS opacity drift when motion OK.
 */
export default function DepthBackground() {
  return (
    <div className="depth-background" aria-hidden={true}>
      <div className="depth-background__gradient" />
      <div className="depth-background__depth-veil" />
      <div className="depth-background__bio-glow" />
      <div className="depth-background__surface-glow" />
      <div className="depth-background__light-beams" />
    </div>
  );
}
