/* =====================================================================
   Page transitions shared by every page.
   Clicking a link to another page of this site raises a navy curtain with
   the α, then navigates. The next page starts covered and lowers the curtain.
   Skipped for reduced motion, new-tab clicks, and in-page anchors.
   ===================================================================== */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const curtain = document.createElement("div");
curtain.className = "curtain";
curtain.setAttribute("aria-hidden", "true");
curtain.innerHTML = '<span class="curtain-alpha">α</span><span class="curtain-label"></span>';
document.body.append(curtain);

let arriving = false;
try { arriving = sessionStorage.getItem("nv-nav") === "1"; sessionStorage.removeItem("nv-nav"); } catch (e) {}
if (arriving && !reduce) {
  curtain.classList.add("cover", "instant");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    curtain.classList.remove("instant");
    curtain.classList.add("leave");
    setTimeout(() => curtain.classList.remove("cover", "leave"), 900);
  }));
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target && a.target !== "_self") return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname) return; // same page: let in-page anchors work
  e.preventDefault();
  curtain.querySelector(".curtain-label").textContent = a.dataset.tag || a.querySelector(".o-title, .nx-title")?.textContent || "";
  curtain.classList.add("cover");
  try { sessionStorage.setItem("nv-nav", "1"); } catch (err) {}
  setTimeout(() => { location.href = url.href; }, 650);
});

// Back/forward cache: never restore a page with the curtain down.
window.addEventListener("pageshow", (e) => { if (e.persisted) curtain.classList.remove("cover", "leave"); });
