import { EmbeddedApp } from "@/components/embed/app";
import { createRoot } from "react-dom/client";

const isDockOpen = signal(false);

function bootContainer() {
  const container = document.createElement("div");
  container.style.position = "fixed";

  isDockOpen.watch((p, c) => {
    if (!c) {
      container.dataset.state = 'closed';
      container.style.transform = 'translateX(-100%)';
      container.style.opacity = '0';
    }
    else {
      container.style.transform = 'translateX(0%)';
      container.style.opacity = '1';
      container.dataset.state = 'open';
    }
  })

  container.style.top = '0';
  container.style.left = '0';
  container.style.bottom = '0';

  container.style.maxWidth = '320px';
  container.style.height = "100%";
  container.style.display = "block";
  container.style.zIndex = '9999';

  container.style.backgroundColor = "blue";
  container.style.backdropFilter = 'blur(8px)';
  container.style.color = "white";

  container.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';

  container.id = "embedded";

  container.classList.add("dark");

  container.dataset.state = "closed";

  isDockOpen.value = false;
  return container;
}

function mountDockEventListener(dock: HTMLDivElement) {

  const mouseMoveHandler = (event: globalThis.MouseEvent) => {
    if (event.clientX === 0 && event.movementX < -5 && !isDockOpen.value) {
      isDockOpen.value = true;
      dock.onmouseleave = () => {
        isDockOpen.value = false;
      }
    }
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  return () => {
    document.removeEventListener("mousemove", mouseMoveHandler);
  }
}

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount(ui, shadow, shadowHost) {
        const container = bootContainer();
        ui.append(container);
        const appRoot = createRoot(container);
        appRoot.render(<EmbeddedApp />);
        let cleanup = mountDockEventListener(container);
        return { appRoot, cleanup, container };
      },
      onRemove(elements) {
        elements?.appRoot.unmount();
        elements?.cleanup();
        elements?.container.remove();
      }
    });

    ui.mount();
  },
});