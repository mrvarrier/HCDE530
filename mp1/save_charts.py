#!/usr/bin/env python3
"""
Script to generate and save static chart images for MP1
"""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np

# Load and clean data
df = pd.read_csv('HikingTrails_TheGorge.csv')

# Helper function to extract numeric values
def extract_number(value):
    if pd.isna(value):
        return np.nan
    value_str = str(value).replace(',', '')
    try:
        return float(value_str.split()[0])
    except:
        return np.nan

# Clean data
df['Distance_Numeric'] = df['Distance'].apply(extract_number)
df['High_Point_Numeric'] = df['High Point'].apply(extract_number)
df['Elevation_Gain_Numeric'] = df['Elevation Gain'].apply(extract_number)

def clean_difficulty(value):
    if pd.isna(value):
        return np.nan
    value_lower = str(value).lower()
    if 'difficult' in value_lower:
        return 'Difficult'
    elif 'moderate' in value_lower:
        return 'Moderate'
    elif 'easy' in value_lower:
        return 'Easy'
    return np.nan

df['Difficulty_Clean'] = df['Difficulty'].apply(clean_difficulty)

def clean_family_friendly(value):
    if pd.isna(value):
        return np.nan
    value_str = str(value).strip()
    if value_str == 'Yes':
        return 'Yes'
    else:
        return 'No'

df['Family_Friendly_Clean'] = df['Family Friendly'].apply(clean_family_friendly)

def categorize_season(season_text):
    if pd.isna(season_text):
        return 'Unknown'
    season_lower = str(season_text).lower()
    if 'all year' in season_lower or 'year round' in season_lower or 'year-round' in season_lower:
        return 'Year-Round'
    else:
        return 'Seasonal'

df['Season_Category'] = df['Seasons'].apply(categorize_season)

print("Data loaded and cleaned successfully.")

# Chart 1: Box plot - Elevation by Difficulty
print("\nGenerating Chart 1: Elevation by Difficulty...")
df_clean = df.dropna(subset=['Elevation_Gain_Numeric', 'Difficulty_Clean'])

fig1 = px.box(
    df_clean,
    x='Difficulty_Clean',
    y='Elevation_Gain_Numeric',
    category_orders={'Difficulty_Clean': ['Easy', 'Moderate', 'Difficult']},
    title='Elevation Gain Strongly Correlates with Trail Difficulty',
    labels={
        'Elevation_Gain_Numeric': 'Elevation Gain (feet)',
        'Difficulty_Clean': 'Trail Difficulty'
    },
    color='Difficulty_Clean',
    color_discrete_map={'Easy': '#90EE90', 'Moderate': '#FFD700', 'Difficult': '#FF6B6B'}
)

fig1.update_layout(
    showlegend=False,
    xaxis_title='Trail Difficulty',
    yaxis_title='Elevation Gain (feet)',
    font=dict(size=12)
)

try:
    fig1.write_image('chart1_elevation_by_difficulty.png', width=800, height=600)
    print("✓ Chart 1 saved successfully")
except Exception as e:
    print(f"⚠️  Could not save Chart 1: {e}")

# Chart 2: Grouped bar chart - Family-Friendly Comparison
print("\nGenerating Chart 2: Family-Friendly Comparison...")
df_family = df.dropna(subset=['Family_Friendly_Clean', 'Distance_Numeric', 'Elevation_Gain_Numeric'])

family_avg = df_family.groupby('Family_Friendly_Clean')[['Distance_Numeric', 'Elevation_Gain_Numeric']].mean().reset_index()

family_melted = family_avg.melt(
    id_vars='Family_Friendly_Clean',
    value_vars=['Distance_Numeric', 'Elevation_Gain_Numeric'],
    var_name='Characteristic',
    value_name='Value'
)

family_melted['Characteristic'] = family_melted['Characteristic'].map({
    'Distance_Numeric': 'Distance (miles)',
    'Elevation_Gain_Numeric': 'Elevation Gain (hundreds of feet)'
})

family_melted.loc[family_melted['Characteristic'] == 'Elevation Gain (hundreds of feet)', 'Value'] /= 100

fig2 = px.bar(
    family_melted,
    x='Family_Friendly_Clean',
    y='Value',
    color='Characteristic',
    barmode='group',
    title='Family-Friendly Trails Are Significantly Shorter with Less Elevation Gain',
    labels={
        'Value': 'Average Value',
        'Family_Friendly_Clean': 'Trail Type'
    },
    color_discrete_map={
        'Distance (miles)': '#4169E1',
        'Elevation Gain (hundreds of feet)': '#FF8C00'
    },
    category_orders={'Family_Friendly_Clean': ['Yes', 'No']}
)

fig2.update_layout(
    xaxis_title='Family-Friendly Status',
    yaxis_title='Average Value',
    font=dict(size=12),
    legend_title='Characteristic'
)

try:
    fig2.write_image('chart2_family_friendly_comparison.png', width=800, height=600)
    print("✓ Chart 2 saved successfully")
except Exception as e:
    print(f"⚠️  Could not save Chart 2: {e}")

# Chart 3: Scatter plot - Seasonal Access
print("\nGenerating Chart 3: Seasonal Access and Elevation...")
df_seasonal = df.dropna(subset=['High_Point_Numeric', 'Season_Category', 'Difficulty_Clean'])

fig3 = px.scatter(
    df_seasonal,
    x='High_Point_Numeric',
    y='Elevation_Gain_Numeric',
    color='Season_Category',
    symbol='Difficulty_Clean',
    title='Seasonal Accessibility Clusters Around Elevation Thresholds',
    labels={
        'High_Point_Numeric': 'High Point Elevation (feet)',
        'Elevation_Gain_Numeric': 'Elevation Gain (feet)',
        'Season_Category': 'Access',
        'Difficulty_Clean': 'Difficulty'
    },
    color_discrete_map={
        'Year-Round': '#4169E1',
        'Seasonal': '#FF6B35'
    },
    hover_data=['Trail Name', 'Difficulty_Clean']
)

fig3.add_hline(
    y=2000,
    line_dash='dash',
    line_color='gray',
    annotation_text='~2000 ft threshold for seasonal closures',
    annotation_position='top right'
)

fig3.update_layout(
    font=dict(size=12),
    legend=dict(orientation='v', yanchor='top', y=1, xanchor='left', x=1.02)
)

try:
    fig3.write_image('chart3_seasonal_elevation_patterns.png', width=900, height=600)
    print("✓ Chart 3 saved successfully")
except Exception as e:
    print(f"⚠️  Could not save Chart 3: {e}")

print("\n" + "="*80)
print("Chart generation complete!")
print("="*80)
