# Week 6 - A6 Assignment: Chart Justifications

## Chart 1: Elevation Gain by Difficulty Rating (Box Plot)

**File:** `chart1_elevation_by_difficulty.png` (or `.svg`)

**What it shows:** Distribution of elevation gain across three difficulty levels (Easy, Moderate, Difficult)

**Why this chart type:**
I chose a **box plot** instead of a bar chart because it shows the full distribution of data - not just the average. The box plot reveals:
- The median elevation for each difficulty level
- The range (min to max)
- Quartiles showing where 50% of trails fall
- Outliers that don't fit the typical pattern

This matters because just showing averages would hide important patterns. For example, the box plot shows that even the *maximum* elevation for Easy trails is lower than the *median* for Difficult trails - there's almost no overlap. This is a much stronger finding than "Difficult trails have higher average elevation."

**Chart type rationale (4-rule guide):**
- **Comparing categories:** ✓ (Easy vs Moderate vs Difficult)
- **Distribution matters:** ✓ (Want to see spread, not just average)
- **Multiple data points per category:** ✓ (Many trails in each difficulty level)
- **Answer:** Box plot is ideal for comparing distributions across categories

**Key finding:** Elevation gain is the strongest predictor of trail difficulty. Difficult trails average 3,836 feet of elevation gain compared to just 345 feet for Easy trails - an 11x difference. The clear separation between categories suggests elevation should be weighted heavily in trail recommendation systems.

---

## Chart 2: Distance vs Elevation Gain by Difficulty (Scatter Plot)

**File:** `chart2_distance_vs_elevation.png` (or `.svg`)

**What it shows:** Relationship between trail distance (x-axis) and elevation gain (y-axis), with points colored by difficulty rating

**Why this chart type:**
I chose a **scatter plot** because I needed to show the relationship between two continuous variables (distance and elevation) while also revealing a third dimension (difficulty) through color. This chart type lets viewers see:
- Whether distance and elevation correlate (they do, but not perfectly)
- How difficulty emerges from the *combination* of both factors
- Clusters and patterns (e.g., Difficult trails in upper-right quadrant)
- Individual outliers (short but steep trails, or long but flat trails)

I added reference lines at 3,000 feet elevation and 10 miles distance based on patterns I observed in the data - these help viewers see the approximate thresholds where trails become "Difficult."

**Chart type rationale (4-rule guide):**
- **Two continuous variables:** ✓ (Distance and elevation)
- **Looking for relationships/patterns:** ✓ (How do they combine to predict difficulty?)
- **Want to preserve individual data points:** ✓ (Each trail tells a story)
- **Answer:** Scatter plot shows relationships between continuous variables

**Key finding:** Difficult trails emerge through *either* high elevation (>3,000 ft) *or* long distance (>10 miles), or both. Difficult trails average 14.4 miles and 3,836 feet of elevation. This reveals that trail difficulty has multiple pathways - a trail can be challenging through vertical endurance, horizontal endurance, or both.

---

## Chart 3: Family-Friendly vs Non-Family-Friendly Comparison (Grouped Bar Chart)

**File:** `chart3_family_friendly_comparison.png` (or `.svg`)

**What it shows:** Average distance and elevation gain for family-friendly vs. non-family-friendly trails, side by side

**Why this chart type:**
I chose a **grouped bar chart** because I needed to compare two groups (family-friendly vs not) across two metrics (distance and elevation). The grouped bars make it easy to see:
- The magnitude of difference for each characteristic
- Which characteristic differs more between groups (elevation shows a bigger gap than distance)
- Direct visual comparison without requiring mental math

I scaled elevation to "hundreds of feet" so both metrics could share the same y-axis scale, making visual comparison easier. The bars are color-coded (blue for distance, orange for elevation) to help viewers distinguish the metrics.

**Chart type rationale (4-rule guide):**
- **Comparing categories:** ✓ (Family-friendly vs not)
- **Multiple metrics to compare:** ✓ (Distance and elevation)
- **Want to show magnitude of differences:** ✓ (How much bigger are non-family trails?)
- **Answer:** Grouped bar chart compares multiple metrics across categories

**Key finding:** Family-friendly trails have 4.6x less elevation gain (589 ft vs 2,682 ft) and 3.0x less distance (3.6 miles vs 10.9 miles) than non-family trails. The larger elevation gap suggests steep climbs are the primary barrier to family accessibility, more so than distance.

---

## Competency Claims

### C3 — Data Cleaning and File Handling
I loaded the HikingTrails_TheGorge.csv file and handled messy real-world data by writing a custom `extract_number()` function to parse text fields like "4.8 miles round trip" into numeric values. I used regex pattern matching (`re.search(r'[\d,]+\.?\d*', str(text))`) to extract the first number from each field, handled missing values with `dropna()`, and normalized the Difficulty column which had 9 variations (e.g., "Difficult (scramble, exposure)") down to 3 clean categories using the `clean_difficulty()` function. The cleaned data produced consistent, repeatable output suitable for analysis.

### C5 — Data Analysis with Pandas
I used pandas operations including `groupby()`, `agg()`, and `apply()` to answer three analytical questions. For Question 1, I grouped trails by difficulty level and calculated mean elevation gain using `df_clean.groupby('Difficulty').agg({'Elevation_feet': 'mean'})`, revealing that Difficult trails average 3,836 feet vs. 345 feet for Easy trails - an 11x difference. For Question 3, I filtered data with boolean indexing (`df_family[df_family['Is_Family_Friendly']==1]`) to compare family-friendly vs. non-family trails, finding a 4.6x difference in elevation gain (589 ft vs 2,682 ft). Each analysis is documented with interpretation explaining what the numbers mean.

### C6 — Data Visualization
I created three charts using Plotly, each with a clear title stating the finding (not just describing the data), labeled axes with units, and appropriate chart types based on the four-rule guide:
- **Chart 1:** Box plot for comparing elevation distributions across difficulty categories (shows median, quartiles, outliers)
- **Chart 2:** Scatter plot for showing the relationship between distance and elevation as they predict difficulty
- **Chart 3:** Grouped bar chart for comparing average trail characteristics between family-friendly groups

All charts are saved as PNG files using `fig.write_image()` and published in the Jupyter notebook at `/Users/manishvarrier/Documents/HCDE530/week6/week6_mp1_starter.ipynb`. Each chart has accompanying markdown cells explaining the finding.

### C7 — Critical Evaluation and Professional Judgment
I made several evidence-based decisions rather than accepting defaults:
- Chose box plots over bar charts for Question 1 because they show the full distribution (median, quartiles, outliers) rather than just means, revealing that Difficult trails have consistently higher elevation with minimal overlap with Easy trails
- Added reference lines at 3,000 feet and 10 miles in Chart 2 based on observed patterns in the data rather than arbitrary thresholds
- Scaled elevation to "hundreds of feet" in Chart 3 to make visual comparison with distance feasible on the same axis
- Acknowledged data limitations (geographic scope limited to The Gorge region, subjective difficulty ratings) in my conclusions rather than overstating the findings

Each decision was documented with reasoning in markdown cells, explaining *why* I chose that approach and what alternative I considered.
