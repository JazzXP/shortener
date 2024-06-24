import { handler } from './build/handler.js';
import express from 'express';
import { initDB } from './src/lib';

const app = express();
// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

// Initial setup
initDB();

app.listen(3000, () => {
	console.log('listening on port 3000');
});
