import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import MainApp from './MainApp';

const renderApp = () => {
  const container = document.getElementById("react-app");

  if (container.hasChildNodes()) {
    // If the container already has content, it means we're hydrating
    hydrateRoot(container, <MainApp />);
  } else {
    // Otherwise, we're just rendering
    createRoot(container).render(<MainApp />);
  }
}

renderApp();
