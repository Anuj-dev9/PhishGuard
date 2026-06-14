import React from "react";
import { useParams } from "react-router-dom";

export default function ThreatDetailsPage() {
  const { id } = useParams();
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Threat Details</h1>
      <p className="text-gray-400">Viewing details for threat ID: {id}</p>
    </div>
  );
}
