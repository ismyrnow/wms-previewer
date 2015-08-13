WMS Previewer
-------------

A simple web app that display a leaflet map with all of the layers in a WMS service.

Type in your WMS service's URL, and it adds each layer as an overlay in the layer control.

What it doesn't do:

- Query or identify features.
- Work with WMS versions other than 1.1.1 (the version is hard coded into the GetCapabilities query).
- Actually follow the WMS spec beyond some basics (if your service doesn't work with the app, the fault is likely mine).
- Do your laundry.

Since many WMS services don't have CORS enabled, this app uses a proxy. Otherwise, it could be hosted as a static app on github pages.

Instead, you'll have to host it yourself until I get this running someplace.
