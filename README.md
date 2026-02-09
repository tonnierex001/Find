# Find

Find is a lightweight frontend prototype for a school discovery platform. It lets school management teams
submit detailed profiles (including uploads), while parents can search by location or name and leave ratings
that help other families decide.

## Features

- School discovery section with filters for name, city, and minimum rating.
- Registration form to capture school details, contact info, and media uploads.
- Parent login card and rating submission form.
- Client-side search, rating updates, and a geolocation helper for quick city input.

## Project Structure

- `index.html` - Main single-page layout and forms.
- `styles.css` - Visual styling and responsive layout.
- `app.js` - In-memory data, filtering, and rating interactions.

## Running locally

You can view the prototype with a simple static server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.
