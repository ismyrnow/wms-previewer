var map, overlayMaps, layerControl;

$(init);

function init() {
  var basemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  	maxZoom: 16
  });

  map = L.map('map', { layers: [basemap] }).setView([37.8, -96], 4);
  overlayMaps = {};
  layerControl = L.control.layers({ 'Basemap': basemap }, overlayMaps);

  layerControl.addTo(map);

  initEvents();
}

function initEvents() {
  $('#url').on('change', updateWmsUrl);
}

function updateWmsUrl(e) {
  var url = $(e.target).val();

  if(!isUrl(url)) {
    return;
  }

  loading(true);

  // Query WMS service for new layers.
  getCapabilities(url).then(function (capabilities) {
    clearLayers();
    var newLayers = createLayers(url, capabilities.layers);
    updateLayers(newLayers);
  }).always(function() {
    loading(false);
  });
}

function loading(isLoading) {
  $('body').toggleClass('loading', isLoading);
}

function clearLayers() {
  // Remove layers from layer control and map.
  Object.keys(overlayMaps).forEach(function (layerName) {
    var layer = overlayMaps[layerName];
    layerControl.removeLayer(layer);
    map.removeLayer(layer);
  });
}

function updateLayers(layers) {
  // Add layers to layer control.
  Object.keys(layers).forEach(function (layerName) {
    layerControl.addOverlay(layers[layerName], layerName);
  });

  // Track layers.
  overlayMaps = layers;
}

function getCapabilities(url) {
  var deferred = $.Deferred();
  var proxy = '/proxy/';

  $.get(proxy + url + '?service=wms&version=1.1.1&request=GetCapabilities').then(function (data) {
    var formatter = new OpenLayers.Format.WMSCapabilities();
    var capability = formatter.read(data).capability;
    deferred.resolve(capability);
  });

  return deferred.promise();
}

function createLayers(wmsUrl, layerDefs) {
  return layerDefs.reduce(function (layers, layerDef) {
    layers[layerDef.title] = createLayer(wmsUrl, layerDef);
    return layers;
  }, {});
}

function createLayer(wmsUrl, layerDef) {
  return L.tileLayer.wms(wmsUrl, {
    format: 'image/png',
    transparent: true,
    layers: layerDef.name
  });
}

function isUrl(value) {
  if (value.indexOf('http') !== 0) {
    return false;
  }

  return true;
}
