#flaring_2017-8szeig["BCM_2017" > 0] {
  marker-allow-overlap: true;
  marker-ignore-placement: true;
  marker-line-opacity: 0;
  marker-width: 3;
  marker-opacity: .25;
  direct-image-filters: agg-stack-blur(2,2);
  [zoom>=5] { marker-width: 4; }
  [zoom>=7] { marker-width: 5; }

  [zoom>=4] { marker-opacity: .4; }
  [zoom>=6] { marker-opacity: .6; }

  marker-fill: #ffffb2;
  ["BCM_2017" > 0.001] { marker-fill: #fed976; }
  ["BCM_2017" > 0.002] { marker-fill: #feb24c; }
  ["BCM_2017" > 0.003] { marker-fill: #fd8d3c; }
  ["BCM_2017" > 0.004] { marker-fill: #f03b20; }
}