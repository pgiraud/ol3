goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.events.condition');
goog.require('ol.format.GeoJSON');
goog.require('ol.interaction.Draw');
goog.require('ol.interaction.Select');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.source.MapQuest');
goog.require('ol.source.Vector');


var map = new ol.Map({
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

map.addInteraction(new ol.interaction.Draw({
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
        })
    }),
    type: 'Polygon',
    source: new ol.source.Vector()
}));

map.addInteraction(new ol.interaction.Select({
    filter: function(feature, layer) {
        return false;
    }
}));
