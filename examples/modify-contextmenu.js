goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.format.GeoJSON');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.MultiPoint');
goog.require('ol.geom.Polygon');
goog.require('ol.interaction');
goog.require('ol.interaction.Modify');
goog.require('ol.interaction.Select');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.RegularShape');
goog.require('ol.style.Style');


var vertexStyle = new ol.style.Style({
  image: new ol.style.RegularShape({
    radius: 6,
    points: 4,
    angle: Math.PI / 4,
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 1)'
    })
  }),
  geometry: function(feature) {
    var geom = feature.getGeometry();

    if (geom.getType() == ol.geom.GeometryType.POINT) {
      return;
    }

    var coordinates;
    if (geom instanceof ol.geom.LineString) {
      coordinates = feature.getGeometry().getCoordinates();
      return new ol.geom.MultiPoint(coordinates);
    } else if (geom instanceof ol.geom.Polygon) {
      coordinates = feature.getGeometry().getCoordinates()[0];
      return new ol.geom.MultiPoint(coordinates);
    } else {
      return feature.getGeometry();
    }
  }
});

var styleFunction = (function() {
  var fill = new ol.style.Fill({
    color: 'rgba(255,255,255,0.4)'
  });
  var stroke = new ol.style.Stroke({
    color: '#3399CC',
    width: 1.25
  });
  return function(feature, resolution) {
    return [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: fill,
          stroke: stroke,
          radius: 5
        }),
        fill: fill,
        stroke: stroke
      }), vertexStyle
    ];
  };
})();


var geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:3857'
    }
  },
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [0, 0]
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [[4e6, -2e6], [8e6, 2e6], [9e6, 2e6]]
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[-5e6, -1e6], [-4e6, 1e6],
            [-3e6, -1e6], [-5e6, -1e6]], [[-4.5e6, -0.5e6],
            [-3.5e6, -0.5e6], [-4e6, 0.5e6], [-4.5e6, -0.5e6]]]
      }
    }
  ]
};

var source = new ol.source.Vector({
  features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
});

var layer = new ol.layer.Vector({
  source: source
});

var select = new ol.interaction.Select({
  style: styleFunction
});

var modify = new ol.interaction.Modify({
  features: select.getFeatures()
});

var map = new ol.Map({
  interactions: ol.interaction.defaults().extend([select, modify]),
  layers: [layer],
  target: 'map',
  view: new ol.View({
    center: [0, 1000000],
    zoom: 2
  })
});

map.getViewport().addEventListener('contextmenu', function (e) {
  e.preventDefault();

  var feature = map.forEachFeatureAtPixel(map.getEventPixel(e),
    function (feature, layer) {
      return feature;
    });
  if (feature) {
    if (source.getFeatures().indexOf(feature) != -1) {
      console.log (feature.getGeometry().getType(), ' is a feature');
    } else {
      console.log (feature.getGeometry().getType(), ' is NOT a feature');
    }
  }
});
