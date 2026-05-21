# Mini Project 1 - Competency Claims

**Student:** Manish Varrier
**Date:** May 20, 2026
**Project:** Columbia River Gorge Hiking Trails Analysis

---

## Required Competency Claims

### C3 — Data Cleaning and File Handling

**Claim:**

I loaded the `HikingTrails_TheGorge.csv` file containing messy real-world data and systematically cleaned it for analysis. The dataset had three major data quality issues:

1. **Text-based numeric fields:** Distance, elevation gain, and high point were stored as text with units (e.g., "4.8 miles round trip", "1,640 feet"). I wrote a custom `extract_number()` function that:
   - Removes comma separators from numbers like "1,640"
   - Uses string splitting to extract the first numeric value
   - Handles missing values by returning `np.nan`
   - Converts all values to float type for mathematical operations

2. **Inconsistent categorical values:** The Difficulty column had 9 variations including "Difficult", "Difficult (scramble, exposure)", and "Difficult due to elevation gain". I wrote a `clean_difficulty()` function that normalized these to three standard categories (Easy, Moderate, Difficult) using string matching.

3. **Missing values:** I identified missing data using `df.isnull().sum()`, finding 21 missing values in High Point (12%), 2 in Trail Type, 2 in Family Friendly, and 1 each in several other columns. Rather than dropping all incomplete rows, I used `dropna(subset=[...])` on a per-analysis basis to preserve as much data as possible.

**Evidence in repository:**
- `mp1.ipynb` cells showing the `extract_number()` and `clean_difficulty()` functions
- Data Profile section showing before/after comparison of raw vs. cleaned data
- Output showing successful conversion: 172 rows processed with 0 errors

The cleaning script produced consistent, repeatable output—running the notebook from top to bottom (`Kernel → Restart & Run All`) produces identical results every time.

---

### C5 — Data Analysis with Pandas

**Claim:**

I used pandas to answer three specific analytical questions about hiking trail characteristics. Each analysis required multiple pandas operations:

**Question 1: Which characteristics predict difficulty?**
- Used `groupby('Difficulty_Clean')` with `.agg(['mean'])` to calculate average distance, elevation gain, and high point for each difficulty level
- Applied `dropna(subset=[...])` to filter for complete records before analysis
- Result: Discovered that Difficult trails average **4,041 feet** of elevation gain vs. **345 feet** for Easy trails—an 11.7x difference. This was unexpected because I initially thought distance would be equally important, but distance only showed a 5.3x difference.

**Question 2: How do family-friendly trails differ?**
- Used `groupby('Family_Friendly_Clean')` with `.agg(['mean', 'median', 'count'])` to compare multiple statistics
- Calculated ratios to show magnitude of differences
- Result: Family-friendly trails have **5.2x less elevation gain** (589 ft vs. 3,067 ft) and **3.2x less distance** (3.6 mi vs. 11.5 mi). The larger gap in elevation suggests steep climbs are the primary barrier to family accessibility—this insight would inform UX design for trail recommendation filters.

**Question 3: Do seasonal patterns relate to elevation?**
- Created a new categorical variable using `apply(categorize_season)` to simplify seasonal access into "Year-Round" vs. "Seasonal"
- Used `pd.crosstab(df['Difficulty_Clean'], df['Season_Category'])` to cross-tabulate difficulty and seasonality
- Used `groupby('Season_Category')` to compare elevation characteristics
- Result: Year-round trails average **943 feet** high point vs. **3,321 feet** for seasonal trails, revealing a clear elevation threshold around 2,000 feet for seasonal closures.

**Evidence in repository:**
- `mp1.ipynb` Section 3 showing all pandas operations with outputs
- Printed summary tables showing grouped statistics
- Written interpretations explaining what each result means practically

---

### C6 — Data Visualization

**Claim:**

I created three charts using Plotly, each with appropriate chart types, clear titles, labeled axes, and written interpretations:

**Chart 1: Box plot - Elevation Gain by Difficulty**
- **Why box plot:** Shows the full distribution (median, quartiles, outliers) rather than just averages, revealing that Difficult trails have consistently higher elevation with minimal overlap with Easy trails
- **Title states the finding:** "Elevation Gain Strongly Correlates with Trail Difficulty"
- **Labeled axes:** X-axis = "Trail Difficulty", Y-axis = "Elevation Gain (feet)"
- **Color coding:** Easy = green, Moderate = yellow, Difficult = red for intuitive understanding
- **Interpretation:** Explained that the clear separation between categories (Difficult median > Moderate 75th percentile) indicates elevation gain should be weighted heavily in recommendation algorithms

**Chart 2: Grouped bar chart - Family-Friendly Comparison**
- **Why grouped bar chart:** Compares two metrics (distance and elevation) across two categories, making relative differences immediately visible
- **Title states the finding:** "Family-Friendly Trails Are Significantly Shorter with Less Elevation Gain"
- **Labeled axes:** X-axis = "Family-Friendly Status", Y-axis = "Average Value"
- **Design decision:** Scaled elevation gain by 100 (showing "hundreds of feet") to make both metrics visually comparable
- **Interpretation:** Explained that the 5.2x elevation difference (vs. 3.2x distance) suggests elevation is the decisive factor, with implications for filter design in trail apps

