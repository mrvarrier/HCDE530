# Week 5 - Pandas Data Analysis

## Assignment Overview
For this assignment, I analyzed my Mini Project 1 dataset (Columbia River Gorge hiking trails) using pandas to answer three analytical questions about trail characteristics, family-friendliness, and seasonal accessibility patterns.

**Repository**: [Your GitHub URL here]
**Files**:
- `pandaanalysis.ipynb` - Jupyter notebook with pandas analysis
- `HikingTrails_TheGorge.csv` - Dataset (173 trails)
- `week5.md` - This competency claim

---

## Primary Competency Claim

### C5  Data Analysis with Pandas

**What I did**: I used pandas in `pandaanalysis.ipynb` to answer three specific analytical questions about hiking trail characteristics. I used **8 distinct pandas operations** (exceeding the required 3):

1. **`df.head()` and `df.info()`** - Discovered that distance and elevation columns contain text ("feet", "miles", commas) rather than pure numbers, requiring data cleaning
2. **`df.isnull().sum()`** - Found 21 missing values in High Point and 1 in Elevation Gain, which informed my decision to use `.dropna()` for complete-data analysis (reduced dataset from 172 to 149 complete records)
3. **`df['Difficulty'].value_counts()`** - Revealed the dataset has 62 Easy, 65 Moderate, and 36 Difficult trails (plus 7 variants with detailed descriptions) - a balanced distribution that makes comparisons meaningful
4. **`df.groupby('Difficulty')[columns].mean()`** - Compared average distance, elevation gain, and high point across difficulty levels - revealed elevation gain increases 11.7x from Easy to Difficult while distance only increases 5.6x
5. **`df.groupby('Family Friendly')[columns].agg(['mean', 'median', 'count'])`** - Used multiple aggregations to compare family vs non-family trails while detecting outliers (mean vs median showed 81 "Yes" family trails averaging 3.62 miles and 589 ft gain)
6. **`df[(condition1) & (condition2)]`** - Filtered to find **17 family-friendly trails with >1000ft elevation gain**, identifying serious data quality issues (including Ruckel Ridge at 3,700 ft marked family-friendly!)
7. **`pd.crosstab()`** - Cross-tabulated difficulty and seasonal access to reveal 89% of Difficult trails (32/36) are seasonal vs only 17% of Easy trails (9/53)
8. **`df[(df['Season_Category'] == 'Year-Round') & (df['High_Point_Numeric'] > 2000)]`** - Identified **9 high-elevation year-round trails** above 2,000 ft (exceptions to the seasonal pattern - valuable winter hiking opportunities)

**What I found**: The analysis revealed that **elevation gain is the strongest predictor of difficulty** - not distance. Difficult trails averaged **4,041 feet** of elevation gain compared to **345 feet** for Easy trails (an **11.7x increase**), while distance only increased from 2.74 miles to 15.46 miles (a 5.6x increase). This was unexpected and tells hikers that vertical gain matters **twice as much** as horizontal distance when assessing difficulty.

For family-friendly trails, I discovered that "Yes" family trails average 3.62 miles and 589 feet of elevation gain, while "No" non-family trails average 11.51 miles and 3,067 feet gain. But the filtering analysis identified **17 family-friendly trails with >1000 ft elevation gain** - serious outliers. The most extreme is **Ruckel Ridge Loop** (9 miles, 3,700 ft gain) marked "Yes" for families, which is clearly a data quality issue. Other outliers like "Angels Rest-Devils Rest Loop" (10.8 miles, 3,040 ft gain) are marked for "older kids" in the raw data, showing inconsistency in how "family-friendly" is categorized.

The seasonal analysis showed that **89% of Difficult trails are seasonal** (32 out of 36 closed in winter) compared to only **17% of Easy trails** (9 out of 53). When I grouped by season category and averaged elevations, seasonal trails had high points averaging **3,321 feet** while year-round trails averaged **943 feet**. This confirms that elevation drives seasonal closures due to snow - likely around the 2,500-3,000 foot threshold.

**Why this matters**: This analysis could directly inform a hiking recommendation system:
- **Use elevation gain as the primary difficulty metric** - it's 2x more predictive than distance (11.7x increase vs 5.6x)
- **Flag the 17 family trails with >1000ft gain** for data review - especially Ruckel Ridge (3,700 ft) which is miscategorized
- **Predict seasonal closures at ~2,500-3,000 ft elevation** - 89% of difficult trails close in winter vs 17% of easy trails
- **Highlight the 9 year-round high-elevation trails** (above 2,000ft like Dog Mountain at 2,948ft) as special winter hiking gems

This demonstrates I can **choose appropriate pandas operations for specific questions**, **interpret results in context**, and **identify data quality issues** - not just run code.

---

## Supporting Competency Claims

