"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Select, SelectItem, SelectValue } from "../components/Select";
import { RadioGroup, RadioGroupItem } from "../components/RadioGroup";
import { Progress } from "../components/Progress";
import {
  Heart,
  Activity,
  User,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Brain,
} from "lucide-react";
import { Badge } from "../components/Badge";
import { ModelInfo } from "../components/ModelInfo";

interface PatientData {
  age: string;
  sex: string;
  chestPainType: string;
  restingBP: string;
  cholesterol: string;
  fastingBS: string;
  restingECG: string;
  maxHR: string;
  exerciseAngina: string;
  oldpeak: string;
  stSlope: string;
}

interface PredictionResult {
  prediction: string;
  confidence: number;
  riskLevel: "low" | "moderate" | "high";
  recommendations: string[];
}

export default function HeartDiseasePredictor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>({
    age: "",
    sex: "",
    chestPainType: "",
    restingBP: "",
    cholesterol: "",
    fastingBS: "",
    restingECG: "",
    maxHR: "",
    exerciseAngina: "",
    oldpeak: "",
    stSlope: "",
  });

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Vital Signs", icon: Activity },
    { title: "Medical History", icon: Stethoscope },
    { title: "Results", icon: Heart },
  ];

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setCurrentStep(3);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Error:", error);
      // Fallback prediction for demo
      const mockResult: PredictionResult = {
        prediction:
          Math.random() > 0.5
            ? "No Heart Disease Detected"
            : "Heart Disease Risk Detected",
        confidence: Math.round(Math.random() * 30 + 70),
        riskLevel:
          Math.random() > 0.6
            ? "low"
            : Math.random() > 0.3
            ? "moderate"
            : "high",
        recommendations: [
          "Regular cardiovascular exercise",
          "Maintain healthy diet low in saturated fats",
          "Monitor blood pressure regularly",
          "Schedule regular check-ups with cardiologist",
        ],
      };
      setPrediction(mockResult);
    }

    setIsLoading(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={patientData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Sex</Label>
                <RadioGroup
                  value={patientData.sex}
                  onValueChange={(value) => handleInputChange("sex", value)}
                >
                  <div className="radio-item">
                    <RadioGroupItem value="M" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="F" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="form-group">
              <Label>Chest Pain Type</Label>
              <Select
                value={patientData.chestPainType}
                onValueChange={(value) =>
                  handleInputChange("chestPainType", value)
                }
              >
                <SelectValue placeholder="Select chest pain type" />
                <SelectItem value="TA">Typical Angina</SelectItem>
                <SelectItem value="ATA">Atypical Angina</SelectItem>
                <SelectItem value="NAP">Non-Anginal Pain</SelectItem>
                <SelectItem value="ASY">Asymptomatic</SelectItem>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <Label htmlFor="restingBP">
                  Resting Blood Pressure (mm Hg)
                </Label>
                <Input
                  id="restingBP"
                  type="number"
                  placeholder="e.g., 120"
                  value={patientData.restingBP}
                  onChange={(e) =>
                    handleInputChange("restingBP", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <Label htmlFor="cholesterol">Cholesterol (mg/dl)</Label>
                <Input
                  id="cholesterol"
                  type="number"
                  placeholder="e.g., 200"
                  value={patientData.cholesterol}
                  onChange={(e) =>
                    handleInputChange("cholesterol", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <Label htmlFor="maxHR">Maximum Heart Rate</Label>
                <Input
                  id="maxHR"
                  type="number"
                  placeholder="e.g., 150"
                  value={patientData.maxHR}
                  onChange={(e) => handleInputChange("maxHR", e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label htmlFor="oldpeak">ST Depression (Oldpeak)</Label>
                <Input
                  id="oldpeak"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.0"
                  value={patientData.oldpeak}
                  onChange={(e) => handleInputChange("oldpeak", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <div className="form-group">
              <Label>Fasting Blood Sugar {">"} 120 mg/dl</Label>
              <RadioGroup
                value={patientData.fastingBS}
                onValueChange={(value) => handleInputChange("fastingBS", value)}
              >
                <div className="radio-item">
                  <RadioGroupItem value="1" id="fbs-yes" />
                  <Label htmlFor="fbs-yes">Yes</Label>
                </div>
                <div className="radio-item">
                  <RadioGroupItem value="0" id="fbs-no" />
                  <Label htmlFor="fbs-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="form-group">
              <Label>Resting ECG Results</Label>
              <Select
                value={patientData.restingECG}
                onValueChange={(value) =>
                  handleInputChange("restingECG", value)
                }
              >
                <SelectValue placeholder="Select ECG result" />
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="ST">ST-T Wave Abnormality</SelectItem>
                <SelectItem value="LVH">
                  Left Ventricular Hypertrophy
                </SelectItem>
              </Select>
            </div>

            <div className="form-group">
              <Label>Exercise Induced Angina</Label>
              <RadioGroup
                value={patientData.exerciseAngina}
                onValueChange={(value) =>
                  handleInputChange("exerciseAngina", value)
                }
              >
                <div className="radio-item">
                  <RadioGroupItem value="Y" id="angina-yes" />
                  <Label htmlFor="angina-yes">Yes</Label>
                </div>
                <div className="radio-item">
                  <RadioGroupItem value="N" id="angina-no" />
                  <Label htmlFor="angina-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="form-group">
              <Label>ST Slope</Label>
              <Select
                value={patientData.stSlope}
                onValueChange={(value) => handleInputChange("stSlope", value)}
              >
                <SelectValue placeholder="Select ST slope" />
                <SelectItem value="Up">Upsloping</SelectItem>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="Down">Downsloping</SelectItem>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="results-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-heart">
                  <Heart />
                </div>
                <p className="loading-text">Wait.....Analysing!</p>
                <Progress value={75} />
              </div>
            ) : prediction ? (
              <div className="results-container">
                <div className="result-banner">
                  <div
                    className={`result-status ${
                      prediction.prediction.includes("No") ? "healthy" : "risk"
                    }`}
                  >
                    {prediction.prediction.includes("No") ? (
                      <CheckCircle />
                    ) : (
                      <AlertTriangle />
                    )}
                    <span className="result-text">{prediction.prediction}</span>
                  </div>
                </div>

                <div className="results-grid">
                  <Card className="result-card">
                    <CardHeader>
                      <CardTitle>Risk Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="confidence-score">
                        {prediction.confidence}%
                      </div>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${prediction.confidence}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="result-card">
                    <CardHeader>
                      <CardTitle>Risk Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        variant={
                          prediction.riskLevel === "low"
                            ? "default"
                            : prediction.riskLevel === "moderate"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {prediction.riskLevel.toUpperCase()}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations..</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="recommendations-list">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="recommendation-item">
                          <CheckCircle />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  const getCurrentStepIcon = () => {
    return steps[currentStep].icon;
  };

  const getCurrentStepTitle = () => {
    return steps[currentStep].title;
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        <div className="header">
          <div className="header-title">
            <Heart className="heart-icon" />
            <h1>Heart Disease Predictor</h1>
          </div>
          <p className="header-subtitle">
            Cardiovascular Disease Prediction By Given Data
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-section">
          <div className="steps-container">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="step-item">
                  <div
                    className={`step-icon ${
                      index <= currentStep ? "active" : "inactive"
                    }`}
                  >
                    <Icon />
                  </div>
                  <span
                    className={`step-label ${
                      index <= currentStep ? "active" : "inactive"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} />
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {(() => {
                const Icon = getCurrentStepIcon();
                return <Icon />;
              })()}
              <span>{getCurrentStepTitle()}</span>
            </CardTitle>
            <CardDescription>
              {currentStep === 0 && "Let's start with your basic information"}
              {currentStep === 1 &&
                "Now we need your vital signs and measurements"}
              {currentStep === 2 && "Finally, some medical history details"}
              {currentStep === 3 && "Here are your results"}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>

          {currentStep < 3 && (
            <div className="button-group">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep === 2 ? (
                <Button onClick={handlePredict} variant="danger">
                  <Heart />
                  Submit Details
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </div>
          )}
        </Card>

        {prediction && (
          <div className="restart-section">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(0);
                setPrediction(null);
                setPatientData({
                  age: "",
                  sex: "",
                  chestPainType: "",
                  restingBP: "",
                  cholesterol: "",
                  fastingBS: "",
                  restingECG: "",
                  maxHR: "",
                  exerciseAngina: "",
                  oldpeak: "",
                });
              }}
            >
              Start New Test
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