**Chart 3: Scatter plot - Seasonal Access and Elevation**
- **Why scatter plot:** Shows relationship between two continuous variables (high point and elevation gain) while encoding two categorical variables (seasonal access and difficulty) through color and shape
- **Title states the finding:** "Seasonal Accessibility Clusters Around Elevation Thresholds"
- **Labeled axes:** X-axis = "High Point Elevation (feet)", Y-axis = "Elevation Gain (feet)"
- **Reference line:** Added dashed line at 2,000 feet to highlight the elevation threshold pattern
- **Interpretation:** Explained that the clear clustering indicates elevation drives seasonal closures, with practical implications for winter trail recommendations

**Evidence in repository:**
- `mp1.ipynb` published on GitHub at `/Users/manishvarrier/Documents/HCDE530/mp1/mp1.ipynb`
- Three chart images saved as PNG files: `chart1_elevation_by_difficulty.png`, `chart2_family_friendly_comparison.png`, `chart3_seasonal_elevation_patterns.png`
- Markdown cells after each chart explaining findings in plain language

All charts follow the four-rule guide from Week 6: (1) right chart type for the data structure, (2) clear title stating the insight, (3) labeled axes with units, (4) written interpretation of what it means.

---

## Optional Competency Claims

### C7 — Critical Evaluation and Professional Judgment

**Claim:**

I made several deliberate decisions to evaluate and improve upon initial approaches:

**1. Chart type selection based on data structure**

I initially considered using bar charts to show average elevation by difficulty. However, I chose **box plots** instead because they reveal the full distribution—showing median, quartiles, and outliers. This was the right choice because it revealed that:
- The median for Difficult trails (4,000 ft) is higher than even the 75th percentile for Moderate trails (~2,500 ft)
- There's minimal overlap in the interquartile ranges between categories
- A few Easy trails have unusually high elevation (outliers), which a bar chart would have hidden

If I had used bar charts showing only means, I would have missed this clear separation and the presence of outliers that might warrant data quality review.

**2. Scaling decision for visual comparison**

In Chart 2 (family-friendly comparison), I needed to compare distance (miles) and elevation (feet) on the same chart. The raw values were incomparable (3.6 miles vs. 589 feet). I made the decision to:
- Scale elevation by 100, showing "Elevation Gain (hundreds of feet)"
- This made both metrics visually comparable (3.6 vs. 5.9)
- I clearly labeled this transformation so readers understand what they're seeing

An alternative approach would have been dual y-axes, but that's often confusing and makes visual comparison harder. My choice prioritizes clarity over technical precision.

**3. Missing data handling strategy**

Rather than dropping all rows with any missing values (which would have reduced the dataset from 172 to ~150 trails), I used `dropna(subset=[...])` on a per-analysis basis:
- For elevation gain analysis: only required Elevation_Gain_Numeric and Difficulty_Clean (kept 171 trails)
- For high point analysis: required High_Point_Numeric (reduced to 151 trails)
- For family-friendly analysis: required different subsets

This preserved maximum data for each specific question. The tradeoff is slightly different sample sizes across analyses, but I documented this clearly in the notebook.

**4. Validation of unexpected findings**

When I found 17 family-friendly trails with >1,000 feet of elevation gain (seeming contradiction), I didn't just accept it. I:
- Examined the original Family Friendly values for these trails
- Found many were labeled "Yes, for older kids" or "Yes, for a shorter distance"
- Noted this as a data quality issue in my interpretation
- Suggested this as something to investigate further

This demonstrated critical thinking—questioning results that seem contradictory rather than accepting them at face value.

**5. Reference line justification**

In Chart 3, I added a reference line at 2,000 feet. This wasn't an arbitrary threshold—it emerged from:
- Observing the scatter plot clustering pattern
- Calculating that Year-Round trails average 943 ft high point vs. 3,321 ft for Seasonal
- Understanding that the Columbia Gorge gets significant snow above 2,000 feet (domain knowledge)

I could have omitted this line, but adding it helps readers see the pattern more clearly. I used a dashed line (not solid) to indicate it's an approximate threshold, not a precise boundary.

**Evidence in repository:**
- Chart 1 uses box plots instead of bar charts, with written justification
- Chart 2 shows scaled elevation with clear labeling of the transformation
- Data Profile section explains missing data handling approach
- Analysis section includes validation of unexpected findings (17 family-friendly trails with high elevation)
- Chart 3 includes reference line with annotation explaining the threshold

---

## Reflection on Process

### What Went Well

1. **Data cleaning paid off:** Investing ~2 hours upfront to write robust cleaning functions made all subsequent analysis straightforward and reliable.

2. **Iterative visualization:** I created multiple versions of each chart, refining titles, colors, and layouts based on what communicated the findings most clearly.

3. **Finding unexpected patterns:** The elevation threshold for seasonal access wasn't something I set out to find—it emerged from exploration, which made the analysis feel authentic.

### What I Would Do Differently

1. **Start with simpler questions:** My initial attempt to create a composite difficulty score was overly ambitious. Breaking it down into separate analyses (Question 1, 2, 3) was more effective.

2. **More domain research upfront:** Understanding Columbia Gorge geography and weather patterns earlier would have helped me anticipate the seasonal elevation threshold.

3. **Better documentation during cleaning:** I rewrote the cleaning functions several times but didn't document why certain approaches failed. Keeping a log would have been valuable.

### Key Learnings

- **Real-world data is always messy:** The text-based numeric fields, inconsistent difficulty labels, and missing values are typical—no dataset comes analysis-ready.
- **Visualization drives insight:** I didn't understand the seasonal elevation pattern until I created the scatter plot.
- **Interpretation matters more than code:** The charts are meaningless without clear written explanations of what they show and why it matters.
