import React, { Component } from 'react';
import PropTypes from 'prop-types';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var invariant = require('../vendor/invariant');
var constants = require('./constants');
var client = require('./client');
var getUser = require('./get_user');

/**
 * Services all have the same constructor pattern: you initialize them
 * with an access token and options, and they validate those arguments
 * in a predictable way. This is a constructor-generator that makes
 * it possible to require each service's API individually.
 *
 * @private
 * @param {string} name the name of the Mapbox API this class will access:
 * this is set to the name of the function so it will show up in tracebacks
 * @returns {Function} constructor function
 */
function makeService(name) {

  function service(accessToken, options) {
    this.name = name;

    invariant(typeof accessToken === 'string', 'accessToken required to instantiate Mapbox client');

    var endpoint = constants.DEFAULT_ENDPOINT;

    if (options !== undefined) {
      invariant((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');
      if (options.endpoint) {
        invariant(typeof options.endpoint === 'string', 'endpoint must be a string');
        endpoint = options.endpoint;
      }
      if (options.account) {
        invariant(typeof options.account === 'string', 'account must be a string');
        this.owner = options.account;
      }
    }

    this.client = client({
      endpoint: endpoint,
      accessToken: accessToken
    });

    this.accessToken = accessToken;
    this.endpoint = endpoint;
    this.owner = this.owner || getUser(accessToken);
    invariant(!!this.owner, 'could not determine account from provided accessToken');
  }

  return service;
}

module.exports = makeService;

var makeService$1 = /*#__PURE__*/Object.freeze({

});

/*
 * xtend by Jake Verbaten
 *
 * Licensed under MIT
 * https://github.com/Raynos/xtend
 */
var extendMutable_1 = extendMutable;
var extend_1 = extend;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extendMutable(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}

var xtend = {
	extendMutable: extendMutable_1,
	extend: extend_1
};

/*
 * Copyright (c) 2009 Nicholas C. Zakas. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint bitwise: false */

var digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Base64-encodes a string of text.
 *
 * @param {string} text The text to encode.
 * @return {string} The base64-encoded string.
 */
function base64Encode(text) {

	if (/([^\u0000-\u00ff])/.test(text)) {
		throw new Error('Can\'t base64 encode non-ASCII characters.');
	}

	var i = 0,
	    cur,
	    prev,
	    byteNum,
	    result = [];

	while (i < text.length) {

		cur = text.charCodeAt(i);
		byteNum = i % 3;

		switch (byteNum) {
			case 0:
				//first byte
				result.push(digits.charAt(cur >> 2));
				break;

			case 1:
				//second byte
				result.push(digits.charAt((prev & 3) << 4 | cur >> 4));
				break;

			case 2:
				//third byte
				result.push(digits.charAt((prev & 0x0f) << 2 | cur >> 6));
				result.push(digits.charAt(cur & 0x3f));
				break;
		}

		prev = cur;
		i += 1;
	}

	if (byteNum === 0) {
		result.push(digits.charAt((prev & 3) << 4));
		result.push('==');
	} else if (byteNum === 1) {
		result.push(digits.charAt((prev & 0x0f) << 2));
		result.push('=');
	}

	return result.join('');
}

/**
 * Base64-decodes a string of text.
 *
 * @param {string} text The text to decode.
 * @return {string} The base64-decoded string.
 */
function base64Decode(text) {

	//ignore white space
	text = text.replace(/\s/g, '');

	//first check for any unexpected input
	if (!/^[a-z0-9\+\/\s]+\={0,2}$/i.test(text) || text.length % 4 > 0) {
		throw new Error('Not a base64-encoded string.');
	}

	//local variables
	var cur,
	    prev,
	    digitNum,
	    i = 0,
	    result = [];

	//remove any equals signs
	text = text.replace(/\=/g, '');

	//loop over each character
	while (i < text.length) {

		cur = digits.indexOf(text.charAt(i));
		digitNum = i % 4;

		switch (digitNum) {

			//case 0: first digit - do nothing, not enough info to work with

			case 1:
				//second digit
				result.push(String.fromCharCode(prev << 2 | cur >> 4));
				break;

			case 2:
				//third digit
				result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
				break;

			case 3:
				//fourth digit
				result.push(String.fromCharCode((prev & 3) << 6 | cur));
				break;
		}

		prev = cur;
		i += 1;
	}

	//return a string
	return result.join('');
}

var base64 = {
	encode: base64Encode,
	decode: base64Decode
};

/**
 * Access tokens actually are data, and using them we can derive
 * a user's username. This method attempts to do just that,
 * decoding the part of the token after the first `.` into
 * a username.
 *
 * @private
 * @param {string} token an access token
 * @return {string} username
 */
function getUser$1(token) {
  var data = token.split('.')[1];
  if (!data) return null;
  data = data.replace(/-/g, '+').replace(/_/g, '/');

  var mod = data.length % 4;
  if (mod === 2) data += '==';
  if (mod === 3) data += '=';
  if (mod === 1 || mod > 3) return null;

  try {
    return JSON.parse(base64.decode(data)).u;
  } catch (err) {
    return null;
  }
}

var get_user = getUser$1;

var invariant$1 = require('../../vendor/invariant');
var makeService$2 = require('../make_service');

/**
 * @class MapboxGeocoding
 */
var MapboxGeocoding = makeService$2('MapboxGeocoding');

var API_GEOCODING_FORWARD = '/geocoding/v5/{dataset}/{query}.json{?access_token,proximity,country,types,bbox,limit,autocomplete,language}';
var API_GEOCODING_REVERSE = '/geocoding/v5/{dataset}/{longitude},{latitude}.json{?access_token,types,limit,language}';

var REVERSE_GEOCODING_PRECISION = 5;
var FORWARD_GEOCODING_PROXIMITY_PRECISION = 3;

function roundTo(value, places) {
  var mult = Math.pow(10, places);
  return Math.round(value * mult) / mult;
}

/**
 * Search for a location with a string, using the
 * [Mapbox Geocoding API](https://www.mapbox.com/api-documentation/#geocoding).
 *
 * The `query` parmeter can be an array of strings only if batch geocoding
 * is used by specifying `mapbox.places-permanent` as the `dataset` option.
 *
 * @param {string|Array<string>} query desired location
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {Object} options.proximity a proximity argument: this is
 * a geographical point given as an object with latitude and longitude
 * properties. Search results closer to this point will be given
 * higher priority.
 * @param {Array} options.bbox a bounding box argument: this is
 * a bounding box given as an array in the format [minX, minY, maxX, maxY].
 * Search results will be limited to the bounding box.
 * @param {Array<string>|string} options.language Specify the language to use for response text and, for forward geocoding, query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, as an array or separated by commas.
 * @param {Array<string>|string} options.types an array or comma seperated list of types that filter
 * results to match those specified. See https://www.mapbox.com/developers/api/geocoding/#filter-type
 * for available types.
 * @param {number} [options.limit=5] is the maximum number of results to return, between 1 and 10 inclusive.
 * Some very specific queries may return fewer results than the limit.
 * @param {Array<string>|string} options.country an array or comma separated list of country codes to
 * limit results to specified country or countries.
 * @param {boolean} [options.autocomplete=true] whether to include results that include
 * the query only as a prefix. This is useful for UIs where users type
 * values, but if you have complete addresses as input, you'll want to turn it off
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeForward('Paris, France', function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * // using the proximity option to weight results closer to texas
 * mapboxClient.geocodeForward('Paris, France', {
 *   proximity: { latitude: 33.6875431, longitude: -95.4431142 }
 * }, function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * // using the bbox option to limit results to a portion of Washington, D.C.
 * mapboxClient.geocodeForward('Starbucks', {
 *   bbox: [-77.083056,38.908611,-76.997778,38.959167]
 * }, function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxGeocoding.prototype.geocodeForward = function (query, options, callback) {
  // permit the options argument to be omitted, or the options + callback args to be omitted if using promise syntax
  if (callback === undefined && (options === undefined || typeof options === 'function')) {
    callback = options;
    options = {};
  }

  // typecheck arguments
  if (Array.isArray(query)) {
    if (options.dataset !== 'mapbox.places-permanent') {
      throw new Error('Batch geocoding is only available with the mapbox.places-permanent endpoint. See https://mapbox.com/api-documentation/#batch-requests for details');
    } else {
      query = query.join(';');
    }
  }
  invariant$1(typeof query === 'string', 'query must be a string');
  invariant$1((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  var queryOptions = {
    query: query,
    dataset: 'mapbox.places'
  };

  var precision = FORWARD_GEOCODING_PROXIMITY_PRECISION;
  if (options.precision) {
    invariant$1(typeof options.precision === 'number', 'precision option must be number');
    precision = options.precision;
  }

  if (options.proximity) {
    invariant$1(typeof options.proximity.latitude === 'number' && typeof options.proximity.longitude === 'number', 'proximity must be an object with numeric latitude & longitude properties');
    queryOptions.proximity = roundTo(options.proximity.longitude, precision) + ',' + roundTo(options.proximity.latitude, precision);
  }

  if (options.bbox) {
    invariant$1(typeof options.bbox[0] === 'number' && typeof options.bbox[1] === 'number' && typeof options.bbox[2] === 'number' && typeof options.bbox[3] === 'number' && options.bbox.length === 4, 'bbox must be an array with numeric values in the form [minX, minY, maxX, maxY]');
    queryOptions.bbox = options.bbox[0] + ',' + options.bbox[1] + ',' + options.bbox[2] + ',' + options.bbox[3];
  }

  if (options.limit) {
    invariant$1(typeof options.limit === 'number', 'limit must be a number');
    queryOptions.limit = options.limit;
  }

  if (options.dataset) {
    invariant$1(typeof options.dataset === 'string', 'dataset option must be string');
    queryOptions.dataset = options.dataset;
  }

  if (options.country) {
    if (Array.isArray(options.country)) {
      queryOptions.country = options.country.join(',');
    } else {
      invariant$1(typeof options.country === 'string', 'country option must be an array or string');
      queryOptions.country = options.country;
    }
  }

  if (options.language) {
    if (Array.isArray(options.language)) {
      queryOptions.language = options.language.join(',');
    } else {
      invariant$1(typeof options.language === 'string', 'language option must be an array or string');
      queryOptions.language = options.language;
    }
  }

  if (options.types) {
    if (Array.isArray(options.types)) {
      queryOptions.types = options.types.join(',');
    } else {
      invariant$1(typeof options.types === 'string', 'types option must be an array or string');
      queryOptions.types = options.types;
    }
  }

  if (typeof options.autocomplete === 'boolean') {
    invariant$1(typeof options.autocomplete === 'boolean', 'autocomplete must be a boolean');
    queryOptions.autocomplete = options.autocomplete;
  }

  return this.client({
    path: API_GEOCODING_FORWARD,
    params: queryOptions,
    callback: callback
  });
};

/**
 * Given a location, determine what geographical features are located
 * there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/api-documentation/#geocoding).
 *
 * @param {Object} location the geographical point to search
 * @param {number} location.latitude decimal degrees latitude, in range -90 to 90
 * @param {number} location.longitude decimal degrees longitude, in range -180 to 180
 * @param {Object} [options={}] additional options meant to tune
 * the request.
 * @param {Array<string>|string} options.language Specify the language to use for response text and, for forward geocoding, query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas or as an array.
 * @param {Array<string>|string} options.types an array or comma seperated list of types that filter
 * results to match those specified. See
 * https://www.mapbox.com/api-documentation/#retrieve-places-near-a-location
 * for available types.
 * @param {number} [options.limit=1] is the maximum number of results to return, between 1 and 5
 * inclusive. Requires a single options.types to be specified (see example).
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeReverse(
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeReverse(
 *   { latitude: 33.6875431, longitude: -95.4431142, options: { types: 'address', limit: 3 } },
 *   function(err, res) {
 *   // res is a GeoJSON document with up to 3 geocoding matches
 * });
 */
MapboxGeocoding.prototype.geocodeReverse = function (location, options, callback) {
  // permit the options argument to be omitted, or the options + callback args to be omitted if using promise syntax
  if (callback === undefined && (options === undefined || typeof options === 'function')) {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant$1((typeof location === 'undefined' ? 'undefined' : _typeof(location)) === 'object' && location !== null, 'location must be an object');
  invariant$1((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  invariant$1(typeof location.latitude === 'number' && typeof location.longitude === 'number', 'location must be an object with numeric latitude & longitude properties');

  var queryOptions = {
    dataset: 'mapbox.places'
  };

  if (options.dataset) {
    invariant$1(typeof options.dataset === 'string', 'dataset option must be string');
    queryOptions.dataset = options.dataset;
  }

  var precision = REVERSE_GEOCODING_PRECISION;
  if (options.precision) {
    invariant$1(typeof options.precision === 'number', 'precision option must be number');
    precision = options.precision;
  }

  if (options.language) {
    if (Array.isArray(options.language)) {
      queryOptions.language = options.language.join(',');
    } else {
      invariant$1(typeof options.language === 'string', 'language option must be an array or string');
      queryOptions.language = options.language;
    }
  }

  if (options.types) {
    if (Array.isArray(options.types)) {
      queryOptions.types = options.types.join(',');
    } else {
      invariant$1(typeof options.types === 'string', 'types option must be an array or string');
      queryOptions.types = options.types;
    }
  }

  if (options.limit) {
    invariant$1(typeof options.limit === 'number', 'limit option must be a number');
    invariant$1(options.types.split(',').length === 1, 'a single type must be specified to use the limit option');
    queryOptions.limit = options.limit;
  }

  queryOptions.longitude = roundTo(location.longitude, precision);
  queryOptions.latitude = roundTo(location.latitude, precision);

  return this.client({
    path: API_GEOCODING_REVERSE,
    params: queryOptions,
    callback: callback
  });
};

module.exports = MapboxGeocoding;

var geocoding = /*#__PURE__*/Object.freeze({

});

var invariant$2 = require('../../vendor/invariant');
var formatPoints = require('../format_points');
var makeService$3 = require('../make_service');

/**
 * @class MapboxSurface
 */
var MapboxSurface = makeService$3('MapboxSurface');

var API_SURFACE = '/v4/surface/{mapid}.json{?access_token,layer,fields,points,geojson,interpolate,encoded_polyline}';

/**
 * Given a list of locations, retrieve vector tiles, find the nearest
 * spatial features, extract their data values, and then absolute values and
 * optionally interpolated values in-between, if the interpolate option is specified.
 *
 * Consult the [Surface API](https://www.mapbox.com/developers/api/surface/)
 * for more documentation.
 *
 * @param {string} mapid a Mapbox mapid containing vector tiles against
 * which we'll query
 * @param {string} layer layer within the given `mapid` for which to pull
 * data
 * @param {Array<string>} fields layer within the given `mapid` for which to pull
 * data
 * @param {Array<Object>|string} path either an encoded polyline,
 * provided as a string, or an array of objects with longitude and latitude
 * properties, similar to waypoints.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.geojson=false] whether to return data as a
 * GeoJSON point
 * @param {string} [options.zoom=maximum] zoom level at which features
 * are queried
 * @param {boolean} [options.interpolate=true] Whether to interpolate
 * between matches in the feature collection.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxSurface.prototype.surface = function (mapid, layer, fields, path, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant$2(typeof mapid === 'string', 'mapid must be a string');
  invariant$2(typeof layer === 'string', 'layer must be a string');
  invariant$2(Array.isArray(fields), 'fields must be an array of strings');
  invariant$2(Array.isArray(path) || typeof path === 'string', 'path must be an array of objects or a string');
  invariant$2((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  var interpolate = true,
      geojson = false;

  if (options.interpolate !== undefined) {
    invariant$2(typeof options.interpolate === 'boolean', 'interpolate must be a boolean');
    interpolate = options.interpolate;
  }

  if (options.geojson !== undefined) {
    invariant$2(typeof options.geojson === 'boolean', 'geojson option must be boolean');
    geojson = options.geojson;
  }

  var surfaceOptions = {
    geojson: geojson,
    layer: layer,
    mapid: mapid,
    fields: fields.join(','),
    interpolate: interpolate
  };

  if (Array.isArray(path)) {
    surfaceOptions.points = formatPoints(path);
  } else {
    surfaceOptions.encoded_polyline = path;
  }

  if (options.zoom !== undefined) {
    invariant$2(typeof options.zoom === 'number', 'zoom must be a number');
    surfaceOptions.z = options.zoom;
  }

  return this.client({
    path: API_SURFACE,
    params: surfaceOptions,
    callback: callback
  });
};

module.exports = MapboxSurface;

var surface = /*#__PURE__*/Object.freeze({

});

var invariant$3 = require('../../vendor/invariant');
var formatPoints$1 = require('../format_points');
var makeService$4 = require('../make_service');

/**
 * @class MapboxDirections
 */
var MapboxDirections = makeService$4('MapboxDirections');

var API_DIRECTIONS = '/directions/v5/{account}/{profile}/{encodedWaypoints}.json{?access_token,alternatives,geometries,overview,radiuses,steps,continue_straight,bearings}';

/**
 * Find directions from A to B, or between any number of locations.
 * Consult the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions)
 * for more documentation.
 *
 * @param {Array<Object>} waypoints an array of objects with `latitude`
 * and `longitude` properties that represent waypoints in order. Up to
 * 25 waypoints can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving-traffic'` for automotive routing which factors
 * in current and historic traffic conditions to avoid slowdowns,
 * `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.account=mapbox] Account for the profile.
 * @param {string} [options.alternatives=true] whether to generate
 * alternative routes along with the preferred route.
 * @param {string} [options.geometries=geojson] format for the returned
 * route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
 * yields more compact responses which can be decoded on the client side.
 * [GeoJSON](http://geojson.org/), the default, is compatible with libraries
 * like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
 * Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
 * omits the geometry entirely and only returns instructions.
 * @param {string} [options.overview=simplified] type of returned overview
 * geometry. Can be `full` (the most detailed geometry available), `simplified`
 * (a simplified version of the full geometry), or `false`.
 * @param {Array<number|string>} [options.radiuses] an array of integers in meters
 * indicating the maximum distance each coordinate is allowed to move when
 * snapped to a nearby road segment. There must be as many radiuses as there
 * are coordinates in the request. Values can be any number greater than `0` or
 * they can be the string `unlimited`. If no routable road is found within the
 * radius, a `NoSegment` error is returned.
 * @param {boolean} [options.steps=false] whether to return steps and
 * turn-by-turn instructions. Can be `true` or `false`.
 * @param {boolean} [options.continue_straight] sets allowed direction of travel
 * when departing intermediate waypoints. If `true` the route will continue in
 * the same direction of travel. If `false` the route may continue in the
 * opposite direction of travel. Defaults to `true` for the `driving` profile
 * and `false` for the `walking` and `cycling` profiles.
 * @param {Array<Array>} [options.bearings] used to filter the road
 * segment the waypoint will be placed on by direction and dictates the angle
 * of approach. This option should always be used in conjunction with the
 * `radiuses` option. The parameter takes two values per waypoint: the first is
 * an angle clockwise from true north between `0` and `360`. The second is the
 * range of degrees the angle can deviate by. We recommend a value of `45` or
 * `90` for the range, as bearing measurements tend to be inaccurate. This is
 * useful for making sure we reroute vehicles on new routes that continue
 * traveling in their current direction. A request that does this would provide
 * bearing and radius values for the first waypoint and leave the remaining
 * values empty.If provided, the list of bearings must be the same length as
 * the list of waypoints, but you can skip a coordinate and show its position
 * by providing an empty array.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.getDirections(
 *   [
 *     { latitude: 33.6, longitude: -95.4431 },
 *     { latitude: 33.2, longitude: -95.4431 } ],
 *   function(err, res) {
 *   // res is a document with directions
 * });
 *
 * // With options
 * mapboxClient.getDirections([
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   { latitude: 33.6875431, longitude: -95.4831142 }
 * ], {
 *   profile: 'walking',
 *   alternatives: false,
 *   geometry: 'polyline'
 * }, function(err, results) {
 *   console.log(results);
 * });
 */
MapboxDirections.prototype.getDirections = function (waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  } else if (options === undefined) {
    options = {};
  }

  // typecheck arguments
  invariant$3(Array.isArray(waypoints), 'waypoints must be an array');
  invariant$3((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  var encodedWaypoints = formatPoints$1(waypoints);

  var params = {
    encodedWaypoints: encodedWaypoints,
    profile: 'driving',
    account: 'mapbox',
    alternatives: true,
    steps: true,
    geometries: 'geojson'
  };

  if (options.profile) {
    invariant$3(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  if (options.account) {
    invariant$3(typeof options.account === 'string', 'account option must be string');
    params.account = options.account;
  }

  if (typeof options.alternatives !== 'undefined') {
    invariant$3(typeof options.alternatives === 'boolean', 'alternatives option must be boolean');
    params.alternatives = options.alternatives;
  }

  if (options.radiuses) {
    invariant$3(Array.isArray(options.radiuses), 'radiuses must be an array');
    invariant$3(options.radiuses.length === waypoints.length, 'There must be as many radiuses as there are waypoints in the request');
    params.radiuses = options.radiuses.join(';');
  }

  if (typeof options.steps !== 'undefined') {
    invariant$3(typeof options.steps === 'boolean', 'steps option must be boolean');
    params.steps = options.steps;
  }

  var allowedGeometries = ['polyline', 'geojson'];
  if (options.geometries) {
    invariant$3(allowedGeometries.indexOf(options.geometries) !== -1, 'geometries option must be ' + allowedGeometries);
    params.geometries = options.geometries;
  }

  var allowedOverviews = ['simplified', 'full'];
  if (options.overview) {
    invariant$3(allowedOverviews.indexOf(options.overview) !== -1, 'overview option must be ' + allowedOverviews);
    params.overview = options.overview;
  }

  if (typeof options.continue_straight !== 'undefined') {
    invariant$3(typeof options.continue_straight === 'boolean', 'continue_straight option must be boolean');
    params.continue_straight = options.continue_straight;
  }

  if (options.bearings) {
    invariant$3(Array.isArray(options.radiuses), 'bearings must be an array');
    invariant$3(options.bearings.length === waypoints.length, 'There must be as many bearings as there are waypoints in the request');
    params.bearings = options.bearings.join(';');
  }

  return this.client({
    path: API_DIRECTIONS,
    params: params,
    callback: callback
  });
};

module.exports = MapboxDirections;

var directions = /*#__PURE__*/Object.freeze({

});

var invariant$4 = require('../../vendor/invariant');
var makeService$5 = require('../make_service');

/**
 * @class MapboxUploads
 */
var MapboxUploads = module.exports = makeService$5('MapboxUploads');

var API_UPLOADS = '/uploads/v1/{owner}{?access_token}';
var API_UPLOAD = '/uploads/v1/{owner}/{upload}{?access_token}';
var API_UPLOAD_CREDENTIALS = '/uploads/v1/{owner}/credentials{?access_token}';

/**
 * Retrieve a listing of uploads for a particular account.
 *
 * This request requires an access token with the uploads:list scope.
 *
 * @param {Function} callback called with (err, uploads)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.listUploads(function(err, uploads) {
 *   console.log(uploads);
 *   // [
 *   //   {
 *   //     "complete": true,
 *   //     "tileset": "example.mbtiles",
 *   //     "error": null,
 *   //     "id": "abc123",
 *   //     "modified": "2014-11-21T19:41:10.000Z",
 *   //     "created": "2014-11-21T19:41:10.000Z",
 *   //     "owner": "example",
 *   //     "progress": 1
 *   //   },
 *   //   {
 *   //     "complete": false,
 *   //     "tileset": "example.foo",
 *   //     "error": null,
 *   //     "id": "xyz789",
 *   //     "modified": "2014-11-21T19:41:10.000Z",
 *   //     "created": "2014-11-21T19:41:10.000Z",
 *   //     "owner": "example",
 *   //     "progress": 0
 *   //   }
 *   // ]
 * });
 */
MapboxUploads.prototype.listUploads = function (callback) {
  return this.client({
    path: API_UPLOADS,
    params: { owner: this.owner },
    callback: callback
  });
};

/**
 * Retrieve credentials that allow a new file to be staged on Amazon S3
 * while an upload is processed. All uploads must be staged using these
 * credentials before being uploaded to Mapbox.
 *
 * This request requires an access token with the uploads:write scope.
 *
 * @param {Function} callback called with (err, credentials)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.createUploadCredentials(function(err, credentials) {
 *   console.log(credentials);
 *   // {
 *   //   "accessKeyId": "{accessKeyId}",
 *   //   "bucket": "somebucket",
 *   //   "key": "hij456",
 *   //   "secretAccessKey": "{secretAccessKey}",
 *   //   "sessionToken": "{sessionToken}",
 *   //   "url": "{s3 url}"
 *   // }
 *
 *   // Use aws-sdk to stage the file on Amazon S3
 *   var AWS = require('aws-sdk');
 *   var s3 = new AWS.S3({
 *        accessKeyId: credentials.accessKeyId,
 *        secretAccessKey: credentials.secretAccessKey,
 *        sessionToken: credentials.sessionToken,
 *        region: 'us-east-1'
 *   });
 *   s3.putObject({
 *     Bucket: credentials.bucket,
 *     Key: credentials.key,
 *     Body: fs.createReadStream('/path/to/file.mbtiles')
 *   }, function(err, resp) {
 *   });
 * });
 */
MapboxUploads.prototype.createUploadCredentials = function (callback) {
  return this.client({
    path: API_UPLOAD_CREDENTIALS,
    params: { owner: this.owner },
    method: 'post',
    callback: callback
  });
};

/**
 * Create an new upload with a file previously staged on Amazon S3.
 *
 * This request requires an access token with the uploads:write scope.
 *
 * @param {Object} options an object that defines the upload's properties
 * @param {String} options.tileset id of the tileset to create or
 * replace. This must consist of an account id and a unique key
 * separated by a period. Reuse of a tileset value will overwrite
 * existing data. To avoid overwriting existing data, you must ensure
 * that you are using unique tileset ids.
 * @param {String} options.url https url of a file staged on Amazon S3.
 * @param {Function} callback called with (err, upload)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * // Response from a call to createUploadCredentials
 * var credentials = {
 *   "accessKeyId": "{accessKeyId}",
 *   "bucket": "somebucket",
 *   "key": "hij456",
 *   "secretAccessKey": "{secretAccessKey}",
 *   "sessionToken": "{sessionToken}",
 *   "url": "{s3 url}"
 * };
 * mapboxClient.createUpload({
 *    tileset: [accountid, 'mytileset'].join('.'),
 *    url: credentials.url
 * }, function(err, upload) {
 *   console.log(upload);
 *   // {
 *   //   "complete": false,
 *   //   "tileset": "example.markers",
 *   //   "error": null,
 *   //   "id": "hij456",
 *   //   "modified": "2014-11-21T19:41:10.000Z",
 *   //   "created": "2014-11-21T19:41:10.000Z",
 *   //   "owner": "example",
 *   //   "progress": 0
 *   // }
 * });
 */
MapboxUploads.prototype.createUpload = function (options, callback) {
  invariant$4((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  return this.client({
    path: API_UPLOADS,
    params: { owner: this.owner },
    entity: options,
    callback: callback
  });
};

/**
 * Retrieve state of an upload.
 *
 * This request requires an access token with the uploads:read scope.
 *
 * @param {String} upload id of the upload to read
 * @param {Function} callback called with (err, upload)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.readUpload('hij456', function(err, upload) {
 *   console.log(upload);
 *   // {
 *   //   "complete": true,
 *   //   "tileset": "example.markers",
 *   //   "error": null,
 *   //   "id": "hij456",
 *   //   "modified": "2014-11-21T19:41:10.000Z",
 *   //   "created": "2014-11-21T19:41:10.000Z",
 *   //   "owner": "example",
 *   //   "progress": 1
 *   // }
 * });
 */
MapboxUploads.prototype.readUpload = function (upload, callback) {
  invariant$4(typeof upload === 'string', 'upload must be a string');

  return this.client({
    path: API_UPLOAD,
    params: {
      owner: this.owner,
      upload: upload
    },
    callback: callback
  });
};

/**
 * Delete a completed upload. In-progress uploads cannot be deleted.
 *
 * This request requires an access token with the uploads:delete scope.
 *
 * @param {string} upload upload identifier
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.deleteUpload('hij456', function(err) {
 * });
 */
MapboxUploads.prototype.deleteUpload = function (upload, callback) {
  invariant$4(typeof upload === 'string', 'upload must be a string');

  return this.client({
    method: 'delete',
    path: API_UPLOAD,
    params: {
      owner: this.owner,
      upload: upload
    },
    callback: callback
  });
};

var uploads = /*#__PURE__*/Object.freeze({

});

/*
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/*
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant$5 = function invariant(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant$5;

/**
 * @class MapboxMatching
 */
var MapboxMatching = makeService$1('MapboxMatching');

var API_MATCHING = '/matching/v5/{account}/{profile}/{coordinates}.json{?access_token,geometries,radiuses,steps,overview,timestamps,annotations}';

/**
 * Snap recorded location traces to roads and paths from OpenStreetMap.
 * Consult the [Map Matching API](https://www.mapbox.com/api-documentation/#map-matching)
 * for more documentation.
 *
 * @param {Array<Array<number>>} coordinates an array of coordinate pairs
 * in [longitude, latitude] order. Up to 100 coordinates can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.geometries=geojson] format of the returned geometry.
 * Allowed values are: `'geojson'` (as LineString), `'polyline'` with
 * precision 5, `'polyline6'`. `'polyline'` yields more compact responses which
 * can be decoded on the client side. [GeoJSON](http://geojson.org/), the
 * default, is compatible with libraries like
 * [Mapbox GL](https://www.mapbox.com/mapbox-gl/), Leaflet and
 * [Mapbox.js](https://www.mapbox.com/mapbox.js/).
 * @param {Array<number>} [options.radiuses] an array of integers in meters
 * indicating the assumed precision of the used tracking device. There must be
 * as many radiuses as there are coordinates in the request. Values can be a
 * number between 0 and 30. Use higher numbers (20-30) for noisy traces and
 * lower numbers (1-10) for clean traces. The default value is 5.
 * @param {boolean} [options.steps=false] Whether to return steps and
 * turn-by-turn instructions. Can be `true` or `false`.
 * @param {string|boolean} [options.overview=simplified] type of returned
 * overview geometry. Can be `'full'` (the most detailed geometry available),
 * `'simplified'` (a simplified version of the full geometry), or `false`.
 * @param {Array<number>} [options.timestamps] an array of timestamps
 * corresponding to each coordinate provided in the request; must be numbers in
 * [Unix time](https://en.wikipedia.org/wiki/Unix_time)
 * (seconds since the Unix epoch). There must be as many timestamps as there
 * are coordinates in the request.
 * @param {Array<string>} [options.annotations] an array of fields that return
 * additional metadata for each coordinate along the match geometry. Can be any
 * of `'duration'`, `'distance'`, or `'nodes'`.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.matching([
 *   [-95.4431142, 33.6875431],
 *   [-95.0431142, 33.6875431],
 *   [-95.0431142, 33.0875431],
 *   [-95.0431142, 33.0175431],
 *   [-95.4831142, 33.6875431]
 * ], {
 *  overview: 'full'
 * }, function(err, res) {
 *   // res is a match response object
 * });
 */
MapboxMatching.prototype.matching = function (coordinates, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant_1(Array.isArray(coordinates), 'coordinates must be an array');

  var params = {
    profile: 'driving',
    account: 'mapbox',
    geometries: 'geojson',
    coordinates: coordinates.join(';')
  };

  if (options.profile) {
    invariant_1(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  var allowedGeometries = ['polyline', 'geojson'];
  if (options.geometries) {
    invariant_1(allowedGeometries.indexOf(options.geometries) !== -1, 'geometries option must be ' + allowedGeometries);
    params.geometries = options.geometries;
  }

  if (options.radiuses) {
    invariant_1(Array.isArray(options.radiuses), 'radiuses must be an array');
    invariant_1(options.radiuses.length === coordinates.length, 'There must be as many radiuses as there are coordinates in the request');
    params.radiuses = options.radiuses.join(';');
  }

  if (typeof options.steps !== 'undefined') {
    invariant_1(typeof options.steps === 'boolean', 'steps option must be boolean');
    params.steps = options.steps;
  }

  var allowedOverview = ['full', 'simplified'];
  if (typeof options.overview !== 'undefined') {
    invariant_1(allowedOverview.indexOf(options.overview) !== -1 || options.overview === false, 'overview option must be ' + allowedOverview + ' or false');
    params.overview = options.overview;
  }

  if (options.timestamps) {
    invariant_1(Array.isArray(options.timestamps), 'timestamps must be an array');
    invariant_1(options.timestamps.length === coordinates.length, 'There must be as many timestamps as there are coordinates in the request');
    params.timestamps = options.timestamps.join(';');
  }

  if (options.annotations) {
    invariant_1(Array.isArray(options.annotations), 'annotations must be an array');
    params.annotations = options.annotations.join();
  }

  return this.client({
    path: API_MATCHING,
    params: params,
    method: 'get',
    callback: callback
  });
};

var matching = MapboxMatching;

var invariant$6 = require('../../vendor/invariant');
var hat = require('../../vendor/hat');
var makeService$6 = require('../make_service');

/**
 * @class MapboxDatasets
 */
var MapboxDatasets = module.exports = makeService$6('MapboxDatasets');

var API_DATASET_DATASETS = '/datasets/v1/{owner}{?access_token,limit,fresh}';
var API_DATASET_DATASET = '/datasets/v1/{owner}/{dataset}{?access_token}';
var API_DATASET_FEATURES = '/datasets/v1/{owner}/{dataset}/features{?access_token,limit}';
var API_DATASET_FEATURE = '/datasets/v1/{owner}/{dataset}/features/{id}{?access_token}';

/**
 * To retrieve a listing of datasets for a particular account.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {Object} [opts={}] list options
 * @param {number} opts.limit limit, for paging
 * @param {boolean} opts.fresh whether to request fresh data
 * @param {Function} callback called with (err, datasets)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listDatasets(function(err, datasets) {
 *   console.log(datasets);
 *   // [
 *   //   {
 *   //     "owner": {account},
 *   //     "id": {dataset id},
 *   //     "name": {dataset name},
 *   //     "description": {dataset description},
 *   //     "created": {timestamp},
 *   //     "modified": {timestamp}
 *   //   },
 *   //   {
 *   //     "owner": {account},
 *   //     "id": {dataset id},
 *   //     "name": {dataset name},
 *   //     "description": {dataset description},
 *   //     "created": {timestamp},
 *   //     "modified": {timestamp}
 *   //   }
 *   // ]
 * });
 */
MapboxDatasets.prototype.listDatasets = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return this.client({
    path: API_DATASET_DATASETS,
    params: {
      limit: opts.limit,
      fresh: opts.fresh,
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * To create a new dataset. Valid properties include title and description (not required).
 * This request requires an access token with the datasets:write scope.
 *
 * @param {object} [options] an object defining a dataset's properties
 * @param {string} [options.name] the dataset's name
 * @param {string} [options.description] the dataset's description
 * @param {Function} callback called with (err, dataset)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createDataset({ name: 'foo', description: 'bar' }, function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": {dataset id},
 *   //   "name": "foo",
 *   //   "description": "description",
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
MapboxDatasets.prototype.createDataset = function (options, callback) {
  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  invariant$6((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  return this.client({
    path: API_DATASET_DATASETS,
    params: {
      owner: this.owner
    },
    entity: options,
    callback: callback
  });
};

/**
 * To retrieve information about a particular dataset.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, dataset)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readDataset('dataset-id', function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": "dataset-id",
 *   //   "name": {dataset name},
 *   //   "description": {dataset description},
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
MapboxDatasets.prototype.readDataset = function (dataset, callback) {
  invariant$6(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    callback: callback
  });
};

/**
 * To make updates to a particular dataset's properties.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {object} [options] an object defining updates to the dataset's properties
 * @param {string} [options.name] the updated dataset's name
 * @param {string} [options.description] the updated dataset's description
 * @param {Function} callback called with (err, dataset)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var options = { name: 'foo' };
 * client.updateDataset('dataset-id', options, function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": "dataset-id",
 *   //   "name": "foo",
 *   //   "description": {dataset description},
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
MapboxDatasets.prototype.updateDataset = function (dataset, options, callback) {
  invariant$6(typeof dataset === 'string', 'dataset must be a string');
  invariant$6((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');
  invariant$6(!!options.name || !!options.description, 'options must include a name or a description');

  return this.client({
    path: API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    method: 'patch',
    entity: options,
    callback: callback
  });
};

/**
 * To delete a particular dataset.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteDataset('dataset-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxDatasets.prototype.deleteDataset = function (dataset, callback) {
  invariant$6(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Retrive a list of the features in a particular dataset. The response body will be a GeoJSON FeatureCollection.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {object} [options] an object for passing pagination arguments
 * @param {number} [options.limit] The maximum number of objects to return. This value must be between 1 and 100. The API will attempt to return the requested number of objects, but receiving fewer objects does not necessarily signal the end of the collection. Receiving an empty page of results is the only way to determine when you are at the end of a collection.
 * @param {Function} callback called with (err, collection)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listFeatures('dataset-id', options, function(err, collection) {
 *   console.log(collection);
 *   {
 *     "type": "FeatureCollection",
 *     "features": [
 *       {
 *         "id": {feature id},
 *         "type": "Feature",
 *         "properties": {feature properties}
 *         "geometry": {feature geometry}
 *       },
 *       {
 *         "id": {feature id},
 *         "type": "Feature",
 *         "properties": {feature properties}
 *         "geometry": {feature geometry}
 *       }
 *     ]
 *   }
 * });
 */
MapboxDatasets.prototype.listFeatures = function (dataset, options, callback) {
  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  invariant$6(typeof dataset === 'string', 'dataset must be a string');
  invariant$6((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be a object');

  var params = {
    owner: this.owner,
    dataset: dataset
  };

  if (options.limit) {
    invariant$6(typeof options.limit === 'number', 'limit option must be a number');
    params.limit = options.limit;
  }

  return this.client({
    path: API_DATASET_FEATURES,
    params: params,
    callback: callback
  });
};

/**
 * Insert a feature into a dataset. This can be a new feature, or overwrite an existing one.
 * If overwriting an existing feature, make sure that the feature's `id` property correctly identifies
 * the feature you wish to overwrite.
 * For new features, specifying an `id` is optional. If you do not specify an `id`, one will be assigned
 * and returned as part of the response.
 * This request requires an access token with the datasets:write scope.
 * There are a number of limits to consider when making this request:
 *   - a single feature cannot be larger than 500 KB
 *   - the dataset must not exceed 2000 total features
 *   - the dataset must not exceed a total of 5 MB
 *
 * @param {object} feature the feature to insert. Must be a valid GeoJSON feature per http://geojson.org/geojson-spec.html#feature-objects
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, feature)
 * @returns {Promise} response
 * @example
 * // Insert a brand new feature without an id
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var feature = {
 *   "type": "Feature",
 *   "properties": {
 *     "name": "Null Island"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [0, 0]
 *   }
 * };
 * client.insertFeature(feature, 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": {feature id},
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 * @example
 * // Insert a brand new feature with an id, or overwrite an existing feature at that id
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var feature = {
 *   "id": "feature-id",
 *   "type": "Feature",
 *   "properties": {
 *     "name": "Null Island"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [0, 0]
 *   }
 * };
 * client.insertFeature(feature, 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": "feature-id",
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 */
MapboxDatasets.prototype.insertFeature = function (feature, dataset, callback) {
  invariant$6(typeof dataset === 'string', 'dataset must be a string');

  var id = feature.id || hat();
  invariant$6(typeof id === 'string', 'The GeoJSON feature\'s id must be a string');

  return this.client({
    path: API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    method: 'put',
    entity: feature,
    callback: callback
  });
};

/**
 * Read an existing feature from a dataset.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} id the `id` of the feature to read
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, feature)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readFeature('feature-id', 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": "feature-id",
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 */
MapboxDatasets.prototype.readFeature = function (id, dataset, callback) {
  invariant$6(typeof id === 'string', 'id must be a string');
  invariant$6(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    callback: callback
  });
};

/**
 * Delete an existing feature from a dataset.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} id the `id` of the feature to delete
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteFeature('feature-id', 'dataset-id', function(err, feature) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxDatasets.prototype.deleteFeature = function (id, dataset, callback) {
  invariant$6(typeof id === 'string', 'id must be a string');
  invariant$6(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    method: 'delete',
    callback: callback
  });
};

var datasets = /*#__PURE__*/Object.freeze({

});

var invariant$7 = require('../../vendor/invariant');
var formatPoints$2 = require('../format_points');
var makeService$7 = require('../make_service');

/**
 * @class MapboxMatrix
 */
var MapboxMatrix = makeService$7('MapboxMatrix');

var API_MATRIX = '/directions-matrix/v1/mapbox/{profile}/{encodedWaypoints}.json{?access_token}';

/**
 * Compute a table of travel-time estimates between a set of waypoints.
 * Consult the [Mapbox Matrix API](https://www.mapbox.com/api-documentation/#matrix)
 * for more documentation and limits.
 *
 * @param {Array<Object>} waypoints an array of coordinate objects
 * in the form `{longitude: 0, latitude: 0}`.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle. The `'driving-traffic'` profile is not supported.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * // Without options
 * mapboxClient.getMatrix([{
 *   longitude: -122.42,
 *   latitude: 37.78
 * },
 * {
 *   longitude: -122.45,
 *   latitude: 37.91
 * },
 * {
 *   longitude: -122.48,
 *   latitude: 37.73
 * }], {
 * }, function(err, results) {
 *   console.log(results);
 * });
 *
 * // With options
 * mapboxClient.getMatrix([{
 *   longitude: -122.42,
 *   latitude: 37.78
 * },
 * {
 *   longitude: -122.45,
 *   latitude: 37.91
 * },
 * {
 *   longitude: -122.48,
 *   latitude: 37.73
 * }], { profile: 'walking' }, {
 * }, function(err, results) {
 *   console.log(results);
 * });
 *
 * // Results is an object like:
 * { durations:
 *   [ [ 0, 1196, 3977, 3415, 5196 ],
 *     [ 1207, 0, 3775, 3213, 4993 ],
 *     [ 3976, 3774, 0, 2650, 2579 ],
 *     [ 3415, 3212, 2650, 0, 3869 ],
 *     [ 5208, 5006, 2579, 3882, 0 ] ] }
 *
 * // If the coordinates include an un-routable place, then
 * // the table may contain 'null' values to indicate this, like
 * { durations:
 *   [ [ 0, 11642, 57965, null, 72782 ],
 *     [ 11642, 0, 56394, null, 69918 ],
 *     [ 57965, 56394, 0, null, 19284 ],
 *     [ null, null, null, 0, null ],
 *     [ 72782, 69918, 19284, null, 0 ] ] }
 */

MapboxMatrix.prototype.getMatrix = function (waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  } else if (options === undefined) {
    options = {};
  }

  // typecheck arguments
  invariant$7(Array.isArray(waypoints), 'waypoints must be an array');
  invariant$7((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  var encodedWaypoints = formatPoints$2(waypoints);

  var params = {
    encodedWaypoints: encodedWaypoints,
    profile: 'driving'
  };

  if (options.profile) {
    invariant$7(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  return this.client({
    path: API_MATRIX,
    params: params,
    callback: callback
  });
};

module.exports = MapboxMatrix;

var matrix = /*#__PURE__*/Object.freeze({

});

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var tilestats = createCommonjsModule(function (module) {




/**
 * @class MapboxTilestats
 */
var MapboxTilestats = module.exports = makeService$1('MapboxTilestats');

var API_TILESTATS_STATISTICS = '/tilestats/v1/{owner}/{tileset}{?access_token}';

/**
 * To retrieve statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {Function} callback called with (err, tilestats)
 * @returns {Promise} response
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, info) {
 *   console.log(info);
 *   // {
 *   //   "layerCount": {layer count},
 *   //   "layers": [
 *   //     {
 *   //       "layer": {layer name},
 *   //       "geometry": {dominant geometry},
 *   //       "count": {feature count},
 *   //       "attributeCount": {attribute count}
 *   //       "attributes": [
 *   //         {
 *   //           "attribute": {attribute name},
 *   //           "type": {attribute type},
 *   //           "count": {unique value count},
 *   //           "min": {minimum value if type is number},
 *   //           "max": {maximum value if type is number},
 *   //           "values": [{...unique values}]
 *   //         }
 *   //       ]
 *   //     }
 *   //   ]
 *   // }
 * });
 */
MapboxTilestats.prototype.getTilestats = function (tileset, callback) {
  invariant_1(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    callback: callback
  });
};

/**
 * To create or update statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {object} statistics - the statistics to upload
 * @param {Function} callback called with (err, tilestats)
 * @returns {Promise} response
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, stats) {
 *   console.log(stats);
 *   // {
 *   //   "account": {account}
 *   //   ... see stats example above (for Tilestats#getTilestats)
 *   // }
 * });
 */
MapboxTilestats.prototype.putTilestats = function (tileset, statistics, callback) {
  invariant_1(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    entity: statistics,
    method: 'put',
    callback: callback
  });
};
});

/*
 * Copyright 2015-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var uriEncoder, operations, prefixRE;

uriEncoder = require('./uriEncoder');

prefixRE = /^([^:]*):([0-9]+)$/;
operations = {
	'': { first: '', separator: ',', named: false, empty: '', encoder: uriEncoder.encode },
	'+': { first: '', separator: ',', named: false, empty: '', encoder: uriEncoder.encodeURL },
	'#': { first: '#', separator: ',', named: false, empty: '', encoder: uriEncoder.encodeURL },
	'.': { first: '.', separator: '.', named: false, empty: '', encoder: uriEncoder.encode },
	'/': { first: '/', separator: '/', named: false, empty: '', encoder: uriEncoder.encode },
	';': { first: ';', separator: ';', named: true, empty: '', encoder: uriEncoder.encode },
	'?': { first: '?', separator: '&', named: true, empty: '=', encoder: uriEncoder.encode },
	'&': { first: '&', separator: '&', named: true, empty: '=', encoder: uriEncoder.encode },
	'=': { reserved: true },
	',': { reserved: true },
	'!': { reserved: true },
	'@': { reserved: true },
	'|': { reserved: true }
};

function apply(operation, expression, params) {
	/*jshint maxcomplexity:11 */
	return expression.split(',').reduce(function (result, variable) {
		var opts, value;

		opts = {};
		if (variable.slice(-1) === '*') {
			variable = variable.slice(0, -1);
			opts.explode = true;
		}
		if (prefixRE.test(variable)) {
			var prefix = prefixRE.exec(variable);
			variable = prefix[1];
			opts.maxLength = parseInt(prefix[2]);
		}

		variable = uriEncoder.decode(variable);
		value = params[variable];

		if (value === void 0 || value === null) {
			return result;
		}
		if (Array.isArray(value)) {
			result = value.reduce(function (result, value) {
				if (result.length) {
					result += opts.explode ? operation.separator : ',';
					if (operation.named && opts.explode) {
						result += operation.encoder(variable);
						result += value.length ? '=' : operation.empty;
					}
				} else {
					result += operation.first;
					if (operation.named) {
						result += operation.encoder(variable);
						result += value.length ? '=' : operation.empty;
					}
				}
				result += operation.encoder(value);
				return result;
			}, result);
		} else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
			result = Object.keys(value).reduce(function (result, name) {
				if (result.length) {
					result += opts.explode ? operation.separator : ',';
				} else {
					result += operation.first;
					if (operation.named && !opts.explode) {
						result += operation.encoder(variable);
						result += value[name].length ? '=' : operation.empty;
					}
				}
				result += operation.encoder(name);
				result += opts.explode ? '=' : ',';
				result += operation.encoder(value[name]);
				return result;
			}, result);
		} else {
			value = String(value);
			if (opts.maxLength) {
				value = value.slice(0, opts.maxLength);
			}
			result += result.length ? operation.separator : operation.first;
			if (operation.named) {
				result += operation.encoder(variable);
				result += value.length ? '=' : operation.empty;
			}
			result += operation.encoder(value);
		}

		return result;
	}, '');
}

function expandExpression(expression, params) {
	var operation;

	operation = operations[expression.slice(0, 1)];
	if (operation) {
		expression = expression.slice(1);
	} else {
		operation = operations[''];
	}

	if (operation.reserved) {
		throw new Error('Reserved expression operations are not supported');
	}

	return apply(operation, expression, params);
}

function expandTemplate(template, params) {
	var start, end, uri;

	uri = '';
	end = 0;
	while (true) {
		start = template.indexOf('{', end);
		if (start === -1) {
			// no more expressions
			uri += template.slice(end);
			break;
		}
		uri += template.slice(end, start);
		end = template.indexOf('}', start) + 1;
		uri += expandExpression(template.slice(start + 1, end - 1), params);
	}

	return uri;
}

module.exports = {

	/**
  * Expand a URI Template with parameters to form a URI.
  *
  * Full implementation (level 4) of rfc6570.
  * @see https://tools.ietf.org/html/rfc6570
  *
  * @param {string} template URI template
  * @param {Object} [params] params to apply to the template durring expantion
  * @returns {string} expanded URI
  */
	expand: expandTemplate

};

var uriTemplate = /*#__PURE__*/Object.freeze({

});

var styles = createCommonjsModule(function (module) {





/**
 * @class MapboxStyles
 */
var MapboxStyles = module.exports = makeService$1('MapboxStyles');

var API_STYLES_LIST = '/styles/v1/{owner}{?access_token}';
var API_STYLES_CREATE = '/styles/v1/{owner}{?access_token}';
var API_STYLES_READ = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_UPDATE = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_DELETE = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_EMBED = '/styles/v1/{owner}/{styleid}.html{?access_token,zoomwheel,title}';
var API_STYLES_SPRITE = '/styles/v1/{owner}/{styleid}/sprite{+retina}{.format}{?access_token}';
var API_STYLES_SPRITE_ICON = '/styles/v1/{owner}/{styleid}/sprite/{iconName}{?access_token}';
var API_STYLES_FONT_GLYPH_RANGES = '/fonts/v1/{owner}/{font}/{start}-{end}.pbf{?access_token}';

/**
 * To retrieve a listing of styles for a particular account.
 *
 * @param {Function} callback called with (err, styles)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listStyles(function(err, styles) {
 *   console.log(styles);
 *   // [{ version: 8,
 *   //  name: 'Light',
 *   //  center: [ -77.0469979435026, 38.898634927602814 ],
 *   //  zoom: 12.511766533145998,
 *   //  bearing: 0,
 *   //  pitch: 0,
 *   //  created: '2016-02-09T14:26:15.059Z',
 *   //  id: 'STYLEID',
 *   //  modified: '2016-02-09T14:28:31.253Z',
 *   //  owner: '{username}' },
 *   //  { version: 8,
 *   //  name: 'Dark',
 *   //  created: '2015-08-28T18:05:22.517Z',
 *   //  id: 'STYILEID',
 *   //  modified: '2015-08-28T18:05:22.517Z',
 *   //  owner: '{username}' }]
 * });
 */
MapboxStyles.prototype.listStyles = function (callback) {
  return this.client({
    path: API_STYLES_LIST,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * Create a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {Function} callback called with (err, createdStyle)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var style = {
 *   'version': 8,
 *   'name': 'My Awesome Style',
 *   'metadata': {},
 *   'sources': {},
 *   'layers': [],
 *   'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
 * };
 * client.createStyle(style, function(err, createdStyle) {
 *   console.log(createdStyle);
 * });
 */
MapboxStyles.prototype.createStyle = function (style, callback) {
  return this.client({
    path: API_STYLES_CREATE,
    params: {
      owner: this.owner
    },
    entity: style,
    callback: callback
  });
};

/**
 * Update a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {string} styleid style id
 * @param {Function} callback called with (err, createdStyle)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var style = {
 *   'version': 8,
 *   'name': 'My Awesome Style',
 *   'metadata': {},
 *   'sources': {},
 *   'layers': [],
 *   'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
 * };
 * client.updateStyle(style, 'style-id', function(err, createdStyle) {
 *   console.log(createdStyle);
 * });
 */
MapboxStyles.prototype.updateStyle = function (style, styleid, callback) {
  invariant_1(typeof styleid === 'string', 'style id must be a string');
  return this.client({
    path: API_STYLES_UPDATE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    entity: style,
    method: 'patch',
    callback: callback
  });
};

/**
 * Deletes a particular style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Function} callback called with (err)
 * @returns {Promise} a promise with the response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteStyle('style-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxStyles.prototype.deleteStyle = function (styleid, callback) {
  invariant_1(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: API_STYLES_DELETE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Reads a particular style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Function} callback called with (err, style)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readStyle('style-id', function(err, style) {
 *   if (!err) console.log(style);
 * });
 */
MapboxStyles.prototype.readStyle = function (styleid, callback) {
  invariant_1(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: API_STYLES_READ,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    callback: callback
  });
};

/**
 * Read sprite
 *
 * @param {string} styleid the id for an existing style
 * @param {Object=} options optional options
 * @param {boolean} options.retina whether the sprite JSON should be for a
 * retina sprite.
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readSprite('style-id', {
 *   retina: true
 * }, function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxStyles.prototype.readSprite = function (styleid, options, callback) {
  invariant_1(typeof styleid === 'string', 'styleid must be a string');

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var retina = '';
  if (options.retina) {
    invariant_1(typeof options.retina === 'boolean', 'retina option must be a boolean value');
    if (options.retina) {
      retina = '@2x';
    }
  }

  var format = 'json';
  if (options.format) {
    invariant_1(options.format === 'json' || options.format === 'png', 'format parameter must be either json or png');
    format = options.format;
  }

  return this.client({
    path: API_STYLES_SPRITE,
    params: {
      owner: this.owner,
      retina: retina,
      format: format,
      styleid: styleid
    },
    callback: callback
  });
};

/**
 * Get font glyph ranges
 *
 * @param {string} font or fonts
 * @param {number} start character code of starting glyph
 * @param {number} end character code of last glyph. typically the same
 * as start + 255
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readFontGlyphRanges('Arial Unicode', 0, 255, function(err, ranges) {
 *   if (!err) console.log(ranges);
 * });
 */
MapboxStyles.prototype.readFontGlyphRanges = function (font, start, end, callback) {
  invariant_1(typeof font === 'string', 'font must be a string');
  invariant_1(typeof start === 'number', 'start must be a number');
  invariant_1(typeof end === 'number', 'end must be a number');

  return this.client({
    path: API_STYLES_FONT_GLYPH_RANGES,
    params: {
      owner: this.owner,
      font: font,
      start: start,
      end: end
    },
    callback: callback
  });
};

/**
 * Add an icon to a sprite.
 *
 * @param {string} styleid the id for an existing style
 * @param {string} iconName icon's name
 * @param {Buffer} icon icon content as a buffer
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var fs = require('fs');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.addIcon('style-id', 'icon-name', fs.readFileSync('icon.png'), function(err) {
 *   if (!err) console.log('added icon!');
 * });
 */
MapboxStyles.prototype.addIcon = function (styleid, iconName, icon, callback) {
  invariant_1(typeof styleid === 'string', 'style must be a string');
  invariant_1(typeof iconName === 'string', 'icon name must be a string');
  invariant_1(Buffer.isBuffer(icon), 'icon must be a Buffer');

  return this.client({
    path: API_STYLES_SPRITE_ICON,
    params: {
      owner: this.owner,
      styleid: styleid,
      iconName: iconName
    },
    headers: {
      'Content-Type': 'text/plain'
    },
    entity: icon,
    method: 'put',
    callback: callback
  });
};

/**
 * Delete an icon from a sprite.
 *
 * @param {string} styleid the id for an existing style
 * @param {string} iconName icon's name
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteIcon('style-id', 'icon-name', function(err) {
 *   if (!err) console.log('deleted icon!');
 * });
 */
MapboxStyles.prototype.deleteIcon = function (styleid, iconName, callback) {
  invariant_1(typeof styleid === 'string', 'style must be a string');
  invariant_1(typeof iconName === 'string', 'icon name must be a string');

  return this.client({
    path: API_STYLES_SPRITE_ICON,
    params: {
      owner: this.owner,
      styleid: styleid,
      iconName: iconName
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Embed a style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Object} options optional params
 * @param {boolean} [options.title=false] If true, shows a title box in upper right
 * corner with map title and owner
 * @param {boolean} [options.zoomwheel=true] Disables zooming with mouse scroll wheel
 * @returns {string} URL of style embed page
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var url = client.embedStyle('style-id');
 */
MapboxStyles.prototype.embedStyle = function (styleid, options) {
  invariant_1(typeof styleid === 'string', 'style must be a string');

  var params = {
    styleid: styleid,
    access_token: this.accessToken,
    owner: this.owner,
    title: false,
    zoomwheel: true
  };

  if (options) {
    if (options.title !== undefined) {
      invariant_1(typeof options.title === 'boolean', 'title must be a boolean');
      params.title = options.title;
    }
    if (options.zoomwheel !== undefined) {
      invariant_1(typeof options.zoomwheel === 'boolean', 'zoomwheel must be a boolean');
      params.zoomwheel = options.zoomwheel;
    }
  }

  return this.endpoint + uriTemplate.expand(API_STYLES_EMBED, params);
};
});

var invariant$8 = require('../../vendor/invariant');
var xtend$1 = require('../../vendor/xtend').extend;
var uriTemplate$1 = require('rest/util/uriTemplate');
var encodeOverlay = require('../encode_overlay');
var invariantLocation = require('../invariant_location');
var makeService$8 = require('../make_service');

/**
 * @class MapboxStatic
 */
var MapboxStatic = makeService$8('MapboxStatic');

var API_STATIC = '/styles/v1/{username}/{styleid}/static{+overlay}/{+xyzbp}/{width}x{height}{+retina}{?access_token,attribution,logo,before_layer}';
var API_STATIC_CLASSIC = '/v4/{mapid}{+overlay}/{+xyz}/{width}x{height}{+retina}{.format}{?access_token}';

/**
 * Determine a URL for a static map image, using the [Mapbox Static Map API](https://www.mapbox.com/api-documentation/#static).
 *
 * @param {string} username Mapbox username
 * @param {string} styleid Mapbox Style ID
 * @param {number} width width of the image
 * @param {number} height height of the image
 *
 * @param {Object|string} position either an object with longitude and latitude members, or the string 'auto'
 * @param {number} position.longitude east, west bearing
 * @param {number} position.latitude north, south bearing
 * @param {number} position.zoom map zoom level
 * @param {number} position.bearing map bearing in degrees between 0 and 360
 * @param {number} position.pitch map pitch in degrees between 0 (straight down, no pitch) and 60 (maximum pitch)
 *
 * @param {Object} options all map options
 * @param {boolean} [options.retina=false] whether to double image pixel density
 *
 * @param {Array<Object>} [options.markers=[]] an array of simple marker objects as an overlay
 * @param {Object} [options.geojson={}] geojson data for the overlay
 * @param {Object} [options.path={}] a path and
 * @param {Array<Object>} options.path.geojson data for the path as an array of longitude, latitude objects
 * @param {Array<Object>} options.path.style optional style definitions for a path
 * @param {boolean} options.attribution controlling whether there is attribution on the image; defaults to true
 * @param {boolean} options.logo controlling whether there is a Mapbox logo on the image; defaults to true
 * @param {string} options.before_layer value for controlling where the overlay is inserted in the style
 *
 * @returns {string} static map url
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * var url = mapboxClient.getStaticURL('mapbox', 'streets-v10', 600, 400, {
 *   longitude: 151.22,
 *   latitude: -33.87,
 *   zoom: 11
 * }, {
 *   markers: [{ longitude: 151.22, latitude: -33.87 }],
 *   before_layer: 'housenum-label'
 * });
 * // url = https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-l-circle(151.22,-33.87)/151.22,-33.87,11/600x400?access_token=ACCESS_TOKEN&before_layer=housenum-label
 */
MapboxStatic.prototype.getStaticURL = function (username, styleid, width, height, position, options) {
  invariant$8(typeof username === 'string', 'username option required and must be a string');
  invariant$8(typeof styleid === 'string', 'styleid option required and must be a string');
  invariant$8(typeof width === 'number', 'width option required and must be a number');
  invariant$8(typeof height === 'number', 'height option required and must be a number');

  var defaults$$1 = {
    retina: ''
  };

  var xyzbp;

  if (position === 'auto') {
    xyzbp = 'auto';
  } else {
    invariantLocation(position);
    xyzbp = position.longitude + ',' + position.latitude + ',' + position.zoom;
    if ('pitch' in position) {
      xyzbp += ',' + (position.bearing || 0) + ',' + position.pitch;
    } else if ('bearing' in position) {
      xyzbp += ',' + position.bearing;
    }
  }

  var userOptions = {};

  if (options) {
    invariant$8((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');
    if (options.format) {
      invariant$8(typeof options.format === 'string', 'format must be a string');
      userOptions.format = options.format;
    }
    if (options.retina) {
      invariant$8(typeof options.retina === 'boolean', 'retina must be a boolean');
      userOptions.retina = options.retina;
    }
    if (options.markers) {
      userOptions.overlay = '/' + encodeOverlay.encodeMarkers(options.markers);
    } else if (options.geojson) {
      userOptions.overlay = '/' + encodeOverlay.encodeGeoJSON(options.geojson);
    } else if (options.path) {
      userOptions.overlay = '/' + encodeOverlay.encodePath(options.path);
    }
    if ('attribution' in options) {
      invariant$8(typeof options.attribution === 'boolean', 'attribution must be a boolean');
      userOptions.attribution = options.attribution;
    }
    if ('logo' in options) {
      invariant$8(typeof options.logo === 'boolean', 'logo must be a boolean');
      userOptions.logo = options.logo;
    }
    if (options.before_layer) {
      invariant$8(typeof options.before_layer === 'string', 'before_layer must be a string');
      userOptions.before_layer = options.before_layer;
    }
  }

  var params = xtend$1(defaults$$1, userOptions, {
    username: username,
    styleid: styleid,
    width: width,
    xyzbp: xyzbp,
    height: height,
    access_token: this.accessToken
  });

  if (params.retina === true) {
    params.retina = '@2x';
  }

  return this.endpoint + uriTemplate$1.expand(API_STATIC, params);
};

/**
 * Determine a URL for a static classic map image, using the [Mapbox Static (Classic) Map API](https://www.mapbox.com/api-documentation/pages/static_classic.html).
 *
 * @param {string} mapid a Mapbox map id in username.id form
 * @param {number} width width of the image
 * @param {number} height height of the image
 *
 * @param {Object|string} position either an object with longitude and latitude members, or the string 'auto'
 * @param {number} position.longitude east, west bearing
 * @param {number} position.latitude north, south bearing
 * @param {number} position.zoom zoom level
 *
 * @param {Object} options all map options
 * @param {string} [options.format=png] image format. can be jpg70, jpg80, jpg90, png32, png64, png128, png256
 * @param {boolean} [options.retina=false] whether to double image pixel density
 *
 * @param {Array<Object>} [options.markers=[]] an array of simple marker objects as an overlay
 * @param {Object} [options.geojson={}] geojson data for the overlay
 * @param {Object} [options.path={}] a path and
 * @param {Array<Object>} options.path.geojson data for the path as an array of longitude, latitude objects
 * @param {Array<Object>} options.path.style optional style definitions for a path
 *
 * @returns {string} static classic map url
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxStatic.prototype.getStaticClassicURL = function (mapid, width, height, position, options) {
  invariant$8(typeof mapid === 'string', 'mapid option required and must be a string');
  invariant$8(typeof width === 'number', 'width option required and must be a number');
  invariant$8(typeof height === 'number', 'height option required and must be a number');

  var defaults$$1 = {
    format: 'png',
    retina: ''
  };

  var xyz;

  if (position === 'auto') {
    xyz = 'auto';
  } else {
    invariantLocation(position);
    xyz = position.longitude + ',' + position.latitude + ',' + position.zoom;
  }

  var userOptions = {};

  if (options) {
    invariant$8((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');
    if (options.format) {
      invariant$8(typeof options.format === 'string', 'format must be a string');
      userOptions.format = options.format;
    }
    if (options.retina) {
      invariant$8(typeof options.retina === 'boolean', 'retina must be a boolean');
      userOptions.retina = options.retina;
    }
    if (options.markers) {
      userOptions.overlay = '/' + encodeOverlay.encodeMarkers(options.markers);
    } else if (options.geojson) {
      userOptions.overlay = '/' + encodeOverlay.encodeGeoJSON(options.geojson);
    } else if (options.path) {
      userOptions.overlay = '/' + encodeOverlay.encodePath(options.path);
    }
  }

  var params = xtend$1(defaults$$1, userOptions, {
    mapid: mapid,
    width: width,
    xyz: xyz,
    height: height,
    access_token: this.accessToken
  });

  if (params.retina === true) {
    params.retina = '@2x';
  }

  return this.endpoint + uriTemplate$1.expand(API_STATIC_CLASSIC, params);
};

module.exports = MapboxStatic;

var _static = /*#__PURE__*/Object.freeze({

});

var invariant$9 = require('../../vendor/invariant');
var makeService$9 = require('../make_service');

/**
 * @class MapboxTilesets
 */
var MapboxTilesets = module.exports = makeService$9('MapboxTilesets');

var API_TILESETS_TILEQUERY = '/v4/{mapid}/tilequery/{longitude},{latitude}.json{?access_token,radius,limit}';
var API_TILESETS_LIST = '/tilesets/v1/{owner}{?access_token,limit}';

/**
 * Retrieve data about specific vector features at a specified location within a vector tileset
 *
 * @param {String} mapid Map ID of the tileset to query (eg. mapbox.mapbox-streets-v7)
 * @param {Array} position An array in the form [longitude, latitude] of the position to query
 * @param {Object} [options] optional options
 * @param {Number} options.radius Approximate distance in meters to query for features
 * @param {Number} options.limit Number of features between 1-50 to return
 * @param {Function} [callback] called with (err, results, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.tilequery('mapbox.mapbox-streets-v7', [-77, 38], {}, function(err, response) {
 *   console.log(response);
 * });
 */
MapboxTilesets.prototype.tilequery = function (mapid, position, options, callback) {
  invariant$9(typeof mapid === 'string', 'mapid must be a string');
  invariant$9((typeof position === 'undefined' ? 'undefined' : _typeof(position)) === 'object', 'position must be an array');
  invariant$9(position.length == 2, 'position must be an array of length 2');
  invariant$9(typeof position[0] === 'number' && typeof position[1] === 'number', 'position must be an array of two numbers');

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  return this.client({
    path: API_TILESETS_TILEQUERY,
    params: {
      mapid: mapid,
      longitude: position[0],
      latitude: position[1],
      radius: options.radius,
      limit: options.limit
    },
    callback: callback
  });
};

/**
 * Retrieve all tilesets
 *
 * @param {Object} [options] optional options
 * @param {Number} options.limit Maximum Number of tilesets to return
 * @param {Function} [callback] called with (err, tilesets, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listTilesets(function(err, tilesets) {
 *   console.log(tilesets);
 * });
 */
MapboxTilesets.prototype.listTilesets = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};

  return this.client({
    path: API_TILESETS_LIST,
    params: {
      owner: this.owner,
      limit: options.limit
    },
    callback: callback
  });
};

var tilesets = /*#__PURE__*/Object.freeze({

});

var tokens = createCommonjsModule(function (module) {




/**
 * @class MapboxTokens
 */
var MapboxTokens = module.exports = makeService$1('MapboxTokens');

var API_TOKENS_LIST = '/tokens/v2/{owner}{?access_token}';
var API_TOKENS_CREATE = '/tokens/v2/{owner}{?access_token}';
var API_TOKENS_UPDATE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}{?access_token}';
var API_TOKENS_DELETE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}{?access_token}';
var API_TOKENS_RETRIEVE = '/tokens/v2{?access_token}';
var API_TOKENS_LIST_SCOPES = '/scopes/v1/{owner}{?access_token}';

/**
 * To retrieve a listing of tokens for a particular account.
 *
 * @param {Function} [callback] called with (err, tokens, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listTokens(function(err, tokens) {
 *   console.log(tokens);
 *   // [{ client: 'api'
 *   //  note: 'Default Public Token',
 *   //  usage: 'pk',
 *   //  id: 'TOKENID',
 *   //  default: true,
 *   //  scopes: ['styles:tiles','styles:read','fonts:read','datasets:read'],
 *   //  created: '2016-02-09T14:26:15.059Z',
 *   //  modified: '2016-02-09T14:28:31.253Z',
 *   //  token: 'pk.TOKEN' }]
 * });
 */
MapboxTokens.prototype.listTokens = function (callback) {
  return this.client({
    path: API_TOKENS_LIST,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * Create a token
 *
 * @param {string} note Note attached to the token
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createToken('My top secret project', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
MapboxTokens.prototype.createToken = function (note, scopes, callback) {
  invariant_1(typeof note === 'string', 'note must be a string');
  invariant_1(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_CREATE,
    params: {
      owner: this.owner
    },
    entity: {
      scopes: scopes,
      note: note
    },
    callback: callback
  });
};

/**
 * Create a temporary token
 *
 * @param {string} expires Time token expires in RFC 3339
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createTemporaryToken('2016-09-15T19:27:53.000Z', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
MapboxTokens.prototype.createTemporaryToken = function (expires, scopes, callback) {
  invariant_1(typeof expires === 'string', 'expires must be a string');
  invariant_1(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_CREATE,
    params: {
      owner: this.owner
    },
    entity: {
      scopes: scopes,
      expires: expires
    },
    callback: callback
  });
};

/**
 * Update a token's authorization
 *
 * @param {string} authorization_id Authorization ID
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.updateTokenAuthorization('auth id', ["styles:read", "fonts:read"], function(err, updatedToken) {
 *   console.log(updatedToken);
 * });
 */
MapboxTokens.prototype.updateTokenAuthorization = function (authorization_id, scopes, callback) {
  invariant_1(typeof authorization_id === 'string', 'authorization_id must be a string');
  invariant_1(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_UPDATE_AUTHORIZATION,
    params: {
      authorization_id: authorization_id,
      owner: this.owner
    },
    entity: {
      scopes: scopes
    },
    method: 'patch',
    callback: callback
  });
};

/**
 * Delete a token's authorization
 *
 * @param {string} authorization_id Authorization ID
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteTokenAuthorization('auth id', function(err) {
 * });
 */
MapboxTokens.prototype.deleteTokenAuthorization = function (authorization_id, callback) {
  invariant_1(typeof authorization_id === 'string', 'authorization_id must be a string');

  return this.client({
    path: API_TOKENS_DELETE_AUTHORIZATION,
    params: {
      authorization_id: authorization_id,
      owner: this.owner
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Retrieve a token
 *
 * @param {string} access_token access token to check
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.retrieveToken('ACCESSTOKEN', function(err, tokenResponse) {
 *   console.log(tokenResponse);
 * });
 */
MapboxTokens.prototype.retrieveToken = function (access_token, callback) {
  invariant_1(typeof access_token === 'string', 'access_token must be a string');

  return this.client({
    path: API_TOKENS_RETRIEVE,
    params: {
      access_token: access_token
    },
    callback: callback
  });
};

/**
 * List scopes
 *
 * @param {Function} [callback] called with (err, scopes, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listScopes(function(err, scopes) {
 *   console.log(scopes);
 * });
 */
MapboxTokens.prototype.listScopes = function (callback) {
  return this.client({
    path: API_TOKENS_LIST_SCOPES,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};
});

var xtend$2 = xtend.extendMutable;














/**
 * The JavaScript API to Mapbox services
 *
 * @class
 * @throws {Error} if accessToken is not provided
 * @param {string} accessToken a private or public access token
 * @param {Object} options additional options provided for configuration
 * @param {string} [options.endpoint=https://api.mapbox.com] location
 * of the Mapbox API pointed-to. This can be customized to point to a
 * Mapbox Atlas Server instance, or a different service, a mock,
 * or a staging endpoint. Usually you don't need to customize this.
 * @param {string} [options.account] account id to use for api
 * requests. If not is specified, the account defaults to the owner
 * of the provided accessToken.
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 */
var MapboxClient = makeService$1('MapboxClient');

// Combine all client APIs into one API for when people require()
// the main mapbox-sdk-js library.
xtend$2(MapboxClient.prototype, geocoding.prototype, surface.prototype, directions.prototype, matrix.prototype, matching.prototype, datasets.prototype, uploads.prototype, tilestats.prototype, styles.prototype, _static.prototype, tilesets.prototype, tokens.prototype);

MapboxClient.getUser = get_user;

var mapbox = MapboxClient;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _typeof2(obj) {
  if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
    _typeof2 = function _typeof2(obj) {
      return typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };
  } else {
    _typeof2 = function _typeof2(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };
  }return _typeof2(obj);
}

function _typeof$1(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof$1 = function _typeof$$1(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof$1 = function _typeof$$1(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof$1(obj);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var degree = Math.PI / 180;

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();

function createMat4() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
function transformVector(matrix, vector) {
  var result = transformMat4([], vector, matrix);
  scale(result, result, 1 / result[3]);
  return result;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */

function multiply$1(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$1(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$2(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$2() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function add$2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */

function negate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp$2(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$1 = function () {
  var vec = create$2();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$3() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */

function negate$2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$2 = function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'viewport-mercator-project: assertion failed.');
  }
}

var PI = Math.PI;
var PI_4 = PI / 4;
var DEGREES_TO_RADIANS = PI / 180;
var RADIANS_TO_DEGREES = 180 / PI;
var TILE_SIZE = 512;
var EARTH_CIRCUMFERENCE = 40.03e6;
var DEFAULT_ALTITUDE = 1.5;
function zoomToScale(zoom) {
  return Math.pow(2, zoom);
}
function lngLatToWorld(_ref, scale) {
  var _ref2 = _slicedToArray(_ref, 2),
      lng = _ref2[0],
      lat = _ref2[1];

  assert(Number.isFinite(lng) && Number.isFinite(scale));
  assert(Number.isFinite(lat) && lat >= -90 && lat <= 90, 'invalid latitude');
  scale *= TILE_SIZE;
  var lambda2 = lng * DEGREES_TO_RADIANS;
  var phi2 = lat * DEGREES_TO_RADIANS;
  var x = scale * (lambda2 + PI) / (2 * PI);
  var y = scale * (PI - Math.log(Math.tan(PI_4 + phi2 * 0.5))) / (2 * PI);
  return [x, y];
}
function worldToLngLat(_ref3, scale) {
  var _ref4 = _slicedToArray(_ref3, 2),
      x = _ref4[0],
      y = _ref4[1];

  scale *= TILE_SIZE;
  var lambda2 = x / scale * (2 * PI) - PI;
  var phi2 = 2 * (Math.atan(Math.exp(PI - y / scale * (2 * PI))) - PI_4);
  return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
}
function getDistanceScales(_ref6) {
  var latitude = _ref6.latitude,
      longitude = _ref6.longitude,
      zoom = _ref6.zoom,
      scale = _ref6.scale,
      _ref6$highPrecision = _ref6.highPrecision,
      highPrecision = _ref6$highPrecision === void 0 ? false : _ref6$highPrecision;
  scale = scale !== undefined ? scale : zoomToScale(zoom);
  assert(Number.isFinite(latitude) && Number.isFinite(longitude) && Number.isFinite(scale));
  var result = {};
  var worldSize = TILE_SIZE * scale;
  var latCosine = Math.cos(latitude * DEGREES_TO_RADIANS);
  var pixelsPerDegreeX = worldSize / 360;
  var pixelsPerDegreeY = pixelsPerDegreeX / latCosine;
  var altPixelsPerMeter = worldSize / EARTH_CIRCUMFERENCE / latCosine;
  result.pixelsPerMeter = [altPixelsPerMeter, -altPixelsPerMeter, altPixelsPerMeter];
  result.metersPerPixel = [1 / altPixelsPerMeter, -1 / altPixelsPerMeter, 1 / altPixelsPerMeter];
  result.pixelsPerDegree = [pixelsPerDegreeX, -pixelsPerDegreeY, altPixelsPerMeter];
  result.degreesPerPixel = [1 / pixelsPerDegreeX, -1 / pixelsPerDegreeY, 1 / altPixelsPerMeter];

  if (highPrecision) {
    var latCosine2 = DEGREES_TO_RADIANS * Math.tan(latitude * DEGREES_TO_RADIANS) / latCosine;
    var pixelsPerDegreeY2 = pixelsPerDegreeX * latCosine2 / 2;
    var altPixelsPerDegree2 = worldSize / EARTH_CIRCUMFERENCE * latCosine2;
    var altPixelsPerMeter2 = altPixelsPerDegree2 / pixelsPerDegreeY * altPixelsPerMeter;
    result.pixelsPerDegree2 = [0, -pixelsPerDegreeY2, altPixelsPerDegree2];
    result.pixelsPerMeter2 = [altPixelsPerMeter2, 0, altPixelsPerMeter2];
  }

  return result;
}
function getViewMatrix(_ref7) {
  var height = _ref7.height,
      pitch = _ref7.pitch,
      bearing = _ref7.bearing,
      altitude = _ref7.altitude,
      _ref7$center = _ref7.center,
      center = _ref7$center === void 0 ? null : _ref7$center,
      _ref7$flipY = _ref7.flipY,
      flipY = _ref7$flipY === void 0 ? false : _ref7$flipY;
  var vm = createMat4();
  translate(vm, vm, [0, 0, -altitude]);
  scale$1(vm, vm, [1, 1, 1 / height]);
  rotateX(vm, vm, -pitch * DEGREES_TO_RADIANS);
  rotateZ(vm, vm, bearing * DEGREES_TO_RADIANS);

  if (flipY) {
    scale$1(vm, vm, [1, -1, 1]);
  }

  if (center) {
    translate(vm, vm, negate$2([], center));
  }

  return vm;
}
function getProjectionParameters(_ref8) {
  var width = _ref8.width,
      height = _ref8.height,
      _ref8$altitude = _ref8.altitude,
      altitude = _ref8$altitude === void 0 ? DEFAULT_ALTITUDE : _ref8$altitude,
      _ref8$pitch = _ref8.pitch,
      pitch = _ref8$pitch === void 0 ? 0 : _ref8$pitch,
      _ref8$nearZMultiplier = _ref8.nearZMultiplier,
      nearZMultiplier = _ref8$nearZMultiplier === void 0 ? 1 : _ref8$nearZMultiplier,
      _ref8$farZMultiplier = _ref8.farZMultiplier,
      farZMultiplier = _ref8$farZMultiplier === void 0 ? 1 : _ref8$farZMultiplier;
  var pitchRadians = pitch * DEGREES_TO_RADIANS;
  var halfFov = Math.atan(0.5 / altitude);
  var topHalfSurfaceDistance = Math.sin(halfFov) * altitude / Math.sin(Math.PI / 2 - pitchRadians - halfFov);
  var farZ = Math.cos(Math.PI / 2 - pitchRadians) * topHalfSurfaceDistance + altitude;
  return {
    fov: 2 * Math.atan(height / 2 / altitude),
    aspect: width / height,
    focalDistance: altitude,
    near: nearZMultiplier,
    far: farZ * farZMultiplier
  };
}
function getProjectionMatrix(_ref9) {
  var width = _ref9.width,
      height = _ref9.height,
      pitch = _ref9.pitch,
      altitude = _ref9.altitude,
      nearZMultiplier = _ref9.nearZMultiplier,
      farZMultiplier = _ref9.farZMultiplier;

  var _getProjectionParamet = getProjectionParameters({
    width: width,
    height: height,
    altitude: altitude,
    pitch: pitch,
    nearZMultiplier: nearZMultiplier,
    farZMultiplier: farZMultiplier
  }),
      fov = _getProjectionParamet.fov,
      aspect = _getProjectionParamet.aspect,
      near = _getProjectionParamet.near,
      far = _getProjectionParamet.far;

  var projectionMatrix = perspective([], fov, aspect, near, far);
  return projectionMatrix;
}
function worldToPixels(xyz, pixelProjectionMatrix) {
  var _xyz2 = _slicedToArray(xyz, 3),
      x = _xyz2[0],
      y = _xyz2[1],
      _xyz2$ = _xyz2[2],
      z = _xyz2$ === void 0 ? 0 : _xyz2$;

  assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z));
  return transformVector(pixelProjectionMatrix, [x, y, z, 1]);
}
function pixelsToWorld(xyz, pixelUnprojectionMatrix) {
  var targetZ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var _xyz3 = _slicedToArray(xyz, 3),
      x = _xyz3[0],
      y = _xyz3[1],
      z = _xyz3[2];

  assert(Number.isFinite(x) && Number.isFinite(y), 'invalid pixel coordinate');

  if (Number.isFinite(z)) {
    var coord = transformVector(pixelUnprojectionMatrix, [x, y, z, 1]);
    return coord;
  }

  var coord0 = transformVector(pixelUnprojectionMatrix, [x, y, 0, 1]);
  var coord1 = transformVector(pixelUnprojectionMatrix, [x, y, 1, 1]);
  var z0 = coord0[2];
  var z1 = coord1[2];
  var t = z0 === z1 ? 0 : ((targetZ || 0) - z0) / (z1 - z0);
  return lerp$2([], coord0, coord1, t);
}

var IDENTITY = createMat4();

var Viewport = function () {
  function Viewport() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        _ref$viewMatrix = _ref.viewMatrix,
        viewMatrix = _ref$viewMatrix === void 0 ? IDENTITY : _ref$viewMatrix,
        _ref$projectionMatrix = _ref.projectionMatrix,
        projectionMatrix = _ref$projectionMatrix === void 0 ? IDENTITY : _ref$projectionMatrix;

    _classCallCheck(this, Viewport);

    this.width = width || 1;
    this.height = height || 1;
    this.scale = 1;
    this.pixelsPerMeter = 1;
    this.viewMatrix = viewMatrix;
    this.projectionMatrix = projectionMatrix;
    var vpm = createMat4();
    multiply$1(vpm, vpm, this.projectionMatrix);
    multiply$1(vpm, vpm, this.viewMatrix);
    this.viewProjectionMatrix = vpm;
    var m = createMat4();
    scale$1(m, m, [this.width / 2, -this.height / 2, 1]);
    translate(m, m, [1, -1, 0]);
    multiply$1(m, m, this.viewProjectionMatrix);
    var mInverse = invert(createMat4(), m);

    if (!mInverse) {
      throw new Error('Pixel project matrix not invertible');
    }

    this.pixelProjectionMatrix = m;
    this.pixelUnprojectionMatrix = mInverse;
    this.equals = this.equals.bind(this);
    this.project = this.project.bind(this);
    this.unproject = this.unproject.bind(this);
    this.projectPosition = this.projectPosition.bind(this);
    this.unprojectPosition = this.unprojectPosition.bind(this);
    this.projectFlat = this.projectFlat.bind(this);
    this.unprojectFlat = this.unprojectFlat.bind(this);
  }

  _createClass(Viewport, [{
    key: "equals",
    value: function equals(viewport) {
      if (!(viewport instanceof Viewport)) {
        return false;
      }

      return viewport.width === this.width && viewport.height === this.height && equals$2(viewport.projectionMatrix, this.projectionMatrix) && equals$2(viewport.viewMatrix, this.viewMatrix);
    }
  }, {
    key: "project",
    value: function project(xyz) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$topLeft = _ref2.topLeft,
          topLeft = _ref2$topLeft === void 0 ? true : _ref2$topLeft;

      var worldPosition = this.projectPosition(xyz);
      var coord = worldToPixels(worldPosition, this.pixelProjectionMatrix);

      var _coord = _slicedToArray(coord, 2),
          x = _coord[0],
          y = _coord[1];

      var y2 = topLeft ? y : this.height - y;
      return xyz.length === 2 ? [x, y2] : [x, y2, coord[2]];
    }
  }, {
    key: "unproject",
    value: function unproject(xyz) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$topLeft = _ref3.topLeft,
          topLeft = _ref3$topLeft === void 0 ? true : _ref3$topLeft,
          targetZ = _ref3.targetZ;

      var _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          z = _xyz[2];

      var y2 = topLeft ? y : this.height - y;
      var targetZWorld = targetZ && targetZ * this.pixelsPerMeter;
      var coord = pixelsToWorld([x, y2, z], this.pixelUnprojectionMatrix, targetZWorld);

      var _this$unprojectPositi = this.unprojectPosition(coord),
          _this$unprojectPositi2 = _slicedToArray(_this$unprojectPositi, 3),
          X = _this$unprojectPositi2[0],
          Y = _this$unprojectPositi2[1],
          Z = _this$unprojectPositi2[2];

      if (Number.isFinite(z)) {
        return [X, Y, Z];
      }

      return Number.isFinite(targetZ) ? [X, Y, targetZ] : [X, Y];
    }
  }, {
    key: "projectPosition",
    value: function projectPosition(xyz) {
      var _this$projectFlat = this.projectFlat(xyz),
          _this$projectFlat2 = _slicedToArray(_this$projectFlat, 2),
          X = _this$projectFlat2[0],
          Y = _this$projectFlat2[1];

      var Z = (xyz[2] || 0) * this.pixelsPerMeter;
      return [X, Y, Z];
    }
  }, {
    key: "unprojectPosition",
    value: function unprojectPosition(xyz) {
      var _this$unprojectFlat = this.unprojectFlat(xyz),
          _this$unprojectFlat2 = _slicedToArray(_this$unprojectFlat, 2),
          X = _this$unprojectFlat2[0],
          Y = _this$unprojectFlat2[1];

      var Z = (xyz[2] || 0) / this.pixelsPerMeter;
      return [X, Y, Z];
    }
  }, {
    key: "projectFlat",
    value: function projectFlat(xyz) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return xyz;
    }
  }, {
    key: "unprojectFlat",
    value: function unprojectFlat(xyz) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return xyz;
    }
  }]);

  return Viewport;
}();

function fitBounds(_ref) {
  var width = _ref.width,
      height = _ref.height,
      bounds = _ref.bounds,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? 0 : _ref$padding,
      _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? [0, 0] : _ref$offset;

  var _bounds = _slicedToArray(bounds, 2),
      _bounds$ = _slicedToArray(_bounds[0], 2),
      west = _bounds$[0],
      south = _bounds$[1],
      _bounds$2 = _slicedToArray(_bounds[1], 2),
      east = _bounds$2[0],
      north = _bounds$2[1];

  if (Number.isFinite(padding)) {
    var p = padding;
    padding = {
      top: p,
      bottom: p,
      left: p,
      right: p
    };
  } else {
    assert(Number.isFinite(padding.top) && Number.isFinite(padding.bottom) && Number.isFinite(padding.left) && Number.isFinite(padding.right));
  }

  var viewport = new WebMercatorViewport({
    width: width,
    height: height,
    longitude: 0,
    latitude: 0,
    zoom: 0
  });
  var nw = viewport.project([west, north]);
  var se = viewport.project([east, south]);
  var size = [Math.abs(se[0] - nw[0]), Math.abs(se[1] - nw[1])];
  var targetSize = [width - padding.left - padding.right - Math.abs(offset[0]) * 2, height - padding.top - padding.bottom - Math.abs(offset[1]) * 2];
  assert(targetSize[0] > 0 && targetSize[1] > 0);
  var scaleX = targetSize[0] / size[0];
  var scaleY = targetSize[1] / size[1];
  var offsetX = (padding.right - padding.left) / 2 / scaleX;
  var offsetY = (padding.bottom - padding.top) / 2 / scaleY;
  var center = [(se[0] + nw[0]) / 2 + offsetX, (se[1] + nw[1]) / 2 + offsetY];
  var centerLngLat = viewport.unproject(center);
  var zoom = viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY)));
  return {
    longitude: centerLngLat[0],
    latitude: centerLngLat[1],
    zoom: zoom
  };
}

var WebMercatorViewport = function (_Viewport) {
  _inherits(WebMercatorViewport, _Viewport);

  function WebMercatorViewport() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        _ref$latitude = _ref.latitude,
        latitude = _ref$latitude === void 0 ? 0 : _ref$latitude,
        _ref$longitude = _ref.longitude,
        longitude = _ref$longitude === void 0 ? 0 : _ref$longitude,
        _ref$zoom = _ref.zoom,
        zoom = _ref$zoom === void 0 ? 0 : _ref$zoom,
        _ref$pitch = _ref.pitch,
        pitch = _ref$pitch === void 0 ? 0 : _ref$pitch,
        _ref$bearing = _ref.bearing,
        bearing = _ref$bearing === void 0 ? 0 : _ref$bearing,
        _ref$altitude = _ref.altitude,
        altitude = _ref$altitude === void 0 ? 1.5 : _ref$altitude,
        nearZMultiplier = _ref.nearZMultiplier,
        farZMultiplier = _ref.farZMultiplier;

    _classCallCheck(this, WebMercatorViewport);

    width = width || 1;
    height = height || 1;
    var scale = zoomToScale(zoom);
    altitude = Math.max(0.75, altitude);
    var center = lngLatToWorld([longitude, latitude], scale);
    center[2] = 0;
    var projectionMatrix = getProjectionMatrix({
      width: width,
      height: height,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude,
      nearZMultiplier: nearZMultiplier || 1 / height,
      farZMultiplier: farZMultiplier || 1.01
    });
    var viewMatrix = getViewMatrix({
      height: height,
      center: center,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude,
      flipY: true
    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebMercatorViewport).call(this, {
      width: width,
      height: height,
      viewMatrix: viewMatrix,
      projectionMatrix: projectionMatrix
    }));
    _this.latitude = latitude;
    _this.longitude = longitude;
    _this.zoom = zoom;
    _this.pitch = pitch;
    _this.bearing = bearing;
    _this.altitude = altitude;
    _this.scale = scale;
    _this.center = center;
    _this.pixelsPerMeter = getDistanceScales(_assertThisInitialized(_assertThisInitialized(_this))).pixelsPerMeter[2];
    Object.freeze(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(WebMercatorViewport, [{
    key: "projectFlat",
    value: function projectFlat(lngLat) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return lngLatToWorld(lngLat, scale);
    }
  }, {
    key: "unprojectFlat",
    value: function unprojectFlat(xy) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return worldToLngLat(xy, scale);
    }
  }, {
    key: "getMapCenterByLngLatPosition",
    value: function getMapCenterByLngLatPosition(_ref2) {
      var lngLat = _ref2.lngLat,
          pos = _ref2.pos;
      var fromLocation = pixelsToWorld(pos, this.pixelUnprojectionMatrix);
      var toLocation = lngLatToWorld(lngLat, this.scale);
      var translate = add$2([], toLocation, negate$1([], fromLocation));
      var newCenter = add$2([], this.center, translate);
      return worldToLngLat(newCenter, this.scale);
    }
  }, {
    key: "getLocationAtPoint",
    value: function getLocationAtPoint(_ref3) {
      var lngLat = _ref3.lngLat,
          pos = _ref3.pos;
      return this.getMapCenterByLngLatPosition({
        lngLat: lngLat,
        pos: pos
      });
    }
  }, {
    key: "fitBounds",
    value: function fitBounds$$1(bounds) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var width = this.width,
          height = this.height;

      var _fitBounds2 = fitBounds(Object.assign({
        width: width,
        height: height,
        bounds: bounds
      }, options)),
          longitude = _fitBounds2.longitude,
          latitude = _fitBounds2.latitude,
          zoom = _fitBounds2.zoom;

      return new WebMercatorViewport({
        width: width,
        height: height,
        longitude: longitude,
        latitude: latitude,
        zoom: zoom
      });
    }
  }]);

  return WebMercatorViewport;
}(Viewport);

var Geocoder = function (_Component) {
    inherits(Geocoder, _Component);

    function Geocoder(props) {
        classCallCheck(this, Geocoder);

        var _this = possibleConstructorReturn(this, (Geocoder.__proto__ || Object.getPrototypeOf(Geocoder)).call(this));

        _this.debounceTimeout = null;
        _this.state = {
            results: [],
            showResults: false
        };

        _this.onChange = function (event) {
            var _this$props = _this.props,
                timeout = _this$props.timeout,
                queryParams = _this$props.queryParams,
                localGeocoder = _this$props.localGeocoder,
                limit = _this$props.limit,
                localOnly = _this$props.localOnly;

            var queryString = event.target.value;

            clearTimeout(_this.debounceTimeout);
            _this.debounceTimeout = setTimeout(function () {
                var localResults = localGeocoder ? localGeocoder(queryString) : [];
                var params = _extends({}, queryParams, { limit: limit - localResults.length });

                if (params.limit > 0 && !localOnly) {
                    _this.client.geocodeForward(queryString, params).then(function (res) {
                        _this.setState({
                            results: [].concat(toConsumableArray(localResults), toConsumableArray(res.entity.features))
                        });
                    });
                } else {
                    _this.setState({
                        results: localResults
                    });
                }
            }, timeout);
        };

        _this.onSelected = function (item) {
            var _this$props2 = _this.props,
                viewport = _this$props2.viewport,
                onSelected = _this$props2.onSelected,
                transitionDuration = _this$props2.transitionDuration,
                hideOnSelect = _this$props2.hideOnSelect,
                pointZoom = _this$props2.pointZoom;

            var newViewport = new WebMercatorViewport(viewport);
            var bbox = item.bbox,
                center = item.center;


            if (bbox) {
                newViewport = newViewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
            } else {
                newViewport = {
                    longitude: center[0],
                    latitude: center[1],
                    zoom: pointZoom
                };
            }

            var _newViewport = newViewport,
                longitude = _newViewport.longitude,
                latitude = _newViewport.latitude,
                zoom = _newViewport.zoom;


            onSelected(_extends({}, viewport, { longitude: longitude, latitude: latitude, zoom: zoom, transitionDuration: transitionDuration }), item);

            if (hideOnSelect) {
                _this.setState({ results: [] });
            }
        };

        _this.showResults = function () {
            _this.setState({ showResults: true });
        };

        _this.hideResults = function () {
            setTimeout(function () {
                _this.setState({ showResults: false });
            }, 300);
        };

        _this.client = new mapbox(props.mapboxApiAccessToken);
        return _this;
    }

    createClass(Geocoder, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                results = _state.results,
                showResults = _state.showResults;
            var _props = this.props,
                formatItem = _props.formatItem,
                className = _props.className,
                inputComponent = _props.inputComponent,
                itemComponent = _props.itemComponent;


            var Input = inputComponent || 'input';
            var Item = itemComponent || 'div';

            return React.createElement(
                'div',
                { className: 'react-geocoder ' + className },
                React.createElement(Input, { onChange: this.onChange, onBlur: this.hideResults, onFocus: this.showResults }),
                showResults && !!results.length && React.createElement(
                    'div',
                    { className: 'react-geocoder-results' },
                    results.map(function (item, index) {
                        return React.createElement(
                            Item,
                            {
                                key: index, className: 'react-geocoder-item', onClick: function onClick() {
                                    return _this2.onSelected(item);
                                },
                                item: item
                            },
                            formatItem(item)
                        );
                    })
                )
            );
        }
    }]);
    return Geocoder;
}(Component);

Geocoder.propTypes = {
    timeout: PropTypes.number,
    queryParams: PropTypes.object,
    viewport: PropTypes.object.isRequired,
    onSelected: PropTypes.func.isRequired,
    transitionDuration: PropTypes.number,
    hideOnSelect: PropTypes.bool,
    pointZoom: PropTypes.number,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    formatItem: PropTypes.func,
    className: PropTypes.string,
    inputComponent: PropTypes.func,
    itemComponent: PropTypes.func,
    limit: PropTypes.number,
    localGeocoder: PropTypes.func,
    localOnly: PropTypes.bool
};

Geocoder.defaultProps = {
    timeout: 300,
    transitionDuration: 0,
    hideOnSelect: false,
    pointZoom: 16,
    formatItem: function formatItem(item) {
        return item.place_name;
    },
    queryParams: {},
    className: '',
    limit: 5
};

export default Geocoder;
//# sourceMappingURL=index.es.js.map
