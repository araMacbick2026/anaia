// Keep startup failures visible even when the application module cannot load.
(() => {
  const main = document.querySelector('main');
  function showFailure(localFile = false) {
    if (main.dataset.ready === 'true') return;
    main.replaceChildren();
    const heading = document.createElement('h1');
    heading.textContent = localFile ? 'Let’s open ANAIA in a browser.' : 'ANAIA could not finish opening.';
    const message = document.createElement('p');
    message.textContent = localFile
      ? 'This source file needs the ANAIA local server. In the extracted anaia folder, run npm run build and then npm start. Open http://localhost:3000 in your browser.'
      : 'Reload this page to try again. If you are running locally, run npm run build and npm start from the anaia folder, then open http://localhost:3000. Your saved device data has not been deleted.';
    main.append(heading, message);
    if (!localFile) {
      const retry = document.createElement('button');
      retry.textContent = 'Reload ANAIA';
      retry.addEventListener('click', () => location.reload());
      main.append(retry);
    }
  }
  if (location.protocol === 'file:') { showFailure(true); return; }
  const timer = setTimeout(() => showFailure(), 8000);
  import('./app.js').catch(() => showFailure()).finally(() => clearTimeout(timer));
})();
