import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

export default function UploadPage() {
        const API_URL = process.env.REACT_APP_API_URL;
        const USE_API_URL = process.env.REACT_APP_FEATURE_FLAG === "true";

        const navigate = useNavigate();
        const goToHomePage = () => {
                try {
                        navigate("/");
                } catch (error) {
                        console.error("Navigation error:", error);
                }
        };

        const [title, setTitle] = useState("");
        const [caption, setCaption] = useState("");
        const [file, setFile] = useState(null);
        const [dragOver, setDragOver] = useState(false);

        const [isMultipleFilesSelected, setIsMultipleFilesSelected] = useState(false);

        const previewUrls = useMemo(() => {
                if (!file || file.length === 0) return [];
                return file.map((f) => URL.createObjectURL(f));
        }, [file]);

        const onUpload = async (formData) => {
                try {
                        if (USE_API_URL && API_URL) {
                                const response = await fetch(`${API_URL}/api/photo`, {
                                        method: "POST",
                                        body: formData,
                                });

                                if (!response.ok) {
                                        throw new Error(`Upload failed: ${response.statusText}`);
                                }

                                const result = await response.json();
                                console.log("Upload successful:", result);
                        }

                        alert("Successfully uploaded");
                        window.location.reload(false);
                } catch (error) {
                        console.error("Error uploading file:", error);
                        alert("Failed to upload");
                        window.location.reload(false);
                }
        };

        const validateInputs = (title, caption) => {
                if (!title.trim()) {
                        alert("Title is required.");
                        return false;
                }
                if (title.length > 100) {
                        alert("Title must be less than 100 characters.");
                        return false;
                }
                if (caption.length > 500) {
                        alert("Caption must be less than 500 characters.");
                        return false;
                }
                return true;
        };

        const sanitizeInput = (input) => {
                return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (!file || file.length === 0) {
                        alert("Please select at least one image before uploading.");
                        return;
                }

                const formData = new FormData();

                if (file.length === 1) {
                        // Single file: validate + sanitize
                        if (!validateInputs(title, caption)) return;
                        const safeTitle = sanitizeInput(title);
                        const safeCaption = sanitizeInput(caption);
                        formData.append("title", safeTitle);
                        formData.append("caption", safeCaption);
                        formData.append("image", file[0]);
                } else {
                        // Multiple files: skip title/caption
                        file.forEach((f) => formData.append("image", f));
                }

                await onUpload?.(formData);
        };

        return (
                <div className="upload-page">
                        <header className="top-banner">
                                <div className="title-card">Gaby's Corkboard</div>
                                <button className="upload-button" onClick={goToHomePage}>
                                        Home
                                </button>
                        </header>

                        <div className="upload-card">
                                <div className="upload-header">
                                        <h1>Upload a Polaroid</h1>
                                </div>

                                <form className="upload-form" onSubmit={handleSubmit}>
                                        <div
                                                className={`upload-dropzone ${dragOver ? "drag-over" : ""}`}
                                                onDrop={(e) => {
                                                        e.preventDefault();
                                                        setDragOver(false);
                                                        const dropped = e.dataTransfer.files?.[0];
                                                        if (dropped) setFile(dropped);
                                                }}
                                                onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setDragOver(true);
                                                }}
                                                onDragLeave={() => setDragOver(false)}
                                        >
                                                {previewUrls.length > 0 ? (
                                                        <div className="upload-preview-slider">
                                                                {previewUrls.map((url, idx) => (
                                                                        <div key={idx} className="upload-preview-item">
                                                                                <img className="upload-preview" src={url} alt={`Preview ${idx}`} />
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <p>Drag and drop images here, or tap below to select</p>
                                                )}

                                                <label className="file-upload-button">
                                                        Select Images
                                                        <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={(e) => {
                                                                        const files = Array.from(e.target.files);

                                                                        if (files.length > 1) {
                                                                                setIsMultipleFilesSelected(false);
                                                                        } else {
                                                                                setIsMultipleFilesSelected(true);
                                                                        }

                                                                        setFile(Array.from(e.target.files));
                                                                }}
                                                                style={{ display: "none" }}
                                                        />
                                                </label>
                                        </div>

                                        {isMultipleFilesSelected ? <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /> : <></>}
                                        {isMultipleFilesSelected ? <textarea placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} /> : <></>}

                                        <button type="submit">Upload</button>
                                </form>
                        </div>
                </div>
        );
}
