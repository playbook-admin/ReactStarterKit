import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import MainApp from './MainApp';
import { createServerRenderer } from 'aspnet-prerendering';

export default createServerRenderer(async params => {
  const context = {};

  const app = (
    <StaticRouter location={params.location.path} context={context}>
      <MainApp />
    </StaticRouter>
  );

  const html = ReactDOMServer.renderToString(app);

  return {
    html,
    globals: {
      __INITIAL_DATA__: params.data,
    },
  };
});
