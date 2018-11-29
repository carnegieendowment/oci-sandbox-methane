var test = require('ava');
var fs = require('fs');

test('All JSON files should parse correctly', function (t) {
  var blurbs = fs.readFileSync('../app/assets/data/blurbs.json');
  var oilfields = fs.readFileSync('../app/assets/data/oilfields.geojson');
  var info = fs.readFileSync('../app/assets/data/info.json');
  var metadata = fs.readFileSync('../app/assets/data/metadata.json');
  var prices = fs.readFileSync('../app/assets/data/prices.json');
  var related = fs.readFileSync('../app/assets/data/related.json');
  [ blurbs, oilfields, prices, related, metadata, info ].forEach(function (file) {
    t.notThrows(function () { JSON.parse(file); });
  });
});

test('All possible runs should be readable', function (t) {
  // Load all data based on metadata
  var metadata = JSON.parse(fs.readFileSync('../app/assets/data/metadata.json'));
  var vi = metadata.venting.split(',');
  var ti = metadata.methane.split(',');
  var gi = metadata.gwp.split(',');
  var pi = metadata.fugitives.split(',');
  var si = metadata.solarSteam.split(',');
  var wi = metadata.water.split(',');
  var fi = metadata.flare.split(',');
  var ri = metadata.refinery.split(',');
  var li = [1, 0];
  var yi = [1, 0];
  var ai = [1, 0];
  var zi = [1, 0];
  
  ti.forEach(function (_, t) {
    gi.forEach(function (_, g) {
      pi.forEach(function (_, p) {
        vi.forEach(function (_, v) {
          wi.forEach(function (_, w) {
            fi.forEach(function (_, f) {
              si.forEach(function (_, s) {
                t.notThrows(function () { JSON.parse(fs.readFileSync('../app/assets/data/opgee/opgee_run' + t + g + p + v + w + f + s + '.json')); });
              });
            });
          });
        });
      });
    });
  });
  
  zi.forEach(function (_, z) {
    ai.forEach(function (_, a) {
      ri.forEach(function (_, r) {
        li.forEach(function (_, l) {
          yi.forEach(function (_, y) {
            t.notThrows(function () { JSON.parse(fs.readFileSync('../app/assets/data/prelim/prelim_run' + z + a + r + l + y + '.json')); });
          });
        });
      });
    });
  });
});
