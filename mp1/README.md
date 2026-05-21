# Mini Project 1: Columbia River Gorge Hiking Trails Analysis

**Student:** Manish Varrier
**Course:** HCDE 530
**Date:** May 20, 2026

## Repository Contents

This folder contains all assets for Mini Project 1, a published Jupyter notebook analyzing hiking trail characteristics in the Columbia River Gorge.

### Files

- **`mp1.ipynb`** - Main analysis notebook with all required sections
- **`mp1.md`** - Competency claims document
- **`HikingTrails_TheGorge.csv`** - Primary dataset (172 hiking trails)
- **`Trail_hazards_danger.csv`** - Secondary dataset (not used in this analysis)
- **`save_charts.py`** - Python script to generate chart images
- **`README.md`** - This file

### Dataset

The primary dataset (`HikingTrails_TheGorge.csv`) contains information about 172 hiking trails in the Columbia River Gorge, including:

- Trail characteristics: distance, elevation gain, high point
- Difficulty ratings: Easy, Moderate, Difficult
- Accessibility information: family-friendly status, seasonal access
- Additional attributes: trail type, crowding, backpackability

**Source:** [Kaggle - Columbia River Gorge Hiking Trails](https://www.kaggle.com/datasets/chuckh193333/hiking-trails-columbia-river-gorge)

## How to Run This Notebook

### Option 1: View on GitHub (Recommended)

GitHub renders Jupyter notebooks natively. Simply navigate to this folder on GitHub and click on `mp1.ipynb` to view the full analysis with all outputs and visualizations.

**GitHub URL:** `https://github.com/[your-username]/hcde530/tree/main/mp1`

### Option 2: Run Locally

1. **Install required packages:**
   ```bash
   pip install jupyter plotly kaleido pandas
   ```

2. **Navigate to this folder:**
   ```bash
   cd /path/to/HCDE530/mp1
   ```

3. **Launch Jupyter:**
   ```bash
   jupyter notebook mp1.ipynb
   ```

4. **Run all cells:**
   - In Jupyter: `Kernel → Restart & Run All`

### Option 3: Run in Google Colab

1. Upload `mp1.ipynb` and `HikingTrails_TheGorge.csv` to Google Colab
2. Run all cells in order
3. Charts will display inline

## Saving Chart Images

The notebook is configured to automatically save charts as PNG files using the `kaleido` library. However, if you encounter browser issues with kaleido, you can manually save charts:

### Method 1: Use the Python Script

```bash
cd /path/to/HCDE530/mp1
python3 save_charts.py
```

This will generate:
- `chart1_elevation_by_difficulty.png`
- `chart2_family_friendly_comparison.png`
- `chart3_seasonal_elevation_patterns.png`

### Method 2: Save Manually from Jupyter

When running the notebook in Jupyter:

1. Hover over any chart
2. Click the camera icon (📷) in the upper-right corner
3. Save with the appropriate filename:
   - Chart 1: `chart1_elevation_by_difficulty.png`
   - Chart 2: `chart2_family_friendly_comparison.png`
   - Chart 3: `chart3_seasonal_elevation_patterns.png`

### Method 3: Export as HTML (Alternative)

If PNG export fails entirely:

```python
fig1.write_html('chart1_elevation_by_difficulty.html')
fig2.write_html('chart2_family_friendly_comparison.html')
fig3.write_html('chart3_seasonal_elevation_patterns.html')
```

This creates interactive HTML files that can be viewed in any browser.

## Research Questions

This analysis explores three key questions:

1. **Which trail characteristics (distance, elevation gain, highest point) are most strongly associated with higher difficulty ratings?**

2. **How do trail features such as elevation gain and distance differ between family-friendly and non-family-friendly trails?**

3. **Do seasonal accessibility patterns cluster around certain difficulty levels or elevation thresholds?**

## Key Findings

### Finding 1: Elevation Gain is the Strongest Predictor of Difficulty

- Difficult trails average **4,041 feet** of elevation gain
- Easy trails average **345 feet** of elevation gain
- This represents an **11.7x difference**
- The clear separation suggests elevation gain should be weighted heavily in trail recommendation systems

### Finding 2: Family-Friendly Trails Have Lower Elevation

- Family-friendly trails: **589 feet** elevation gain average
- Non-family-friendly trails: **3,067 feet** elevation gain average
- This represents a **5.2x difference** (compared to only 3.2x for distance)
- Steep climbs are the primary barrier to family accessibility

### Finding 3: Seasonal Access Correlates with Elevation

- Year-round trails: **943 feet** average high point
- Seasonal trails: **3,321 feet** average high point
- Clear threshold around **2,000 feet** for seasonal closures
- 86% of Easy trails are year-round accessible vs. only 11% of Difficult trails

## Competency Claims

This project demonstrates proficiency in:

- **C3 — Data Cleaning and File Handling:** Custom functions to extract numeric values from text, handle missing data, and normalize inconsistent categories
- **C5 — Data Analysis with Pandas:** Multiple pandas operations including `groupby()`, `agg()`, `crosstab()`, and `apply()` to answer analytical questions
- **C6 — Data Visualization:** Three publication-quality charts with appropriate types, clear titles, labeled axes, and written interpretations
- **C7 — Critical Evaluation and Professional Judgment:** Thoughtful chart type selection, validation of unexpected findings, and acknowledgment of data limitations

See `mp1.md` for detailed competency claim evidence.

## Technical Notes

### Data Cleaning Challenges

The dataset required significant cleaning:

1. **Text-based numeric fields:** Distance, elevation, and high point were stored as text with units (e.g., "4.8 miles round trip", "1,640 feet")
2. **Inconsistent categories:** Difficulty had 9 variations that needed standardization
3. **Missing values:** 21 missing high point values, handled via selective filtering

### Tools Used

- **Python 3.13**
- **Pandas:** Data manipulation and analysis
- **Plotly:** Interactive visualizations
- **NumPy:** Numeric operations and NaN handling
- **Jupyter:** Notebook environment

## Contact

**Manish Varrier**
HCDE 530 - Spring 2026

---

*This project was completed as part of the HCDE 530 course curriculum at the University of Washington.*
