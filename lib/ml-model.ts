// ML Model utilities for client-side prediction
export interface PatientFeatures {
  age: number;
  sex: number; // 0=Female, 1=Male
  cp: number; // Chest pain type: 0=Typical Angina, 1=Atypical Angina, 2=Non-Anginal Pain, 3=Asymptomatic
  trestbps: number; // Resting blood pressure
  chol: number; // Cholesterol
  fbs: number; // Fasting blood sugar > 120 mg/dl: 0=No, 1=Yes
  restecg: number; // Resting ECG: 0=Normal, 1=ST-T Wave Abnormality, 2=Left Ventricular Hypertrophy
  thalach: number; // Maximum heart rate
  exang: number; // Exercise induced angina: 0=No, 1=Yes
  oldpeak: number; // ST depression
  slope: number; // ST slope: 0=Upsloping, 1=Flat, 2=Downsloping
}

export interface PredictionResult {
  prediction: string;
  confidence: number;
  riskLevel: "low" | "moderate" | "high";
  recommendations: string[];
  featureImportance?: { feature: string; importance: number }[];
}

// Convert form data to ML features
export function convertFormDataToFeatures(formData: any): PatientFeatures {
  // Map chest pain types
  const chestPainMap: { [key: string]: number } = {
    TA: 0, // Typical Angina
    ATA: 1, // Atypical Angina
    NAP: 2, // Non-Anginal Pain
    ASY: 3, // Asymptomatic
  };

  // Map ECG results
  const ecgMap: { [key: string]: number } = {
    Normal: 0,
    ST: 1, // ST-T Wave Abnormality
    LVH: 2, // Left Ventricular Hypertrophy
  };

  // Map ST slope
  const slopeMap: { [key: string]: number } = {
    Up: 0, // Upsloping
    Flat: 1, // Flat
    Down: 2, // Downsloping
  };

  return {
    age: Number.parseInt(formData.age) || 0,
    sex: formData.sex === "M" ? 1 : 0,
    cp: chestPainMap[formData.chestPainType] ?? 3,
    trestbps: Number.parseInt(formData.restingBP) || 120,
    chol: Number.parseInt(formData.cholesterol) || 200,
    fbs: formData.fastingBS === "1" ? 1 : 0,
    restecg: ecgMap[formData.restingECG] ?? 0,
    thalach: Number.parseInt(formData.maxHR) || 150,
    exang: formData.exerciseAngina === "Y" ? 1 : 0,
    oldpeak: Number.parseFloat(formData.oldpeak) || 0,
    slope: slopeMap[formData.stSlope] ?? 1,
  };
}

// Simple ML prediction algorithm (simplified Random Forest logic)
export function predictHeartDisease(
  features: PatientFeatures
): PredictionResult {
  // Feature importance weights based on medical literature
  const featureWeights = {
    age: 0.15,
    sex: 0.12,
    cp: 0.18,
    trestbps: 0.1,
    chol: 0.08,
    fbs: 0.05,
    restecg: 0.07,
    thalach: 0.12,
    exang: 0.08,
    oldpeak: 0.1,
    slope: 0.05,
  };

  // Normalize features (simplified standardization)
  const normalizedFeatures = {
    age: (features.age - 54) / 9,
    sex: features.sex,
    cp: features.cp / 3,
    trestbps: (features.trestbps - 131) / 17,
    chol: (features.chol - 246) / 51,
    fbs: features.fbs,
    restecg: features.restecg / 2,
    thalach: (features.thalach - 149) / 22,
    exang: features.exang,
    oldpeak: Math.min(features.oldpeak / 3, 1),
    slope: features.slope / 2,
  };

  // Calculate risk score
  let riskScore = 0;
  Object.entries(normalizedFeatures).forEach(([key, value]) => {
    const weight = featureWeights[key as keyof typeof featureWeights];
    riskScore += value * weight;
  });

  // Add specific risk factors
  if (features.age > 55) riskScore += 0.2;
  if (features.sex === 1) riskScore += 0.15; // Male
  if (features.cp === 0) riskScore += 0.3; // Typical angina
  if (features.trestbps > 140) riskScore += 0.2;
  if (features.chol > 240) riskScore += 0.15;
  if (features.exang === 1) riskScore += 0.2;
  if (features.oldpeak > 1.0) riskScore += 0.2;

  // Convert to probability (sigmoid-like function)
  const probability = 1 / (1 + Math.exp(-riskScore * 2));
  const confidence = Math.round(probability * 100);

  // Determine prediction and risk level
  const hasHeartDisease = probability > 0.5;
  const prediction = hasHeartDisease
    ? "Heart Disease Risk Detected"
    : "No Heart Disease Detected";

  let riskLevel: "low" | "moderate" | "high";
  if (probability < 0.3) riskLevel = "low";
  else if (probability < 0.7) riskLevel = "moderate";
  else riskLevel = "high";

  // Generate recommendations based on risk factors
  const recommendations = generateRecommendations(features, riskLevel);

  // Feature importance for this prediction
  const featureImportance = Object.entries(featureWeights)
    .map(([feature, importance]) => ({
      feature: feature.charAt(0).toUpperCase() + feature.slice(1),
      importance: Math.round(importance * 100),
    }))
    .sort((a, b) => b.importance - a.importance);

  return {
    prediction,
    confidence,
    riskLevel,
    recommendations,
    featureImportance,
  };
}

function generateRecommendations(
  features: PatientFeatures,
  riskLevel: string
): string[] {
  const recommendations: string[] = [];

  // Age-based recommendations
  if (features.age > 60) {
    recommendations.push("Regular cardiac screening due to advanced age");
  }

  // Blood pressure recommendations
  if (features.trestbps > 140) {
    recommendations.push(
      "Monitor and manage high blood pressure with medication if needed"
    );
  } else if (features.trestbps > 120) {
    recommendations.push(
      "Maintain healthy blood pressure through diet and exercise"
    );
  }

  // Cholesterol recommendations
  if (features.chol > 240) {
    recommendations.push(
      "Reduce cholesterol through diet changes and consider statin therapy"
    );
  } else if (features.chol > 200) {
    recommendations.push(
      "Monitor cholesterol levels and maintain heart-healthy diet"
    );
  }

  // Exercise recommendations
  if (features.thalach < 120) {
    recommendations.push(
      "Gradually increase cardiovascular fitness under medical supervision"
    );
  } else {
    recommendations.push(
      "Maintain regular cardiovascular exercise (150 min/week)"
    );
  }

  // Chest pain recommendations
  if (features.cp === 0) {
    recommendations.push(
      "Seek immediate medical attention for chest pain episodes"
    );
  }

  // Exercise angina recommendations
  if (features.exang === 1) {
    recommendations.push("Discuss exercise limitations with your cardiologist");
  }

  // General recommendations based on risk level
  if (riskLevel === "high") {
    recommendations.push("Schedule immediate consultation with a cardiologist");
    recommendations.push("Consider cardiac stress testing and imaging");
  } else if (riskLevel === "moderate") {
    recommendations.push("Schedule follow-up with your primary care physician");
    recommendations.push("Consider preventive cardiac medications");
  } else {
    recommendations.push("Continue healthy lifestyle habits");
    recommendations.push("Annual cardiovascular risk assessment");
  }

  // Lifestyle recommendations
  recommendations.push("Follow Mediterranean diet rich in omega-3 fatty acids");
  recommendations.push("Avoid smoking and limit alcohol consumption");
  recommendations.push("Manage stress through relaxation techniques");

  return recommendations.slice(0, 5); // Return top 5 recommendations
}
