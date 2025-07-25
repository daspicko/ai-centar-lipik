import pandas as pd
import numpy as np

def clean_categorical_title(df, column_name):
    """
    Primjenjuje .str.title() na specificiranu kolonu u DataFrameu.
    """
    if column_name not in df.columns:
        print(f"Upozorenje: Kolona '{column_name}' ne postoji u DataFrameu.")
        return df
    df[column_name] = df[column_name].str.title()
    return df


def update_missing_textual_values(df):
    if df == None:
        return
    for column in df.columns:
        if isinstance(df[column][0], str):
            mode = df[column].mode()[0]
            print('Najčešće korištena vrijednost u', column, 'je', mode)
            df[column] = df[column].fillna(value = mode)
