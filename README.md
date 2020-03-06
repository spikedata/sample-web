# Sample Web CDN

This sample demonstrates how to use the Spike API in your own web application.

There are 2 demos:

- [/pdf-cdn](./src/ux/pdf-cdn/app.js) - a simple demo showing how to access the spike-api directly from your front-end code
  - **warning!** this method is not secure - your spike-api keys can be stolen
- [/pdf](./src/ux/pdf/app.js) - a production ready demo showing how to keep your spike-api keys safe by accessing the spike-api from your webserver
