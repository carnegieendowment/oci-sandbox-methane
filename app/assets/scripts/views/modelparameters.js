/*global Oci, wNumb */
'use strict';

var Backbone = require('backbone');
var d3 = require('d3');
var $ = require('jquery');
import _ from 'lodash';
var noUiSlider = require('nouislider');

var template = require('../templates/modelparameters.ejs');

var self;
var ventingValues;
var ventingLabels;
var flaringValues;
var flaringLabels;
var waterValues;
var waterLabels;
var cokeValues;
var cokeLabels;
var fugitivesValues;
var fugitivesLabels;
var solarsteamLabels;
var solarsteamValues;

var ModelParameters = Backbone.View.extend({

  template: template,

  el: '#model-parameters',

  events: {
    'click .toggle': 'toggleModelParameters',
    'change input': 'updateSummary',
    'change .slider': 'updateSummary',
    'change select': 'updateSummary'
  },

  initialize: function () {
    self = this;
    this.setSliders();
  },

  render: function () {
    this.$el.html(this.template());
    this.addSliders();
    this.updateSummary();
    this.listenTo(this, 'sliderUpdate', this.updateSummary);
  },

  getModelValues: function () {
    return {
      venting: (this.ventingSlider.get() / 100),
      fugitives: (this.fugitivesSlider.get() / 100),
      water: (this.waterSlider.get() / 100),
      flaring: (this.flaringSlider.get() / 100),
      solarsteam: (this.solarsteamSlider.get() / 100),
      showCoke: (this.cokeSlider.get() / 100),
      refinery: $('#dropdown-refinery').val(),
      lpg: $('#toggle-lpg').is(':checked'),
      gwp: $('#toggle-gwp').is(':checked'),
      hydrogen: $('#toggle-hydrogen').is(':checked'),
      methane: $('#toggle-methane').is(':checked')
    };
  },

  // Used to set values on load
  setModelParameters: function (params) {
    if (params.opgee) {
      try {
        // We know the format of the param 'run###'
        var venting = params.opgee[6];
        var water = params.opgee[7];
        var flaring = params.opgee[8];
        var solarsteam = params.opgee[9];
        var gwp = params.opgee[4];
        var fugitives = params.opgee[5];
        var methane = params.opgee[3];
        var fugitivesValue = parseFloat(Oci.data.metadata.fugitives.split(',')[fugitives]) * 100;
        this.fugitivesSlider.set(fugitivesValue);
        var solarsteamValue = parseFloat(Oci.data.metadata.solarsteam.split(',')[solarsteam]) * 100;
        this.solarsteamSlider.set(solarsteamValue);
        var ventingValue = parseFloat(Oci.data.metadata.venting.split(',')[venting]) * 100;
        this.ventingSlider.set(ventingValue);
        var waterValue = parseFloat(Oci.data.metadata.water.split(',')[water]) * 100;
        this.waterSlider.set(waterValue);
        var flaringValue = parseFloat(Oci.data.metadata.flare.split(',')[flaring]) * 100;
        this.flaringSlider.set(flaringValue);
        $('#toggle-gwp').attr('checked', Boolean(gwp));
        $('#toggle-methane').attr('checked', Boolean(methane));
      } catch (e) {
        console.warn('bad input parameter', e);
      }
    }

    if (params.prelim) {
      try {
        // We know the format of the param 'run##'
        var refinery = params.prelim[4];
        var lpg = params.prelim[5];
        var hydrogen = params.prelim[3];
        $('#dropdown-refinery').prop('selectedIndex', refinery);
        $('#toggle-lpg').attr('checked', Boolean(lpg));
        $('#toggle-hydrogen').attr('checked', Boolean(hydrogen));
        $('#toggle-gwp').attr('checked', Boolean(gwp));
        $('#toggle-methane').attr('checked', Boolean(methane));
      } catch (e) {
        console.warn('bad input parameter', e);
      }
    }

    if (params.showCoke !== undefined) {
      this.cokeSlider.set(Number(params.showCoke) * 100);
    }

    self.updateSummary();
  },

  updateSummary: function () {
    var fugitives = parseInt(this.fugitivesSlider.get());
    $('.value.fugitives span').html(fugitives + '%');
    var venting = parseInt(this.ventingSlider.get());
    $('.value.venting span').html(venting + '%');
    var flaring = parseInt(this.flaringSlider.get());
    $('.value.flare span').html(flaring + '%');
    var water = parseInt(this.waterSlider.get());
    $('.value.water span').html(water + '%');
    var solarsteam = parseInt(this.solarsteamSlider.get());
    $('.value.solarsteam span').html(solarsteam + '%');
    var petcoke = parseInt(this.cokeSlider.get());
    $('.value.petcoke span').html(petcoke + '%');
    var lpg = $('#toggle-lpg').is(':checked') ? 'Sell' : 'Use';
    $('.value.lpg span').html(lpg);
    var hydrogen = $('#toggle-hydrogen').is(':checked') ? 'No' : 'Yes';
    $('.value.hydrogen span').html(hydrogen);
    var gwp = $('#toggle-gwp').is(':checked') ? '20' : '100';
    $('.value.gwp span').html(gwp);
    var methane = $('#toggle-methane').is(':checked') ? 'Yes' : 'No';
    $('.value.methane span').html(methane);
    var refinery = $('#dropdown-refinery').val();
    switch (refinery) {
      case '0 = Default':
        refinery = 'Default';
        break;
      case '1 = Hydroskimming':
        refinery = 'Hydro';
        break;
      case '2 = Medium Conversion':
        refinery = 'Medium';
        break;
      case '3 = Deep Conversion (Coking)':
        refinery = 'Deep Coke';
        break;
      case '4 = Deep Conversion (Hydrotreating)':
        refinery = 'Deep Hydro';
        break;
    }
    $('.value.refinery span').html(refinery);
  },

  addSliders: function () {
    var self = this;

    this.fugitivesSlider = noUiSlider.create($('#slider-fugitives')[0], {
      start: 0,
      connect: 'lower',
      snap: true,
      range: _.zipObject(fugitivesLabels, fugitivesValues),
      pips: {
        mode: 'values',
        values: fugitivesValues,
        density: 10,
        format: wNumb({
          postfix: '%'
        }),
        stepped: true
      }
    });
    this.fugitivesSlider.on('update', function (value) {
      self.trigger('sliderUpdate', value);
    });

    this.ventingSlider = noUiSlider.create($('#slider-venting')[0], {
      start: 0,
      connect: 'lower',
      snap: true,
      range: _.zipObject(ventingLabels, ventingValues),
      pips: {
        mode: 'values',
        values: ventingValues,
        density: 10,
        format: wNumb({
          postfix: '%'
        }),
        stepped: true
      }
    });
    this.ventingSlider.on('update', function (value) {
      self.trigger('sliderUpdate', value);
    });

    this.flaringSlider = noUiSlider.create($('#slider-flaring')[0], {
      start: 100,
      connect: 'lower',
      snap: true,
      range: _.zipObject(flaringLabels, flaringValues),
      pips: {
        mode: 'values',
        values: flaringValues,
        density: 10,
        format: wNumb({
          postfix: '%'
        }),
        stepped: true
      }
    });
    this.flaringSlider.on('update', function (value) {
      self.trigger('sliderUpdate', value);
    });

    this.waterSlider = noUiSlider.create($('#slider-water')[0], {
      start: 100,
      connect: 'lower',
      snap: true,
      range: _.zipObject(waterLabels, waterValues),
      pips: {
        mode: 'values',
        values: waterValues,
        density: 10,
        format: wNumb({
          postfix: '%'
        }),
        stepped: true
      }
    });
    this.waterSlider.on('update', function (value) {
      self.trigger('sliderUpdate', value);
    });

    this.solarsteamSlider = noUiSlider.create($('#slider-solarsteam')[0], {
      start: 0,
      connect: 'lower',
      snap: true,
      range: _.zipObject(solarsteamLabels, solarsteamValues),
      pips: {
        mode: 'values',
        values: solarsteamValues,
        density: 10,
        format: wNumb({
          postfix: '%'
        }),
        stepped: true
      }
    });
    this.solarsteamSlider.on('update', function (value) {
      self.trigger('sliderUpdate', value);
    });

    this.cokeSlider = noUiSlider.create($('#slider-coke')[0], {
      start: 100,
      connect: 'lower',
      snap: true,
      range: _.zipObject(cokeLabels, cokeValues),
      pips: {
        mode: 'values',
        values: cokeValues,
        density: 10,
        format: wNumb({
          postfix: '%'
        }),
        stepped: true
      }
    });
    this.cokeSlider.on('update', function (value) {
      self.trigger('sliderUpdate', value);
    });
  },

  toggleModelParameters: function (e) {
    e.preventDefault();
    $('#model-parameters').toggleClass('open');
  },

  // set the slider options based on the metadata
  setSliders: function () {
    var m = Oci.data.metadata;

    ventingValues = this.metadataToArray(m.venting);
    fugitivesValues = this.metadataToArray(m.fugitives);
    flaringValues = this.metadataToArray(m.flare);
    waterValues = this.metadataToArray(m.water);
    solarsteamValues = this.metadataToArray(m.solarsteam);
    cokeValues = [0, 50, 100];

    ventingLabels = this.sliderHelper(ventingValues);
    fugitivesLabels = this.sliderHelper(fugitivesValues);
    flaringLabels = this.sliderHelper(flaringValues);
    waterLabels = this.sliderHelper(waterValues);
    solarsteamLabels = this.sliderHelper(solarsteamValues);
    cokeLabels = this.sliderHelper(cokeValues);
  },

  // helper function for setSliders
  sliderHelper: function (array) {
    var min = d3.min(array);
    var max = d3.max(array);
    var tempArray = array.map(function (val) {
      return ((val - min) / ((max - min) / 100)).toFixed(0) + '%';
    });
    tempArray[0] = 'min';
    tempArray[tempArray.length - 1] = 'max';
    return tempArray;
  },

  metadataToArray: function (metadata) {
    return metadata.split(',').sort(function (a, b) {
      return Number(a) - Number(b);
    }).map(function (val) { return Number(val) * 100; });
  }
});

module.exports = ModelParameters;
