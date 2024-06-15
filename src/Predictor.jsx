import React, { useState } from "react";
import api from "./api";

const Predictor = () => {
    const [sentence1, setSentence1] = useState("");
    const [sentence2, setSentence2] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post(`/predict`, null, {
                params: {
                    sentence_1: sentence1,
                    sentence_2: sentence2,
                },
            });
            setResult(response.data.similarity);
        } catch (error) {
            console.error("Fetch error:", error);
            setResult("Error fetching prediction");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event, setSentence) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSentence(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="form-group">
                <textarea
                    className="form-control mb-3"
                    value={sentence1}
                    onChange={(e) => setSentence1(e.target.value)}
                    placeholder="Enter first sentence"
                    rows="3"
                />
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileUpload(e, setSentence1)}
                    className="form-control mb-3"
                />
            </div>
            <div className="form-group">
                <textarea
                    className="form-control mb-3"
                    value={sentence2}
                    onChange={(e) => setSentence2(e.target.value)}
                    placeholder="Enter second sentence"
                    rows="3"
                />
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileUpload(e, setSentence2)}
                    className="form-control mb-3"
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Predict
            </button>
            {loading ? (
                <div className="mt-3 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Wait please...</p>
                </div>
            ) : (
                result && (
                    <div className="mt-3 alert alert-success">
                        <strong>Result:</strong> {result}
                    </div>
                )
            )}
        </form>
    );
};

export default Predictor;
