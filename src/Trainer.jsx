import React, { useState } from "react";
import api from "./api";

const Trainer = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [trainingResult, setTrainingResult] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState("");
    const [progress, setProgress] = useState([]);

    const handleTrainClick = async () => {
        setIsTraining(true);
        setProgress([]);

        const ws = new WebSocket("ws://localhost:8080/ws/train");

        ws.onmessage = (event) => {
            if (
                event.data.includes("Training was successful") ||
                event.data.includes("Error")
            ) {
                setTrainingResult(event.data);
                setIsTraining(false);
                ws.close();
            } else {
                setProgress((prevProgress) => [...prevProgress, event.data]);
            }
        };

        ws.onclose = () => {
            setIsTraining(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setTrainingResult("Error during training");
            setIsTraining(false);
        };
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUploadClick = async () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await api.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadResult(response.data.message);
        } catch (error) {
            console.error("Upload error:", error);
            setUploadResult("Error during file upload");
        }
    };

    return (
        <div>
            <button
                className="btn btn-primary "
                onClick={handleTrainClick}
                disabled={isTraining}
            >
                {isTraining ? "Training..." : "Train"}
            </button>
            {isTraining && <p className="mt-3">Training in progress...</p>}
            <div className="mt-3">
                {progress.map((message, index) => (
                    <div key={index} className="alert alert-info">
                        {message}
                    </div>
                ))}
            </div>
            {trainingResult && (
                <div className="mt-3 alert alert-info">
                    <strong>Training Result:</strong> {trainingResult}
                </div>
            )}
            <div className="mt-4">
                <input type="file" accept=".zip" onChange={handleFileChange} />
                <button
                    className="btn btn-secondary mt-2"
                    onClick={handleUploadClick}
                >
                    Upload
                </button>
                {uploadResult && (
                    <div className="mt-3 alert alert-info">
                        <strong>Upload Result:</strong> {uploadResult}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trainer;
