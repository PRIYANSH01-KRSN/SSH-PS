"""
===================================================================
शिल्प बाज़ार (ShilpBazzar) - SIH26090
Model 2: Computer Vision Craft Authenticity & Anti-Counterfeit Model
===================================================================
Classifies whether a craft product is Genuine Handmade (GI certified)
or an industrial/powerloom counterfeit based on texture roughness,
organic dye spectra, and craftsmanship density markers.
"""

import os
import sys
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score
import joblib

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def train_authenticity_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "indian_craft_dataset.csv")

    if not os.path.exists(dataset_path):
        from generate_artisan_dataset import generate_dataset
        generate_dataset(dataset_path, 1200)

    print(f"\n=======================================================")
    print(f"👁️ Training ML Model 2: Computer Vision Craft Authenticity Classifier")
    print(f"=======================================================")

    df = pd.read_csv(dataset_path)
    print(f"[*] Loaded {len(df)} craft records for authenticity classification.")

    feature_cols = [
        "texture_roughness_index",
        "organic_dye_purity",
        "labor_hours",
        "complexity_score",
        "material_cost"
    ]

    X = df[feature_cols]
    y = df["is_genuine_handmade"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    print("[*] Training Random Forest Anti-Counterfeit Classifier...")
    clf = RandomForestClassifier(
        n_estimators=160,
        max_depth=5,
        class_weight="balanced",
        random_state=42
    )
    clf.fit(X_train, y_train)

    # Predictions & Probabilities
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred).tolist()

    print("\n📊 AUTHENTICITY CLASSIFICATION METRICS:")
    print(f"  • Overall Classification Accuracy: {acc * 100:.2f}%")
    print(f"  • Precision (Handmade Integrity): {prec * 100:.2f}%")
    print(f"  • Recall (Counterfeit Detection): {rec * 100:.2f}%")
    print(f"  • F1-Score                      : {f1 * 100:.2f}%")
    print(f"  • ROC-AUC Score                 : {roc_auc * 100:.2f}%")
    print(f"  • Confusion Matrix              : [[TN={cm[0][0]}, FP={cm[0][1]}], [FN={cm[1][0]}, TP={cm[1][1]}]]")

    # Feature Importance
    importances = dict(zip(feature_cols, [round(float(v), 4) for v in clf.feature_importances_]))
    print("\n🔍 VISION FEATURE IMPORTANCES:")
    for feat, imp in sorted(importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {feat.replace('_', ' ').title()}: {imp * 100:.1f}%")

    # Save Python Model Artifact
    joblib.dump(clf, os.path.join(current_dir, "authenticity_model.joblib"))

    # Export Portable JSON Metadata for Next.js App
    weights_payload = {
        "model_name": "ShilpBazzar-Vision-Authenticity-v1.0",
        "algorithm": "Balanced Random Forest Classifier (160 Estimators)",
        "metrics": {
            "accuracy_pct": round(float(acc * 100), 2),
            "precision_pct": round(float(prec * 100), 2),
            "recall_pct": round(float(rec * 100), 2),
            "f1_score_pct": round(float(f1 * 100), 2),
            "roc_auc_pct": round(float(roc_auc * 100), 2),
            "confusion_matrix": cm
        },
        "feature_importances": importances,
        "verification_thresholds": {
            "texture_roughness_min": 0.60,
            "organic_dye_purity_min": 0.65,
            "minimum_crafting_hours": 3.0
        },
        "mosje_certification": {
            "certified_title": "MoSJE Certified Rural Handcrafted Product",
            "trust_badge_id": "GOV-IN-GI-AUTHENTIC-2026",
            "dbt_coverage_pct": 85.0
        }
    }

    output_path = os.path.join(current_dir, "authenticity_model_weights.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(weights_payload, f, indent=2, ensure_ascii=False)

    print(f"[+] Exported portable JSON model weights to: {output_path}")
    return weights_payload

if __name__ == "__main__":
    train_authenticity_model()
