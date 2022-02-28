<h1>React Photo Gallery API APP</h1>
<hr>
<br/>
<h3>Backend</h3>
<hr>
    - Used Node Express.js to create a REST API server
    - Deployed the the API to Firebase Functions to run in the cloud 
    - Used Unsplash API to query images requested by user, and passed image data to React frontend
    - Obscures users interaction or visibility to  Unsplash API 
    - Implemented error handling

<br/>
<br/>

<h3>Frontend</h3>
<hr>
    - Started with create-react-app template
    - Used MaterialUI library for stylish interface components
    - Input to search for images, that sends request to backend API 
    - Hooks to manage front end state: loading, errors, page view, endless scroll, query
    - Used IntersectionObserver to detect when user scrolled to bottom of screen and to trigger hooks to fetch additional photos 
    - Created responsive gallery compnent for photos which resizes to screen size and allows an overlay when a specific image is clicked

