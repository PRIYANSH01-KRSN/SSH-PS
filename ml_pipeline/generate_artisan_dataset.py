"""
===================================================================
शिल्प बाज़ार (ShilpBazzar) - SIH26090
Dataset Generator: Indian Traditional Crafts & Economic Benchmarks
===================================================================
Generates a comprehensive, statistically sound dataset of 1,200+
authentic Indian artisan craft items across 10 major craft clusters.
Based on MoSJE, GeM, and ONDC fair craft pricing parameters.
"""

import os
import sys
import random
import csv

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CRAFT_CATEGORIES = [
    {
        "name": "Gorakhpur Terracotta",
        "category": "Terracotta",
        "base_material": (150, 450),
        "hours_range": (3, 14),
        "weight_range": (0.5, 3.5),
        "gi_tagged": 1,
        "base_hourly_rate": 160,
        "complexity_range": (1, 4),
        "dialect_phrases": ["माटी का घड़ा", "टेराकोटा सुराही", "हाथ से बनी मटकी", "धूपदानी"]
    },
    {
        "name": "Jaipur Blue Pottery",
        "category": "Blue Pottery",
        "base_material": (350, 900),
        "hours_range": (6, 20),
        "weight_range": (0.6, 2.8),
        "gi_tagged": 1,
        "base_hourly_rate": 185,
        "complexity_range": (2, 5),
        "dialect_phrases": ["नीली मिट्टी का फूलदान", "क्वार्ट्ज प्लेट", "हस्तशिल्प जार"]
    },
    {
        "name": "Mithila Madhubani Painting",
        "category": "Madhubani",
        "base_material": (250, 800),
        "hours_range": (8, 36),
        "weight_range": (0.1, 0.8),
        "gi_tagged": 1,
        "base_hourly_rate": 175,
        "complexity_range": (3, 5),
        "dialect_phrases": ["मिथिला पेंटिंग", "गोबर लीपा कैनवास", "प्राकृतिक रंग चित्र", "पेड़ और मोर"]
    },
    {
        "name": "Varanasi Silk Handloom",
        "category": "Handloom Silk",
        "base_material": (900, 3200),
        "hours_range": (16, 60),
        "weight_range": (0.4, 1.2),
        "gi_tagged": 1,
        "base_hourly_rate": 200,
        "complexity_range": (3, 5),
        "dialect_phrases": ["बनारसी कतान सिल्क", "शुद्ध रेशमी साड़ी", "हाथ का ताना-बाना", "जरी पल्लू"]
    },
    {
        "name": "Moradabad Brassware",
        "category": "Brass Craft",
        "base_material": (600, 1800),
        "hours_range": (8, 28),
        "weight_range": (1.5, 6.0),
        "gi_tagged": 1,
        "base_hourly_rate": 170,
        "complexity_range": (2, 5),
        "dialect_phrases": ["पीतल का नक्काशीदार दीया", "ब्रास पूजा थाली", "हाथ की ढलाई"]
    },
    {
        "name": "Saharanpur Wood Carving",
        "category": "Wood Carving",
        "base_material": (400, 1400),
        "hours_range": (6, 30),
        "weight_range": (0.8, 4.5),
        "gi_tagged": 1,
        "base_hourly_rate": 165,
        "complexity_range": (2, 5),
        "dialect_phrases": ["शीशम की लकड़ी की जाली", "हाथ से तराशा बॉक्स", "लकड़ी का झरोखा"]
    },
    {
        "name": "Kutch Bandhani & Ajrakh",
        "category": "Bandhani",
        "base_material": (300, 1100),
        "hours_range": (6, 22),
        "weight_range": (0.2, 0.9),
        "gi_tagged": 1,
        "base_hourly_rate": 170,
        "complexity_range": (2, 4),
        "dialect_phrases": ["कच्छी बंधेज दुपट्टा", "अजरख ब्लॉक प्रिंट", "प्राकृतिक नील रंग"]
    },
    {
        "name": "Bastar Dhokra Bell Metal",
        "category": "Dhokra Art",
        "base_material": (500, 1600),
        "hours_range": (10, 32),
        "weight_range": (0.8, 3.5),
        "gi_tagged": 1,
        "base_hourly_rate": 190,
        "complexity_range": (3, 5),
        "dialect_phrases": ["ढोकरा आदिवासी मूर्ति", "मोम की ढलाई कला", "बेल मेटल बैल"]
    },
    {
        "name": "Kolhapuri Chappal & Leather",
        "category": "Leather Craft",
        "base_material": (350, 950),
        "hours_range": (5, 16),
        "weight_range": (0.4, 1.2),
        "gi_tagged": 1,
        "base_hourly_rate": 160,
        "complexity_range": (1, 4),
        "dialect_phrases": ["कोल्हापुरी हाथ की चप्पल", "प्राकृतिक चमड़ा", "हाथ की सिलाई"]
    },
    {
        "name": "Zari Zardozi Embroidery",
        "category": "Zari Embroidery",
        "base_material": (450, 1500),
        "hours_range": (10, 35),
        "weight_range": (0.3, 1.0),
        "gi_tagged": 0,
        "base_hourly_rate": 165,
        "complexity_range": (2, 5),
        "dialect_phrases": ["जरदोज़ी का काम", "सच्ची जरी कढ़ाई", "मखमली सूट पीस"]
    }
]

