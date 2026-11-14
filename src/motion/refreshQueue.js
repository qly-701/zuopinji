import { ScrollTrigger } from 'gsap/ScrollTrigger';

let frame = null;
const requests = new Set();

export function scheduleScrollRefresh() {
  const request = {};
  requests.add(request);
  if (frame === null) frame = requestAnimationFrame(() => {
    frame = null;
    if (!requests.size) return;
    requests.clear();
    ScrollTrigger.refresh();
  });
  return () => {
    requests.delete(request);
    if (!requests.size && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };
}
