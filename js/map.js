require([
  "esri/map",
  "dojox/mobile",
  "dojox/mobile/parser",
  "esri/sniff",
  "dojox/mobile/deviceTheme",
  "dojo/dom",
  "dijit/registry",
  "dojo/on",
  "dojox/mobile/ToolBarButton",
  "dojox/mobile/View",
  "dojox/mobile/ContentPane"
], function(Map, mobile, parser, has, dTheme, dom, registry, on) {
  parser.parse();
  mobile.hideAddressBar();

  var resizeEvt = (window.onorientationchange !== undefined && !has('android')) ? "orientationchange" : "resize";
  on(window, resizeEvt, resizeMap);

  function mapLoadHandler(evt) {
    resizeMap();
    registry.byId('mapView').on('AfterTransitionIn', resizeMap);
  }

  function resizeMap() {
    mobile.hideAddressBar();
    adjustMapHeight();
    map.resize();
    map.reposition();
  }

  function adjustMapHeight() {
    var availHeight = mobile.getScreenSize().h - registry.byId('header').domNode.clientHeight - 1;
    if (has('iphone') || has('ipod')) {
      availHeight += iphoneAdjustment();
    }
    dom.byId("map").style.height = availHeight + "px";
  }

  function iphoneAdjustment() {
    var sz = mobile.getScreenSize();
    if (sz.h > sz.w) { //portrait
      //Need to add address bar height back to map
      return screen.availHeight - window.innerHeight - 40;
      /* 40 = height of bottom safari toolbar */
    } else { //landscape
      //Need to react to full screen / bottom bar visible toggles
      var _conn = on(window, 'resize', function() {
        _conn.remove();
        resizeMap();
      });
      return 0;
    }
  }

  var map = new esri.Map("map", {
    basemap: "topo",
    center: [-99.341389, 33.532222],
    zoom: 7,
    slider: true
  });
  map.on("load", mapLoadHandler);

});
