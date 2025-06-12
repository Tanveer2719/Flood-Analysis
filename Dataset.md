# 🇧🇩 Bangladesh Geospatial Terrain and Environmental Dataset

## 🗂️ Dataset Overview

This [dataset](/combined%20Data.csv) contains **1,571 spatial sample points** across Bangladesh, each annotated with key geospatial, topographic, hydrological, soil, and lithological features. The data was generated using Google Earth Engine by sampling various remote sensing products and earth observation datasets.

---


## 📍 Geographic Coordinates

Each row contains:
- `latitude`: Latitude of the sample point (WGS84)
- `longitude`: Longitude of the sample point (WGS84)

---

## 🧾 Features and Descriptions

| Column | Description | Source | Unit / Scale |
|--------|-------------|--------|--------------|
| `El` | Elevation | USGS/SRTMGL1_003 | Meters |
| `Sl` | Slope derived from DEM | SRTM | Degrees |
| `Aspect` | Terrain aspect (direction of slope) | SRTM | Degrees |
| `TRI` | Terrain Ruggedness Index | Derived from DEM | Dimensionless |
| `TPI` | Topographic Position Index (elevation – local mean) | Derived from DEM | Meters |
| `Rn` | Surface roughness (local std. dev. of elevation) | Derived from DEM | Meters |
| `FA` | Flow Accumulation | MERIT Hydro (`upa`) | Log-scaled |
| `SPI` | Stream Power Index | Derived | Log-scaled |
| `STI` | Sediment Transport Index | Derived | Dimensionless |
| `TWI` | Topographic Wetness Index | Derived | Log-scaled |
| `NDVI` | Normalized Difference Vegetation Index (mean of 2023) | Sentinel-2 (2023 median) | -1 to +1 |
| `SoilTextureClass` | Soil texture class (coded, USDA classification) | OpenLandMap | Integer (1–12) |
| `GLG` | Ground Lithological Group (custom labels) | US-Geological Survey | Categorical |

---

## 🗃️ Data Format

- **Format**: CSV
- **Rows**: 1,571
- **Columns**: 16
- **Encoding**: UTF-8

---

## 🛰️ Data Sources

| Dataset | Source |
|---------|--------|
| Digital Elevation Model (DEM) | [USGS SRTMGL1 003](https://developers.google.com/earth-engine/datasets/catalog/USGS_SRTMGL1_003) |
| Flow Accumulation | [MERIT Hydro](https://developers.google.com/earth-engine/datasets/catalog/MERIT_Hydro_v1_0_1) |
| Vegetation (NDVI) | [Sentinel-2 (2023 median)](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS/S2_SR) |
| Soil Texture | [OpenLandMap: Soil Texture Class](https://maps.openlandmap.org/) |
| Lithology | [US Geological Survey](https://catalog.data.gov/dataset/surface-geology-of-bangladesh-geo8bg) |
| Bangladesh Boundary | [FAO GAUL Level 1 - 2015](https://developers.google.com/earth-engine/datasets/catalog/FAO_GAUL_SIMPLIFIED_500m_2015_level1) |

---

## Open Land Map Soil Texture Mapping
- 1. Cl: Clay
- 2. SiCl: Silty Clay
- 3. SaCl: Sandy Clay
- 4. ClLo: Clay Loam
- 5. SiClLo: Silty Clay Loam
- 6. SaClLo: Sandy Clay Loam
- 7. Lo: Loam
- 8. SiLo: Silty Loam
- 9. SaLo: Sandy Loam
- 10. Si: Silt
- 11. LoSa: Loamy Sand
- 12. Sa: Sand
