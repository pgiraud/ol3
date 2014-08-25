goog.provide('ol.format.OWSContext');

goog.require('goog.asserts');
goog.require('goog.dom.NodeType');
goog.require('goog.string');
goog.require('ol.format.OWS');
goog.require('ol.format.XLink');
goog.require('ol.format.XML');
goog.require('ol.format.XSD');
goog.require('ol.xml');



/**
 * @classdesc
 * Format for reading OWS Context data
 *
 * @constructor
 * @extends {ol.format.XML}
 * @api
 */
ol.format.OWSContext = function() {

  goog.base(this);

  /**
   * @type {string|undefined}
   */
  this.version = undefined;
};
goog.inherits(ol.format.OWSContext, ol.format.XML);


/**
 * read a OWS Context document.
 *
 * @function
 * @param {Document|Node|string} source the XML source.
 * @return {Object} An object representing the OWS Context.
 * @api
 */
ol.format.OWSContext.prototype.read;


/**
 * @param {Document} doc Document.
 * @return {Object} OWS Context object.
 */
ol.format.OWSContext.prototype.readFromDocument = function(doc) {
  goog.asserts.assert(doc.nodeType == goog.dom.NodeType.DOCUMENT);
  for (var n = doc.firstChild; !goog.isNull(n); n = n.nextSibling) {
    if (n.nodeType == goog.dom.NodeType.ELEMENT) {
      return this.readFromNode(n);
    }
  }
  return null;
};


/**
 * @param {Node} node Node.
 * @return {Object} OWS Context object.
 */
ol.format.OWSContext.prototype.readFromNode = function(node) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT);
  goog.asserts.assert(node.localName == 'OWSContext');

  var id = node.getAttribute('id');
  var version = node.getAttribute('version');
  if (goog.isDef(version) && !goog.isNull(version)) {
    this.version = goog.string.trim(version);
  }
  var owsContextObject = ol.xml.pushParseAndPop({
    'id': id,
    'version': this.version
  }, ol.format.OWSContext.PARSERS_, node, []);
  return goog.isDef(owsContextObject) ? owsContextObject : null;
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Service object.
 */
ol.format.OWSContext.readGeneral_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT);
  goog.asserts.assert(node.localName == 'General');
  return ol.xml.pushParseAndPop(
      {}, ol.format.OWSContext.GENERAL_PARSERS_, node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Service object.
 */
ol.format.OWSContext.readLayer_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT);
  goog.asserts.assert(node.localName == 'Layer');

  var layerObject = ol.xml.pushParseAndPop({
    'name': node.getAttribute('name'),
    'queryable': ol.format.XSD.readBooleanString(
        node.getAttribute('queryable')),
    'hidden': ol.format.XSD.readBooleanString(node.getAttribute('hidden')),
    'opacity': ol.format.XSD.readDecimalString(node.getAttribute('opacity'))
  }, ol.format.OWSContext.OWS_LAYER_PARSERS_, node, objectStack);

  return ol.xml.pushParseAndPop(layerObject,
      ol.format.OWSContext.OWSCONTEXT_LAYER_PARSERS_, node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Service object.
 */
ol.format.OWSContext.readResourceList_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT);
  goog.asserts.assert(node.localName == 'ResourceList');
  return ol.xml.pushParseAndPop(
      {}, ol.format.OWSContext.RESOURCELIST_PARSERS_, node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Service object.
 */
ol.format.OWSContext.readServer_ = function(node, objectStack) {
  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT);
  goog.asserts.assert(node.localName == 'Server');
  var service = node.getAttribute('service');
  var version = node.getAttribute('version');
  if (goog.isDef(version) && !goog.isNull(version)) {
    version = goog.string.trim(version);
  }
  var obj = ol.xml.pushParseAndPop({
    'service': service,
    'version': version
  }, ol.format.OWSContext.SERVER_PARSERS_, node, objectStack);
  goog.asserts.assert(goog.isObject(obj));
  return obj;
};


/**
 * @param {Object} obj OWS Context object.
 * @return {Node} OWS Context XML document.
 */
ol.format.OWSContext.prototype.write = function(obj) {
  var objectStack = [];
  var doc = ol.xml.createElementNS(ol.format.OWSContext.NAMESPACE_URIS_[1],
      'OWSContext');
  var xmlnsUri = 'http://www.w3.org/2000/xmlns/';
  var xmlSchemaInstanceUri = 'http://www.w3.org/2001/XMLSchema-instance';
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:gml',
      ol.format.OWSContext.GML_NAMESPACE_URIS_[0]);
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:kml',
      ol.format.OWSContext.KML_NAMESPACE_URIS_[0]);
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:ogc',
      ol.format.OWSContext.OGC_NAMESPACE_URIS_[0]);
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:ows',
      ol.format.OWSContext.OWS_NAMESPACE_URIS_[0]);
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:sld',
      ol.format.OWSContext.SLD_NAMESPACE_URIS_[0]);
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:xlink',
      ol.format.OWSContext.XLINK_NAMESPACE_URIS_[0]);
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:xsi',
      ol.format.OWSContext.XSI_NAMESPACE_URIS_[0]);
  ol.xml.setAttributeNS(doc, xmlnsUri, 'xmlns:xsi', xmlSchemaInstanceUri);
  ol.xml.setAttributeNS(doc, xmlSchemaInstanceUri, 'xsi:schemaLocation',
      ol.format.OWSContext.SCHEMA_LOCATION_);

  doc.setAttribute('id', obj.id);
  doc.setAttribute('version', obj.version);

  var orderedKeys = ['General', 'ResourceList'];
  var values = ol.xml.makeSequence(obj, orderedKeys);
  ol.xml.pushSerializeAndPop({node: doc}, ol.format.OWSContext.SERIALIZERS_,
      ol.xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
  return doc;
};


