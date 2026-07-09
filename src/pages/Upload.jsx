import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadPage({onUpload}) {

        const navigate = useNavigate();

        const goToHomePage = () => {
                try {
                        navigate("/");
                } catch (error) {
                        console.error("Navigation error:", error);
                }
        };





        const [title, setTitle] = useState("");
        const [date, setDate] = useState("");
        const [caption, setCaption] = useState("");
        const [file, setFile] = useState(null);
        const [dragOver, setDragOver] = useState(false);

        const previewUrl = useMemo(() => {
                return file ? URL.createObjectURL(file) : "";
        }, [file]);

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (!file) return;

                const formData = new FormData();
                formData.append("title", title);
                formData.append("date", date);
                formData.append("caption", caption);
                formData.append("image", file);

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
                                                {previewUrl ? <img className="upload-preview" src={previewUrl} alt="Preview" /> : <p>Drag and drop an image here</p>}
                                                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                        </div>

                                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

                                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                                        <textarea placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />

                                        <button type="submit">Upload</button>
                                </form>
                        </div>
                </div>
        );
}