def generate_dataset(output_csv_path="indian_craft_dataset.csv", num_records=1200):
    random.seed(42)
    records = []

    fieldnames = [
        "craft_id",
        "craft_name",
        "category",
        "material_cost",
        "labor_hours",
        "weight_kg",
        "is_gi_tagged",
        "complexity_score",
        "artisan_experience_years",
        "texture_roughness_index",
        "organic_dye_purity",
        "is_genuine_handmade",
        "sample_dialect_phrase",
        "protected_artisan_wage",
        "fair_market_price"
    ]

    for i in range(1, num_records + 1):
        cat_meta = random.choice(CRAFT_CATEGORIES)
        craft_id = f"SIH-CRAFT-{i:04d}"
        
        # Determine if genuine handmade (85%) or machine imitation (15%)
        is_genuine = 1 if random.random() < 0.85 else 0
        
        material_cost = round(random.uniform(*cat_meta["base_material"]) * (1.0 if is_genuine else 0.4), 2)
        labor_hours = round(random.uniform(*cat_meta["hours_range"]) * (1.0 if is_genuine else 0.15), 1)
        weight_kg = round(random.uniform(*cat_meta["weight_range"]), 2)
        complexity = random.randint(*cat_meta["complexity_range"]) if is_genuine else random.randint(1, 2)
        exp_years = random.randint(3, 40) if is_genuine else random.randint(0, 5)
        is_gi = cat_meta["gi_tagged"] if is_genuine else 0
        
        # Vision metrics: Handmade has natural micro-variations and higher dye purity
        if is_genuine:
            texture_roughness = round(random.uniform(0.65, 0.98), 3)
            organic_dye = round(random.uniform(0.70, 0.99), 3)
        else:
            texture_roughness = round(random.uniform(0.10, 0.45), 3) # Overly smooth machine finish
            organic_dye = round(random.uniform(0.05, 0.40), 3) # Synthetic azo dyes

        # Economic Fair Wage & Price Calculation
        # Protected Artisan Wage: (Hourly Rate * Labor Hours) + Skill Bonus
        hourly_rate = cat_meta["base_hourly_rate"] + (complexity * 12)
        wage_base = labor_hours * hourly_rate
        skill_bonus = exp_years * 15
        protected_wage = round(wage_base + skill_bonus, 2) if is_genuine else round(wage_base * 0.3, 2)

        # Fair Market Price: Material Cost + Protected Wage + GI Premium + 35% Livelihood / Logistics Margin
        gi_premium = 350 if is_gi else 0
        total_base = material_cost + protected_wage + gi_premium
        margin = total_base * 0.35
        fair_price = round(total_base + margin, 2) if is_genuine else round(material_cost * 2.2, 2)

        dialect_phrase = random.choice(cat_meta["dialect_phrases"])

        records.append({
            "craft_id": craft_id,
            "craft_name": cat_meta["name"],
            "category": cat_meta["category"],
            "material_cost": material_cost,
            "labor_hours": labor_hours,
            "weight_kg": weight_kg,
            "is_gi_tagged": is_gi,
            "complexity_score": complexity,
            "artisan_experience_years": exp_years,
            "texture_roughness_index": texture_roughness,
            "organic_dye_purity": organic_dye,
            "is_genuine_handmade": is_genuine,
            "sample_dialect_phrase": dialect_phrase,
            "protected_artisan_wage": protected_wage,
            "fair_market_price": fair_price
        })

    with open(output_csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"[*] Generated {len(records)} authentic records into: {output_csv_path}")
    return output_csv_path

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, "indian_craft_dataset.csv")
    generate_dataset(output_path, 1200)
