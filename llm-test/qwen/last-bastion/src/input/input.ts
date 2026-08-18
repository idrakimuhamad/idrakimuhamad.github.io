// Input manager: keyboard + mouse. Produces a PlayerInput snapshot per frame.

export class InputManager {
  private keys = new Set<string>();
  private mouseNdc = { x: 0, y: 0 };
  private mouseDown = false;
  private rightDown = false;
  // one-shot flags consumed each frame
  dashPressed = false;
  qPressed = false; ePressed = false; rPressed = false; fPressed = false;
  ultimatePressed = false;
  clickPos: { x: number; y: number } | null = null; // screen px, for build-mode clicks
  onTab: (() => void) | null = null;
  onEscape: (() => void) | null = null;
  onF2: (() => void) | null = null;
  private canvas: HTMLCanvasElement;
  enabled = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('contextmenu', this.onContextMenu);
    window.addEventListener('contextmenu', this.onContextMenu);
    window.addEventListener('blur', this.onBlur);
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
    window.removeEventListener('contextmenu', this.onContextMenu);
    window.removeEventListener('blur', this.onBlur);
  }

  // Games must never open the native context menu: while it is open the page
  // stops receiving keyup events, which permanently latches movement keys.
  private onContextMenu = (e: Event) => e.preventDefault();

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    const k = e.key.toLowerCase();
    if (k === 'tab') { e.preventDefault(); this.onTab?.(); return; }
    if (k === 'escape') { this.onEscape?.(); return; }
    if (k === 'f2') { e.preventDefault(); this.onF2?.(); return; }
    if (k === ' ') { e.preventDefault(); if (!this.keys.has(' ')) this.dashPressed = true; }
    if (k === 'q' && !this.keys.has('q')) this.qPressed = true;
    if (k === 'e' && !this.keys.has('e')) this.ePressed = true;
    if (k === 'r' && !this.keys.has('r')) this.rPressed = true;
    if (k === 'f' && !this.keys.has('f')) this.fPressed = true;
    if (k === 't' && !this.keys.has('t')) this.ultimatePressed = true;
    this.keys.add(k);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };

  private onMouseMove = (e: MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.mouseNdc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.mouseNdc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  };

  private onMouseDown = (e: MouseEvent) => {
    if (!this.enabled) return;
    if (e.button === 0) {
      this.mouseDown = true;
      const r = this.canvas.getBoundingClientRect();
      this.clickPos = { x: e.clientX - r.left, y: e.clientY - r.top };
    } else if (e.button === 2) {
      this.rightDown = true;
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.mouseDown = false;
    if (e.button === 2) this.rightDown = false;
  };

  private onBlur = () => {
    this.keys.clear();
    this.mouseDown = false;
    this.rightDown = false;
  };

  // Movement in screen space: x right, y up
  get moveX(): number {
    let x = 0;
    if (this.keys.has('d')) x += 1;
    if (this.keys.has('a')) x -= 1;
    return x;
  }
  get moveY(): number {
    let y = 0;
    if (this.keys.has('w')) y += 1;
    if (this.keys.has('s')) y -= 1;
    return y;
  }

  snapshot() {
    const snap = {
      moveX: this.moveX,
      moveY: this.moveY,
      aimNdc: { ...this.mouseNdc },
      firing: this.mouseDown && this.enabled,
      lance: this.rightDown && this.enabled,
      dash: this.dashPressed,
      q: this.qPressed, e: this.ePressed, r: this.rPressed, f: this.fPressed,
      ultimate: this.ultimatePressed,
    };
    this.dashPressed = this.qPressed = this.ePressed = this.rPressed = this.fPressed = this.ultimatePressed = false;
    return snap;
  }
}