### C3  Data Cleaning and File Handling

**What I did**: The raw CSV data had numeric values stored as text with units and formatting (e.g., "1,234 feet", "5.6 miles round trip"). I wrote an `extract_number()` function that:
- Handles missing values (`pd.isna()` check)
- Removes commas from numbers
- Extracts the numeric portion before the unit text
- Returns `np.nan` for unparseable values (preserving data integrity)

I then applied this function to create three cleaned columns: `Distance_Numeric`, `High_Point_Numeric`, and `Elevation_Gain_Numeric`.

**Why this matters**: Real-world data is messy. The original data came from a website where measurements include units and descriptions ("4.8 miles round trip"). Rather than manually editing 173 rows in Excel, I built a reusable cleaning function that handles edge cases (missing data, parsing errors) and preserves the original data. This approach is reproducible and auditable - anyone can see exactly how the data was transformed.

**Evidence**: The function is documented with a docstring explaining inputs/outputs and example transformations. The notebook shows before/after comparisons so someone reading it can verify the cleaning worked correctly.

### C2  Code Literacy and Documentation

**What I did**: Every pandas operation in the notebook has three-part documentation:
1. **Question** - What I'm asking the data (e.g., "What are the most common difficulty levels?")
2. **Why it matters** - The real-world significance (e.g., "If 90% are Easy, patterns for Difficult might be based on few examples")
3. **Interpretation** - What the result tells me (e.g., "The balanced distribution means comparisons are meaningful")

For example, the `df.isnull().sum()` operation isn't just commented as "find missing data" - I explain that missing elevation data could skew difficulty analysis, so I need to decide whether to exclude incomplete records or investigate if there's a pattern (are Easy trails less likely to report elevation?).

**Why this matters**: These aren't just code comments - they're **analytical reasoning documentation**. Someone reading this notebook (or me in 6 months) can understand not just what the code does, but **why I chose each operation and what conclusions I drew**. This is how data analysts communicate their thinking.

The docstring on `extract_number()` follows professional standards: it explains what the function takes (a value that might be a string with units), what it returns (float or NaN), and provides concrete examples of transformations.

---

## Reflection: What I Learned

### Technical Skills
- **Pandas operations selection**: I learned that choosing the right operation matters. Using `.agg(['mean', 'median'])` instead of just `.mean()` helped me spot outliers in the family-friendly data.
- **Filtering for insights**: The double-condition filters (`df[(condition1) & (condition2)]`) were powerful for finding exceptions - like family trails with high elevation gain - that deserve investigation.
- **Data cleaning patterns**: Writing the `extract_number()` function taught me that real-world data cleaning often requires custom functions, not just built-in pandas methods.

### Analytical Thinking
- **Question formulation matters**: My original questions were broad ("what makes trails difficult?"). Breaking them into specific pandas operations (groupby for averages, filtering for outliers, crosstab for patterns) forced me to think more precisely.
- **Interpretation vs description**: Early in the analysis, I was just describing what the code did. The assignment requirement to explain "what the answer means" pushed me to think about implications - like calculating that elevation gain increases 11.7x from Easy to Difficult while distance only increases 5.6x. That **2x ratio** is the key insight - not just "elevation matters more."
- **Data quality awareness**: Finding the 17 family-friendly outliers (including Ruckel Ridge with 3,700 ft gain!) made me realize that data isn't always consistent. Some trails are marked for "older kids" in raw data but simplified to "Yes" in the binary column - a nuance that a simple Yes/No filter misses. This is the kind of quality issue that would confuse users in a real app.

### Real-World Application
This analysis gave me a foundation for MP1. The patterns I found will directly inform the tool design:
- **Difficulty calculator**: Weight elevation gain 2x more heavily than distance in algorithms
- **Data quality flags**: Alert on 17 miscategorized family trails (Ruckel Ridge with 3,700 ft gain!)
- **Seasonal predictions**: Warn users that trails above ~2,500-3,000 ft likely close Nov-Apr
- **Winter recommendations**: Feature the 9 year-round high-elevation trails (Dog Mountain, Herman Creek) as special winter options
- **Family trail thresholds**: Use 589 ft avg gain as the family-friendly benchmark; flag anything >1,000 ft

---

## Evidence Summary

| Competency | Evidence Location | Specifics |
|------------|------------------|-----------|
| **C5 - Pandas Analysis** | `pandaanalysis.ipynb` cells 3-14 | 8 pandas operations, 3 analytical questions answered with interpretation |
| **C3 - Data Cleaning** | `pandaanalysis.ipynb` cell 5 | `extract_number()` function handles text-to-numeric conversion |
| **C2 - Documentation** | Throughout notebook | Every operation has Question/Why/Interpretation structure |

**GitHub Repository**: [Add your repo URL here]
