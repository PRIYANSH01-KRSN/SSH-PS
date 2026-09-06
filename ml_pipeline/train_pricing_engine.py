"""
===================================================================
कारीगर सारथी (Shilp Sathi) - SIH26090
Model 1: Artisan Fair Pricing & Wage Protection ML Engine
===================================================================
Trains Gradient Boosting and Random Forest Regressors to predict
fair market selling prices and guarantee living wage payouts.
"""

import os
import sys
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def train_pricing_models():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "indian_craft_dataset.csv")

    if not os.path.exists(dataset_path):
        print("[!] Dataset not found, generating now...")
        from generate_artisan_dataset import generate_dataset
        generate_dataset(dataset_path, 1200)

    print(f"\n=======================================================")
    print(f"📊 Training ML Model 1: Fair Pricing & Wage Protection Engine")
    print(f"=======================================================")
    
    df = pd.read_csv(dataset_path)
    print(f"[*] Loaded dataset with {len(df)} artisan craft records.")

    # Filter to genuine crafts for pricing model
    genuine_df = df[df["is_genuine_handmade"] == 1].copy()

    # Category One-Hot / Encoding
    categories = sorted(genuine_df["category"].unique().tolist())
    cat_to_idx = {cat: i for i, cat in enumerate(categories)}
    genuine_df["category_idx"] = genuine_df["category"].map(cat_to_idx)

    feature_cols = [
        "category_idx",
        "material_cost",
        "labor_hours",
        "weight_kg",
        "is_gi_tagged",
        "complexity_score",
        "artisan_experience_years"
    ]

    X = genuine_df[feature_cols]
    y_price = genuine_df["fair_market_price"]
    y_wage = genuine_df["protected_artisan_wage"]

    # Split dataset
    X_train, X_test, y_price_train, y_price_test, y_wage_train, y_wage_test = train_test_split(
        X, y_price, y_wage, test_size=0.2, random_state=42
    )

    # 1. Train Gradient Boosting Regressor for Fair Market Price
    print("[*] Training Gradient Boosting Regressor (Pricing)...")
    gbr_price = GradientBoostingRegressor(
        n_estimators=180,
        learning_rate=0.08,
        max_depth=4,
        random_state=42
    )
    gbr_price.fit(X_train, y_price_train)

    # 2. Train Random Forest Regressor for Artisan Wage
    print("[*] Training Random Forest Regressor (Wage Protection)...")
    rf_wage = RandomForestRegressor(
        n_estimators=150,
        max_depth=6,
        random_state=42
    )
    rf_wage.fit(X_train, y_wage_train)

    # Model Evaluation
    price_preds = gbr_price.predict(X_test)
    wage_preds = rf_wage.predict(X_test)

    price_mae = mean_absolute_error(y_price_test, price_preds)
    price_rmse = np.sqrt(mean_squared_error(y_price_test, price_preds))
    price_r2 = r2_score(y_price_test, price_preds)

    wage_mae = mean_absolute_error(y_wage_test, wage_preds)
    wage_r2 = r2_score(y_wage_test, wage_preds)

    cv_scores = cross_val_score(gbr_price, X, y_price, cv=5, scoring='r2')

    print("\n📈 EVALUATION METRICS (Test Set):")
    print(f"  • Fair Price R² Accuracy Score : {price_r2 * 100:.2f}%")
    print(f"  • Fair Price Mean Absolute Error: ₹{price_mae:.2f}")
    print(f"  • Fair Price RMSE              : ₹{price_rmse:.2f}")
    print(f"  • 5-Fold Cross Validation R²    : {np.mean(cv_scores) * 100:.2f}% (±{np.std(cv_scores)*100:.2f}%)")
    print(f"  • Artisan Wage R² Score        : {wage_r2 * 100:.2f}% (MAE: ₹{wage_mae:.2f})")

    # Feature Importance
    importances = dict(zip(feature_cols, [round(float(v), 4) for v in gbr_price.feature_importances_]))
    print("\n🔍 FEATURE IMPORTANCES:")
    for feat, imp in sorted(importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {feat.replace('_', ' ').title()}: {imp * 100:.1f}%")

    # Save Joblib Models
    joblib.dump(gbr_price, os.path.join(current_dir, "pricing_model.joblib"))
    joblib.dump(rf_wage, os.path.join(current_dir, "wage_model.joblib"))
    print(f"[+] Saved Python joblib artifacts in {current_dir}")

    # Export Portable JSON Weights for Next.js Fast Inference
    category_baselines = {}
    for cat in categories:
        sub = genuine_df[genuine_df["category"] == cat]
        category_baselines[cat] = {
            "avg_material_cost": round(float(sub["material_cost"].mean()), 2),
            "avg_labor_hours": round(float(sub["labor_hours"].mean()), 2),
            "avg_fair_price": round(float(sub["fair_market_price"].mean()), 2),
            "avg_artisan_wage": round(float(sub["protected_artisan_wage"].mean()), 2),
            "hourly_rate": 160 if cat == "Terracotta" else (200 if "Silk" in cat else 175)
        }

    weights_payload = {
        "model_name": "Shilp-Sathi-Pricing-GBR-v1.0",
        "algorithm": "Gradient Boosting Regressor (180 trees, depth 4)",
        "metrics": {
            "r2_score": round(float(price_r2), 4),
            "mae_inr": round(float(price_mae), 2),
            "rmse_inr": round(float(price_rmse), 2),
            "cv_accuracy_pct": round(float(np.mean(cv_scores) * 100), 2),
            "wage_r2_score": round(float(wage_r2), 4),
            "wage_mae_inr": round(float(wage_mae), 2)
        },
        "feature_importances": importances,
        "categories": categories,
        "category_baselines": category_baselines,
        "mosje_policy_constants": {
            "statutory_minimum_hourly_wage": 150.0,
            "protected_livelihood_margin_pct": 35.0,
            "gi_tag_heritage_premium_inr": 350.0
        }
    }

    weights_json_path = os.path.join(current_dir, "pricing_model_weights.json")
    with open(weights_json_path, "w", encoding="utf-8") as f:
        json.dump(weights_payload, f, indent=2, ensure_ascii=False)

    print(f"[+] Exported portable JSON model weights to: {weights_json_path}")
    return weights_payload

if __name__ == "__main__":
    train_pricing_models()
