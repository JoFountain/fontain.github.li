(function () {
  const canvas = document.getElementById("draggable-canvas");
  if (!canvas) return;

  function makeDraggable(el) {
    el.style.position = "absolute";
    el.style.touchAction = "none";
    el.style.cursor = "grab";

    let shiftX = 0, shiftY = 0, z = 1;

    function moveTo(pageX, pageY) {
      let left = pageX - shiftX;
      let top  = pageY - shiftY;

      // keep inside canvas bounds
      const cRect = canvas.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      const maxLeft = cRect.width - eRect.width;
      const maxTop  = cRect.height - eRect.height;

      left = Math.max(0, Math.min(left, maxLeft));
      top  = Math.max(0, Math.min(top,  maxTop));

      el.style.left = left + "px";
      el.style.top  = top  + "px";
    }

    function onMouseDown(e) {
      e.preventDefault();
      const elRect = el.getBoundingClientRect();
      const cRect  = canvas.getBoundingClientRect();
      shiftX = e.clientX - elRect.left + cRect.left;
      shiftY = e.clientY - elRect.top  + cRect.top;
      el.style.cursor = "grabbing";
      el.style.zIndex = ++z;

      function onMove(ev) { moveTo(ev.pageX, ev.pageY); }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        el.style.cursor = "grab";
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }

    function onTouchStart(e) {
      const t = e.touches[0];
      const elRect = el.getBoundingClientRect();
      const cRect  = canvas.getBoundingClientRect();
      shiftX = t.clientX - elRect.left + cRect.left;
      shiftY = t.clientY - elRect.top  + cRect.top;
      el.style.zIndex = ++z;

      function onTouchMove(ev) {
        const tt = ev.touches[0];
        moveTo(tt.pageX, tt.pageY);
      }
      function onTouchEnd() {
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
      }
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd);
    }

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.ondragstart = () => false;
  }

  document.querySelectorAll(".draggable").forEach(makeDraggable);
})();