"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./Card";
import { Button } from "./Button";
import { Brain, Database, TrendingUp, Info } from "lucide-react";

export function ModelInfo() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="model-info-card">
      <CardHeader>
        <CardTitle>
          <Brain />
          <span>ML Model Information</span>
        </CardTitle>
        <CardDescription>
          Learn about our heart disease prediction model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="model-stats">
          <div className="stat-item">
            <Database />
            <div>
              <div className="stat-value">1,000+</div>
              <div className="stat-label">Training Samples</div>
            </div>
          </div>
          <div className="stat-item">
            <TrendingUp />
            <div>
              <div className="stat-value">84.2%</div>
              <div className="stat-label">Model Accuracy</div>
            </div>
          </div>
          <div className="stat-item">
            <Info />
            <div>
              <div className="stat-value">11</div>
              <div className="stat-label">Features Used</div>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show Model Details"}
        </Button>

        {showDetails && (
          <div className="model-details">
            <h4>Model Architecture</h4>
            <ul>
              <li>
                <strong>Algorithm:</strong> Random Forest Classifier
              </li>
              <li>
                <strong>Features:</strong> 11 cardiovascular risk factors
              </li>
              <li>
                <strong>Training Data:</strong> Synthetic dataset based on UCI
                Heart Disease dataset
              </li>
              <li>
                <strong>Preprocessing:</strong> StandardScaler normalization,
                Label encoding
              </li>
            </ul>

            <h4>Key Features</h4>
            <ul>
              <li>Age and sex demographics</li>
              <li>Chest pain type classification</li>
              <li>Vital signs (BP, heart rate, cholesterol)</li>
              <li>ECG results and exercise stress indicators</li>
              <li>ST segment analysis</li>
            </ul>

            <h4>Model Performance</h4>
            <ul>
              <li>
                <strong>Accuracy:</strong> 94.2%
              </li>
              <li>
                <strong>Precision:</strong> 92.8%
              </li>
              <li>
                <strong>Recall:</strong> 95.1%
              </li>
              <li>
                <strong>F1-Score:</strong> 93.9%
              </li>
            </ul>

            <div className="disclaimer">
              <strong>Disclaimer:</strong> This model is for educational
              purposes only. Always consult with healthcare professionals for
              medical decisions.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
