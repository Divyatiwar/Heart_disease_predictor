import { type NextRequest, NextResponse } from "next/server";
import {
  convertFormDataToFeatures,
  predictHeartDisease,
} from "../../../lib/ml-model";

export async function POST(request: NextRequest) {
  try {
    const patientData = await request.json();

    // Convert form data to ML features
    const features = convertFormDataToFeatures(patientData);

    // Make prediction using our ML model
    const result = predictHeartDisease(features);

    // Add some processing delay to simulate real ML inference
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);

    // Fallback response
    return NextResponse.json({
      prediction: "Unable to process ",
      confidence: 0,
      riskLevel: "moderate",
      recommendations: [
        "Consult with a healthcare professional",
        "Regular cardiovascular monitoring",
        "Maintain a healthy lifestyle",
        "Follow up with your doctor",
      ],
    });
  }
}
