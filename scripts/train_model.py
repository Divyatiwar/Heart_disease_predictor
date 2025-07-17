import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import json

# Create a comprehensive heart disease dataset
def create_heart_disease_dataset():
    """Create a realistic heart disease dataset based on UCI Heart Disease dataset structure"""
    np.random.seed(42)
    n_samples = 1000
    
    # Generate realistic data
    data = {
        'age': np.random.normal(54, 9, n_samples).astype(int),
        'sex': np.random.choice([0, 1], n_samples, p=[0.32, 0.68]),  # 0=Female, 1=Male
        'cp': np.random.choice([0, 1, 2, 3], n_samples, p=[0.47, 0.16, 0.29, 0.08]),  # Chest pain type
        'trestbps': np.random.normal(131, 17, n_samples).astype(int),  # Resting blood pressure
        'chol': np.random.normal(246, 51, n_samples).astype(int),  # Cholesterol
        'fbs': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),  # Fasting blood sugar
        'restecg': np.random.choice([0, 1, 2], n_samples, p=[0.48, 0.48, 0.04]),  # Resting ECG
        'thalach': np.random.normal(149, 22, n_samples).astype(int),  # Max heart rate
        'exang': np.random.choice([0, 1], n_samples, p=[0.68, 0.32]),  # Exercise induced angina
        'oldpeak': np.random.exponential(1.0, n_samples).round(1),  # ST depression
        'slope': np.random.choice([0, 1, 2], n_samples, p=[0.21, 0.14, 0.65]),  # ST slope
    }
    
    df = pd.DataFrame(data)
    
    # Ensure realistic ranges
    df['age'] = np.clip(df['age'], 29, 77)
    df['trestbps'] = np.clip(df['trestbps'], 94, 200)
    df['chol'] = np.clip(df['chol'], 126, 564)
    df['thalach'] = np.clip(df['thalach'], 71, 202)
    df['oldpeak'] = np.clip(df['oldpeak'], 0, 6.2)
    
    # Create target variable based on realistic medical correlations
    risk_score = (
        (df['age'] > 55) * 0.3 +
        (df['sex'] == 1) * 0.2 +  # Male higher risk
        (df['cp'] == 0) * 0.4 +   # Typical angina = higher risk
        (df['trestbps'] > 140) * 0.3 +
        (df['chol'] > 240) * 0.2 +
        (df['fbs'] == 1) * 0.1 +
        (df['restecg'] != 0) * 0.2 +
        (df['thalach'] < 150) * 0.2 +
        (df['exang'] == 1) * 0.3 +
        (df['oldpeak'] > 1.0) * 0.3 +
        (df['slope'] != 1) * 0.2 +
        np.random.normal(0, 0.1, n_samples)  # Add some randomness
    )
    
    # Convert to binary classification
    df['target'] = (risk_score > np.percentile(risk_score, 55)).astype(int)
    
    return df

def train_heart_disease_model():
    """Train a Random Forest model for heart disease prediction"""
    print("Creating heart disease dataset...")
    df = create_heart_disease_dataset()
    
    # Save the dataset
    df.to_csv('heart_disease_dataset.csv', index=False)
    print(f"Dataset created with {len(df)} samples")
    print(f"Heart disease cases: {df['target'].sum()} ({df['target'].mean():.1%})")
    
    # Prepare features and target
    X = df.drop('target', axis=1)
    y = df['target']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("Training Random Forest model...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    
    rf_model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = rf_model.predict(X_test_scaled)
    y_pred_proba = rf_model.predict_proba(X_test_scaled)
    
    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    # Save the model and scaler
    joblib.dump(rf_model, 'heart_disease_model.pkl')
    joblib.dump(scaler, 'heart_disease_scaler.pkl')
    
    # Save feature names and model info
    model_info = {
        'feature_names': X.columns.tolist(),
        'accuracy': accuracy,
        'feature_importance': feature_importance.to_dict('records'),
        'model_type': 'RandomForestClassifier',
        'training_samples': len(X_train),
        'test_samples': len(X_test)
    }
    
    with open('model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print("\nModel training completed!")
    print("Files saved:")
    print("- heart_disease_model.pkl")
    print("- heart_disease_scaler.pkl") 
    print("- model_info.json")
    print("- heart_disease_dataset.csv")
    
    return rf_model, scaler, model_info

# Run the training
if __name__ == "__main__":
    model, scaler, info = train_heart_disease_model()
