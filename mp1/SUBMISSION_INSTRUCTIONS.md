# MP1 Submission Instructions

## Quick Checklist

✅ **mp1.ipynb** - Main analysis notebook (executed with all outputs)
✅ **mp1.md** - Competency claims document
✅ **HikingTrails_TheGorge.csv** - Source data file
✅ **README.md** - Documentation and instructions
✅ All required sections included in notebook

## What to Submit

**Submit the URL of your GitHub repository to Canvas.**

The notebook should be visible at:
```
https://github.com/[your-username]/hcde530/tree/main/mp1
```

GitHub renders `.ipynb` files natively, so instructors can read your analysis in a browser without running Python.

## Before Submitting - Final Checklist

### 1. Verify Notebook Structure

Open `mp1.ipynb` and confirm it has all four required sections:

- ✅ **Section 1 — Overview**
  - What is this dataset?
  - Where did it come from?
  - Three research questions
  - Why these questions matter for HCD

- ✅ **Section 2 — Data Profile**
  - `df.head()` with interpretation
  - `df.info()` with interpretation
  - `df.describe()` with interpretation
  - `df.isnull().sum()` with interpretation

- ✅ **Section 3 — Analysis**
  - Three charts (one per research question)
  - Each chart has:
    - Clear title stating the finding
    - Labeled axes with units
    - Appropriate chart type for the data
    - Markdown cell explaining what it shows

- ✅ **Section 4 — Conclusions**
  - Summary of findings (2-4 sentences per question)
  - What you would investigate further
  - What a practitioner would do with these findings

- ✅ **Section 5 — Process and Reflection** (BONUS)
  - Story of your process
  - Challenges encountered
  - What you learned

### 2. Verify Technical Requirements

- ✅ Notebook runs without errors from top to bottom
  - Test with: `Kernel → Restart & Run All` in Jupyter

- ✅ Setup cell at the top installs required packages
  ```python
  !pip install jupyter plotly kaleido pandas --quiet
  ```

- ✅ All data files are in the mp1 folder
  - `HikingTrails_TheGorge.csv` ✅

- ✅ Repository is set to Public (required for grading)

### 3. Verify Competency Claims

Open `mp1.md` and confirm you have:

- ✅ **C3 — Data Cleaning and File Handling** (Required)
  - Specific example of data cleaning
  - How you handled messy data
  - Evidence in the notebook

- ✅ **C5 — Data Analysis with Pandas** (Required)
  - Specific pandas operations used
  - What you discovered
  - Evidence in the notebook

- ✅ **C6 — Data Visualization** (Required)
  - Description of each chart
  - Why you chose that chart type
  - Evidence in the notebook

- ✅ **C7 — Critical Evaluation** (Optional but included)
  - Examples of judgment calls
  - What you validated or questioned
  - Evidence of critical thinking

## Chart Image Files

### Automatic Method (Preferred)

The notebook attempts to save charts automatically using kaleido. If this works, you'll see:
- `chart1_elevation_by_difficulty.png`
- `chart2_family_friendly_comparison.png`
- `chart3_seasonal_elevation_patterns.png`

### Manual Method (If kaleido fails)

If kaleido has browser issues (common on some systems):

1. Open `mp1.ipynb` in Jupyter
2. Run all cells
3. For each chart:
   - Hover over the chart
   - Click the camera icon (📷) in the top-right
   - Save with the correct filename

The filenames should be:
- Chart 1: `chart1_elevation_by_difficulty.png`
- Chart 2: `chart2_family_friendly_comparison.png`
- Chart 3: `chart3_seasonal_elevation_patterns.png`

### Alternative: Use the Python Script

```bash
cd /path/to/HCDE530/mp1
python3 save_charts.py
```

**Note:** Even if chart saving fails, the notebook is still complete. Instructors can see the interactive charts when viewing the notebook on GitHub.

## Committing to Git

### Step 1: Add all MP1 files

```bash
cd /Users/manishvarrier/Documents/HCDE530
git add mp1/
```

### Step 2: Commit with descriptive message

```bash
git commit -m "Complete MP1: Hiking trails analysis with three visualizations

- Analyzed 172 Columbia River Gorge hiking trails
- Created three visualizations answering research questions
- Added comprehensive data profile and cleaning
- Included process reflection and competency claims"
```

### Step 3: Push to GitHub

```bash
git push origin main
```

### Step 4: Verify on GitHub

1. Go to `https://github.com/[your-username]/hcde530`
2. Navigate to the `mp1/` folder
3. Click on `mp1.ipynb`
4. Verify that:
   - All cells show outputs
   - Charts are visible
   - Markdown renders correctly

## Submitting to Canvas

1. Copy your repository URL:
   ```
   https://github.com/[your-username]/hcde530
   ```

2. Submit to the MP1 assignment on Canvas

3. Add a comment (optional):
   ```
   MP1 is in the /mp1 folder. Notebook URL:
   https://github.com/[your-username]/hcde530/blob/main/mp1/mp1.ipynb

   Competency claims: mp1/mp1.md
   ```

## Troubleshooting

### "Notebook won't run from top to bottom"

1. Check for hardcoded file paths - all paths should be relative
2. Make sure `HikingTrails_TheGorge.csv` is in the same folder as the notebook
3. Try: `Kernel → Restart & Clear All Outputs → Run All`

### "Charts won't save as PNG"

This is a known issue with kaleido on some systems. Solutions:

1. **Use manual save:** Hover over chart → Click camera icon
2. **Skip PNG saving:** The notebook is still complete without PNG files
3. **Use HTML export:** Charts can be saved as `.html` files instead

### "Repository shows as Private"

1. Go to repository Settings on GitHub
2. Scroll to "Danger Zone"
3. Click "Change visibility"
4. Select "Public"

### "Can't see my notebook on GitHub"

- GitHub may take a few minutes to render large notebooks
- Try refreshing the page
- Check that you pushed to the correct branch (should be `main`)

## Getting Help

If you encounter issues:

1. Check the README.md in this folder
2. Review the technical requirements in the assignment
3. Post in the class discussion forum
4. Attend office hours

## Final Notes

- **Don't delete the setup cell** - Instructors need it to install packages
- **Commit message matters** - Use descriptive messages that explain what you did
- **Test your submission** - View your notebook on GitHub as if you're the grader
- **Charts saved as separate images are helpful but not strictly required** - The interactive charts in the notebook are sufficient

---

**You're ready to submit when:**
1. ✅ Notebook runs top to bottom without errors
2. ✅ All four sections are complete with content
3. ✅ Three charts answer three research questions
4. ✅ Competency claims document exists (mp1.md)
5. ✅ Repository is Public
6. ✅ Everything is committed and pushed to GitHub

Good luck! 🎉
