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
  var gi = metadata.gwp.split(',');
  var wi = metadata.water.split(',');
  var fi = metadata.flare.split(',');
  var pi = metadata.fugitives.split(',');
  var ri = metadata.refinery.split(',');
  var ai = [1,0];
  var zi = [1,0];
  var li = [1, 0];

  gi.forEach(function (_, g) {
    vi.forEach(function (_, v) {
      pi.forEach(function (_,p) {
        wi.forEach(function (_, w) {
          fi.forEach(function (_, f) {
            t.notThrows(function () { JSON.parse(fs.readFileSync('../app/assets/data/opgee/opgee_run' + g + p + v + w + f + '.json')); });
          });
        });
      });
    });
  });

  zi.forEach(function (_,z) {
      ai.forEach(function (_, a) {
        ri.forEach(function (_, r) {
         li.forEach(function (_, l) {
            t.notThrows(function () { JSON.parse(fs.readFileSync('../app/assets/data/prelim/prelim_run' + z + a + r + l + '.json')); });
          });
        });
      });
    });
  });
