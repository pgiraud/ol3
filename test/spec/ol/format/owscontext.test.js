goog.provide('ol.test.format.OWSContext');

goog.require('ol.xml');

describe.only('ol.test.OWSContext', function() {

  describe('when parsing ogcsample.xml', function() {

    var parser = new ol.format.OWSContext();
    var context;
    before(function(done) {
      afterLoadText(
          'spec/ol/format/owscontext/owscontextsample.xml',
          function(xml) {
            try {
              context = parser.read(xml);
            } catch (e) {
              done(e);
            }
            done();
          }
      );
    });

    it('can read id', function() {
      expect(context.id).to.eql('ows-context-ex-1-v3');
    });

    it('can read version', function() {
      expect(context.version).to.eql('0.3.1');
    });

    it('can read General section', function() {
      var general = context.General;
      var boundingbox = general.BoundingBox;

      expect(general.Title).to.eql(
          'OWS Context version 0.3.1 showing nested layers');

      expect(boundingbox.crs).to.eql('urn:ogc:def:crs:EPSG:6.6:4326');
      expect(boundingbox.LowerCorner).to.eql([
        -117.44667178362664,
        32.57086210449395
      ]);
      expect(boundingbox.UpperCorner).to.eql([
        -116.74066794885977,
        32.921986352104064
      ]);
    });

    it('can read ResourceList section', function() {
      var resources = context.ResourceList;
      var layers = resources.Layer;

      expect(layers.length).to.eql(1);

      var layer = layers[0];
      expect(layer.name).to.eql('topp:major_roads');
      expect(layer.queryable).to.be(true);
      expect(layer.hidden).to.be(true);
      expect(layer.Title).to.eql('Tiger 2005fe major roads');
      expect(layer.OutputFormat).to.eql('image/png');
      var server = layer.Server;
      expect(server.service).to.eql('urn:ogc:serviceType:WMS');
      expect(server.version).to.eql('1.1.1');
      expect(server.OnlineResource).to.eql(
          'http://sigma.openplans.org:8080/geoserver/wms?SERVICE=WMS');

      var nestedLayers = layer.Layer;
      expect(nestedLayers.length).to.eql(1);

      layer = nestedLayers[0];
      expect(layer.name).to.eql('topp:gnis_pop');
      expect(layer.hidden).to.be(false);
      expect(layer.Title).to.eql('GNIS Population');
      server = layer.Server;
      expect(server.service).to.eql('urn:ogc:serviceType:WFS');
      expect(server.version).to.eql('1.0.0');
      expect(server.OnlineResource).to.eql(
          'http://sigma.openplans.org:8080/geoserver/wfs?');
    });
  });

  describe('write', function() {
    var obj = {
      'version': '0.3.1',
      'id': 'ows-context-ex-1-v3',
      'General': {
        'BoundingBox': {
          'LowerCorner': [
            -117.44667178362664,
            32.57086210449395
          ],
          'UpperCorner': [
            -116.74066794885977,
            32.921986352104064
          ],
          'crs': 'urn:ogc:def:crs:EPSG:6.6:4326'
        },
        'Title': 'OWS Context version 0.3.1 showing nested layers'
      },
      'ResourceList': {
        'Layer': [{
          'name': 'topp:major_roads',
          'queryable': true,
          'hidden': true,
          'Title': 'Tiger 2005fe major roads',
          'OutputFormat': 'image/png',
          'Server': {
            'service': 'urn:ogc:serviceType:WMS',
            'version': '1.1.1',
            'OnlineResource':
                'http://sigma.openplans.org:8080/geoserver/wms?SERVICE=WMS'
          },
          'Layer': [{
            'name': 'topp:gnis_pop',
            'hidden': false,
            'Title': 'GNIS Population',
            'Server': {
              'service': 'urn:ogc:serviceType:WFS',
              'version': '1.0.0',
              'OnlineResource':
                  'http://sigma.openplans.org:8080/geoserver/wfs?'
            }
          }]
        }]
      }
    };

    var text =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<OWSContext version="0.3.1" id="ows-context-ex-1-v3"' +
        '  xmlns="http://www.opengis.net/ows-context"' +
        '  xmlns:gml="http://www.opengis.net/gml"' +
        '  xmlns:kml="http://www.opengis.net/kml/2.2"' +
        '  xmlns:ogc="http://www.opengis.net/ogc"' +
        '  xmlns:ows="http://www.opengis.net/ows"' +
        '  xmlns:sld="http://www.opengis.net/sld"' +
        '  xmlns:xlink="http://www.w3.org/1999/xlink"' +
        '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
        '  xsi:schemaLocation="http://www.opengis.net/ows-context' +
        ' http://www.ogcnetwork.net/schemas/owc/0.3.1/owsContext.xsd">' +
        '</OWSContext>';

    it('can write an OWS Context document', function() {
      var serialized = (new ol.format.OWSContext()).write(obj);
      expect(serialized).to.xmleql(ol.xml.load(text));
    });

  });
});

goog.require('ol.format.OWSContext');
