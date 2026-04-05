# Spencer Hills site prototype

This version is a lightweight HTML/CSS/JavaScript site inspired by Academic Pages.

## Edit these first
- `assets/js/data.js` — project cards, sidebar links, nav items, image paths
- `assets/css/styles.css` — fonts, spacing, card appearance, layout
- `index.html`, `about.html`, `experience.html`, `contact.html` — page copy

## Add research PDFs
Place files in the `files/` folder, then add links inside each project object in `assets/js/data.js`.

Example:
```js
links: [
  { label: "Poster PDF", href: "files/roots-realities-poster.pdf" },
  { label: "Back to research", href: "research.html" }
]
```

## Replace images
Put your real images in `assets/img/projects/` and update the `image:` path in `assets/js/data.js`.

## Preview locally
Run:
```bash
python3 -m http.server 8000
```
Then open:
`http://localhost:8000`
