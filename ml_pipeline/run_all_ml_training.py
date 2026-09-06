"""
===================================================================
शिल्प बाज़ार (ShilpBazzar) - SIH26090
Master Pipeline: Train & Benchmark All 3 ML Models
===================================================================
Executes training for:
1. Model 1: Fair Pricing & Wage Protection Regressor (Gradient Boosting)
2. Model 2: Computer Vision Craft Authenticity Classifier (Random Forest)
3. Model 3: Indic Dialect NLP & ONDC Taxonomy Normalizer (TF-IDF + LogReg)
"""

import os
import sys
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_master_training():
    print("\n" + "="*70)
    print("🚀 STARTING SHILP SATHI (शिल्प बाज़ार) END-TO-END ML TRAINING PIPELINE")
    print("   Smart India Hackathon (SIH26090) - Virtual Business Manager")
    print("="*70)

    start_time = time.time()
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Step 0: Generate Dataset
    print("\n[STEP 1/4] Generating 1,200+ Indian Craft Synthetic-Empirical Dataset...")
    from generate_artisan_dataset import generate_dataset
    dataset_path = os.path.join(current_dir, "indian_craft_dataset.csv")
    generate_dataset(dataset_path, 1200)

    # Step 1: Train Pricing Regressor
    print("\n[STEP 2/4] Training Model 1: Fair Pricing & Wage Regressor...")
    from train_pricing_engine import train_pricing_models
    pricing_results = train_pricing_models()

    # Step 2: Train Authenticity Classifier
    print("\n[STEP 3/4] Training Model 2: Computer Vision Authenticity Classifier...")
    from train_authenticity_classifier import train_authenticity_model
    authenticity_results = train_authenticity_model()

    # Step 3: Train Dialect NLP Model
    print("\n[STEP 4/4] Training Model 3: Indic Dialect NLP & Taxonomy Classifier...")
    from train_dialect_nlp_model import train_dialect_nlp_model
    dialect_results = train_dialect_nlp_model()

    elapsed = round(time.time() - start_time, 2)

    # Master Benchmark Summary
    summary = {
        "status": "SUCCESS",
        "training_timestamp": time.strftime("%Y-%m-%d %H:%M:%SZ", time.gmtime()),
        "total_training_time_seconds": elapsed,
        "dataset": {
            "records_count": 1200,
            "craft_categories": len(pricing_results["categories"]),
            "file": "indian_craft_dataset.csv"
        },
        "model_1_pricing_engine": {
            "name": pricing_results["model_name"],
            "algorithm": pricing_results["algorithm"],
            "r2_accuracy_score": f"{pricing_results['metrics']['r2_score'] * 100:.2f}%",
            "mean_absolute_error_inr": f"₹{pricing_results['metrics']['mae_inr']:.2f}",
            "wage_protection_r2": f"{pricing_results['metrics']['wage_r2_score'] * 100:.2f}%",
            "mosje_statutory_wage": "₹150.00 / hour guaranteed base"
        },
        "model_2_authenticity_vision": {
            "name": authenticity_results["model_name"],
            "algorithm": authenticity_results["algorithm"],
            "classification_accuracy": f"{authenticity_results['metrics']['accuracy_pct']:.2f}%",
            "precision": f"{authenticity_results['metrics']['precision_pct']:.2f}%",
            "recall": f"{authenticity_results['metrics']['recall_pct']:.2f}%",
            "roc_auc": f"{authenticity_results['metrics']['roc_auc_pct']:.2f}%"
        },
        "model_3_dialect_nlp": {
            "name": dialect_results["model_name"],
            "algorithm": dialect_results["algorithm"],
            "accuracy": f"{dialect_results['metrics']['classification_accuracy_pct']:.2f}%",
            "supported_taxonomies": dialect_results["metrics"]["supported_categories_count"]
        }
    }

    summary_path = os.path.join(current_dir, "summary_benchmark.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print("\n" + "="*70)
    print("🏆 MASTER TRAINING & BENCHMARKING COMPLETE (ALL 3 MODELS READY!)")
    print(f"⏱️ Total Execution Time: {elapsed} seconds")
    print("="*70)
    print(json.dumps(summary, indent=2))
    print("="*70 + "\n")

    return summary

if __name__ == "__main__":
    run_master_training()
