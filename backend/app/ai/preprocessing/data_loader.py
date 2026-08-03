"""
data_loader.py

Loads the synthetic incident dataset.
"""

import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_PATH = BASE_DIR / "data" / "synthetic_incidents.csv"


class DataLoader:

    def __init__(self):
        self.df = pd.read_csv(DATA_PATH)

    def get_dataframe(self):
        return self.df

    def get_all_incidents(self):
        return self.df.to_dict("records")

    def get_services(self):
        return sorted(self.df["service"].unique().tolist())

    def get_categories(self):
        return sorted(self.df["category"].unique().tolist())

    def get_severities(self):
        return sorted(self.df["severity"].unique().tolist())


data_loader = DataLoader()