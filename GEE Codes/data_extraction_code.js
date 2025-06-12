// 1. Load Bangladesh boundary
var bd = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level1')
           .filter(ee.Filter.eq('ADM0_NAME', 'Bangladesh'));


Map.centerObject(bd, 7);



// 2. Generate random sample points
var points = ee.FeatureCollection.randomPoints({
  region: bd.geometry(),
  points: 2000,
  seed: 42
});

Map.addLayer(points, {color: 'green'}, 'Sample Points');



// 3. DEM and Terrain Analysis
var dem = ee.Image('USGS/SRTMGL1_003').rename('El'); // Elevation
var terrain = ee.Algorithms.Terrain(dem);
var slope = terrain.select('slope').rename('Sl');
var aspect = terrain.select('aspect').rename('As');
var curvature = slope.gradient().select('x').rename('Cu');

// Flow Accumulation from MERIT
var flowAccum = ee.Image('MERIT/Hydro/v1_0_1').select('upa').rename('FA');

// SPI, STI, TWI calculations
var slopeRad = slope.multiply(Math.PI).divide(180).tan();
var logFlowAccum = flowAccum.add(1).log();
var twi = logFlowAccum.subtract(slopeRad.log()).rename('TWI');
var spi = flowAccum.multiply(slopeRad).rename('SPI');
var sti = flowAccum.sqrt().multiply(slopeRad).rename('STI');

// TPI: Elevation - mean in neighborhood
var meanElev = dem.reduceNeighborhood({
  reducer: ee.Reducer.mean(),
  kernel: ee.Kernel.circle({radius: 150, units: 'meters'})
});
var tpi = dem.subtract(meanElev).rename('TPI');

// Roughness and TRI
var roughness = dem.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.square(3)
}).rename('Rn');
var tri = dem.neighborhoodToBands(ee.Kernel.square(1))
             .reduce(ee.Reducer.stdDev()).rename('TRI');

// 4. Stack topographic variables
var topoStack = dem
  .addBands([slope, aspect, curvature, twi, flowAccum, spi, sti, tpi, roughness, tri]);

// 5. NDVI from Sentinel-2 (2023 median)
var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterDate('2023-01-01', '2023-12-31')
  .filterBounds(bd)
  .map(function(img) {
    return img.select(['B4', 'B8']).copyProperties(img, img.propertyNames());
  });

var s2_median = s2.median();
var ndvi = s2_median.normalizedDifference(['B8', 'B4']).rename('NDVI');

// Add NDVI to topographic stack
var fullImage = topoStack.addBands(ndvi);

// 6. Sample topographic + NDVI data at points
var sampledTopo = fullImage.sampleRegions({
  collection: points,
  scale: 30,
  geometries: true
});



// Add lat/lon to sampled features
sampledTopo = sampledTopo.map(function(f) {
  var coords = f.geometry().coordinates();
  return f.set({
    longitude: coords.get(0),
    latitude: coords.get(1)
  });
});

// 9. Export full dataset
Export.table.toDrive({
  collection: sampledTopo,
  description: 'bd_topo_v1',
  fileFormat: 'CSV'
});


// 7. Soil texture
var soilTexture = ee.Image('OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02')
                   .select('b0').rename('SoilTextureClass');
var sampledSoil = soilTexture.sampleRegions({
  collection: points,
  scale: 250,
  geometries: true
});

// Add lat/lon to sampled features
sampledSoil = sampledSoil.map(function(f) {
  var coords = f.geometry().coordinates();
  return f.set({
    longitude: coords.get(0),
    latitude: coords.get(1)
  });
});


// 9. Export full dataset
Export.table.toDrive({
  collection: sampledSoil,
  description: 'bd_soil_v1',
  fileFormat: 'CSV'
});



// 8. Lithology FeatureCollection
var lithology = ee.FeatureCollection('projects/ee-ar137375/assets/lithology/geo8bg');

// Fix: properly map lithology to each point
var pointsWithLithology = points.map(function(pt) {
  var geom = pt.geometry();  // Extract the geometry from the Feature
  var litho = lithology.filterBounds(geom).first();  // Use geometry for spatial filter
  return pt.set('GLG', litho.get('GLG'));
});

var sampledWithCoords = pointsWithLithology.map(function(feature) {
  var coords = feature.geometry().coordinates();
  return feature.set({
    longitude: coords.get(0),
    latitude: coords.get(1)
  });
});

// Export to CSV for analysis
Export.table.toDrive({
  collection: sampledWithCoords,
  description: 'bd_lithology_points_v3',
  fileFormat: 'CSV'
});