/**
 * @param {Node} node Node.
 * @param {Object} general Object.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
ol.format.OWSContext.writeGeneral_ = function(node, general, objectStack) {
  var /** @type {ol.xml.NodeStackItem} */ context = {node: node};
  console.log(context);
};


/**
 * @param {Node} node Node.
 * @param {Object} resourceList Object.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
ol.format.OWSContext.writeResourceList_ = function(
    node, resourceList, objectStack) {
  var /** @type {ol.xml.NodeStackItem} */ context = {node: node};
  console.log(context);
};


/**
 * @const
 * @private
 * @type {Array.<string>}
 */
ol.format.OWSContext.NAMESPACE_URIS_ = [
  null,
  'http://www.opengis.net/ows-context'
];


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.OWSContext.GENERAL_PARSERS_ = ol.xml.makeParsersNS(
    ol.format.OWS.NAMESPACE_URIS, {
      'Title': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
      'BoundingBox': ol.xml.makeObjectPropertySetter(
          ol.format.OWS.readBoundingBox)
    });


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
ol.format.OWSContext.GML_NAMESPACE_URIS_ = [
  'http://www.opengis.net/gml'
];


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
ol.format.OWSContext.KML_NAMESPACE_URIS_ = [
  'http://www.opengis.net/kml/2.2'
];


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
ol.format.OWSContext.OGC_NAMESPACE_URIS_ = [
  'http://www.opengis.net/ogc'
];


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
ol.format.OWSContext.OWS_NAMESPACE_URIS_ = [
  'http://www.opengis.net/ows'
];


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.OWSContext.OWSCONTEXT_LAYER_PARSERS_ = ol.xml.makeParsersNS(
    ol.format.OWSContext.NAMESPACE_URIS_, {
      'Server': ol.xml.makeObjectPropertySetter(
          ol.format.OWSContext.readServer_),
      'Layer': ol.xml.makeObjectPropertyPusher(
          ol.format.OWSContext.readLayer_)
    });


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.OWSContext.OWS_LAYER_PARSERS_ = ol.xml.makeParsersNS(
    ol.format.OWS.NAMESPACE_URIS, {
      'Title': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
      'OutputFormat': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString)
    });


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.OWSContext.PARSERS_ = ol.xml.makeParsersNS(
    ol.format.OWSContext.NAMESPACE_URIS_, {
      'General': ol.xml.makeObjectPropertySetter(
          ol.format.OWSContext.readGeneral_),
      'ResourceList': ol.xml.makeObjectPropertySetter(
          ol.format.OWSContext.readResourceList_)
    });


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.OWSContext.RESOURCELIST_PARSERS_ = ol.xml.makeParsersNS(
    ol.format.OWSContext.NAMESPACE_URIS_, {
      'Layer': ol.xml.makeObjectPropertyPusher(
          ol.format.OWSContext.readLayer_)
    });


/**
 * @const
 * @type {string}
 * @private
 */
ol.format.OWSContext.SCHEMA_LOCATION_ = 'http://www.opengis.net/ows-context ' +
    'http://www.ogcnetwork.net/schemas/owc/0.3.1/owsContext.xsd';


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Serializer>>}
 * @private
 */
ol.format.OWSContext.SERIALIZERS_ = ol.xml.makeStructureNS(
    ol.format.OWSContext.NAMESPACE_URIS_, {
      'General': ol.xml.makeChildAppender(ol.format.OWSContext.writeGeneral_),
      'ResourceList': ol.xml.makeChildAppender(
          ol.format.OWSContext.writeResourceList_)
    });


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.OWSContext.SERVER_PARSERS_ = ol.xml.makeParsersNS(
    ol.format.OWSContext.NAMESPACE_URIS_, {
      'OnlineResource': ol.xml.makeObjectPropertySetter(
          ol.format.XLink.readHref)
    });


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
ol.format.OWSContext.SLD_NAMESPACE_URIS_ = [
  'http://www.opengis.net/sld'
];


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
ol.format.OWSContext.XLINK_NAMESPACE_URIS_ = [
  'http://www.opengis.net/xlink'
];


/**
 * @const
 * @type {Array.<string>}
 * @private
 */
ol.format.OWSContext.XSI_NAMESPACE_URIS_ = [
  'http://www.opengis.net/xsi'
];
