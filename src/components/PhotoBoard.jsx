import React, { useEffect, useMemo, useRef, useState } from "react";
import Photo from "./Photo";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DOMPurify from "dompurify";

function rand(min, max) {
        return Math.random() * (max - min) + min;
}

function samePhoto(a, b) {
        if (!a || !b) return false;
        return a.title === b.title && a.caption === b.caption && a.image_endpoint === b.image_endpoint;
}
export default function PhotoBoard({ photos = [] }) {
        const boardRef = useRef(null);
        const [openPhoto, setOpenPhoto] = useState(null);
        const [editDraft, setEditDraft] = useState(null);

        const [isEditingPhoto, setIsEditingPhoto] = useState(false);
        const [isUploading, setIsUploading] = useState(false);

        useEffect(() => {
                if (openPhoto) {
                        setEditDraft({
                                title: openPhoto.title ?? "",
                                caption: openPhoto.caption ?? "",
                                image_endpoint: openPhoto.image_endpoint ?? "",
                        });
                        setIsEditingPhoto(false);
                } else {
                        setEditDraft(null);
                        setIsEditingPhoto(false);
                }
        }, [openPhoto]);

        const isDirty = useMemo(() => {
                if (!openPhoto || !editDraft) return false;

                return !samePhoto(
                        {
                                title: openPhoto.title ?? "",
                                caption: openPhoto.caption ?? "",
                                image_endpoint: openPhoto.image_endpoint ?? "",
                        },
                        editDraft,
                );
        }, [openPhoto, editDraft]);

        const API_URL = process.env.REACT_APP_API_URL;
        const USE_API_URL = process.env.REACT_APP_FEATURE_FLAG === "true";
        const items = useMemo(() => {
                const count = photos.length;

                if (count === 0) return [];

                return photos.map((p, i) => {
                        // Very minor random deviations for subtle scattered look
                        const offsetX = rand(-3, 3); // ±3px offset
                        const offsetY = rand(-3, 3); // ±3px offset
                        const rotation = rand(-2, 2); // ±2 degrees rotation
                        const size = rand(0.98, 1.02); // ±2% size variation

                        const zIndex = Math.floor(rand(1, 4));

                        return {
                                ...p,
                                rotation,
                                size,
                                zIndex,
                                offsetX,
                                offsetY,
                        };
                });
        }, [photos]);

        const deletePhoto = async (photo) => {
                const confirmed = window.confirm("Are you sure you want to delete this photo?");
                if (!confirmed) return; // stop if user cancels

                if (!USE_API_URL || !API_URL) {
                        alert("deleted photo");
                        window.location.reload(false);
                } else {
                        console.log({
                                imageEndpoint: photo.image_endpoint,
                                placeholderEndpoint: photo.placeholder_endpoint,
                        });

                        const response = await fetch(`${API_URL}/api/photo/delete`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                        imageEndpoint: photo.image_endpoint,
                                        placeholderEndpoint: photo.placeholder_endpoint,
                                }),
                        });
                        if (!response.ok) {
                                throw new Error(`Delete failed: ${response.statusText}`);
                        }
                        const result = await response.json();
                        alert("Delete successful:", result);
                        window.location.reload(false);
                }
        };

        const validateInputs = (title, caption) => {
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
                if (!openPhoto || !editDraft) return;

                if (!validateInputs(editDraft.title, editDraft.caption)) return;

                try {
                        setIsUploading(true);

                        const body = {
                                title: sanitizeInput(editDraft.title),
                                caption: sanitizeInput(editDraft.caption),
                                imageEndpoint: sanitizeInput(editDraft.image_endpoint),
                        };

                        if (USE_API_URL && API_URL) {
                                const response = await fetch(`${API_URL}/api/photo/edit`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(body),
                                });

                                if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
                        }
                } catch (error) {
                        console.error("Error editing file:", error);
                        alert("Failed to edit");
                } finally {
                        window.location.reload(false);
                        setIsUploading(false);
                        setIsEditingPhoto(false);
                }
        };

        const onOpenPhoto = (photo) => {
                if (openPhoto && photo.imageUrl === openPhoto.imageUrl) {
                        return;
                }
                setOpenPhoto(photo);
        };

        const onClosePhoto = () => {
                setOpenPhoto(null);
        };

        const onExitEdit = () => {
                setEditDraft({
                        title: openPhoto.title ?? "",
                        caption: openPhoto.caption ?? "",
                        image_endpoint: openPhoto.image_endpoint ?? "",
                });
                setIsEditingPhoto(false);
        };

        const handleDownload = async () => {
                const response = await fetch(openPhoto.checkedImageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = openPhoto.title || "photo.jpg";
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
        };

        return (
                <>
                        {openPhoto && (
                                <div
                                        className="photo-modal-backdrop"
                                        onClick={() => {
                                                if (!isEditingPhoto) onClosePhoto();
                                        }}
                                >
                                        {isEditingPhoto && editDraft && (
                                                <div className="photo-modal-backdrop" onClick={() => isEditingPhoto && onExitEdit()}>
                                                        <div className="upload-card" onClick={(e) => e.stopPropagation()}>
                                                                <div className="upload-header">
                                                                        <h1>{`Edit image ${openPhoto.title}`}</h1>
                                                                        <button type="button" className="close-btn" onClick={onExitEdit} disabled={isUploading} aria-label="Close edit panel">
                                                                                ×
                                                                        </button>
                                                                </div>

                                                                <form className="upload-form" onSubmit={handleSubmit}>
                                                                        {isUploading && <div className="spinner"></div>}

                                                                        <input type="text" placeholder="Title" value={editDraft.title} onChange={(e) => setEditDraft((prev) => ({ ...prev, title: e.target.value }))} disabled={isUploading} />

                                                                        <textarea placeholder="Caption" value={editDraft.caption} onChange={(e) => setEditDraft((prev) => ({ ...prev, caption: e.target.value }))} disabled={isUploading} />

                                                                        <button type="submit" disabled={isUploading || !isDirty}>
                                                                                Submit edit
                                                                        </button>
                                                                </form>
                                                        </div>
                                                </div>
                                        )}

                                        <div className="photo-modal-image-container" onClick={(e) => e.stopPropagation()}>
                                                <TransformWrapper initialScale={1} minScale={1} maxScale={5} centerOnInit wheel={{ step: 0.001 }} pinch={{ step: 1 }}>
                                                        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                                                                <img className="photo-modal-image" src={openPhoto.checkedImageUrl} alt={openPhoto.title} />
                                                        </TransformComponent>
                                                </TransformWrapper>

                                                <div className="photo-modal-buttons">
                                                        <button type="button" className="download-btn" onClick={handleDownload} disabled={isUploading}>
                                                                V
                                                        </button>
                                                        <button
                                                                className="photo-modal-delete"
                                                                onClick={() => {
                                                                        deletePhoto();
                                                                }}
                                                                disabled={isEditingPhoto}
                                                        >
                                                                Delete
                                                        </button>
                                                        <button className="photo-modal-edit" onClick={() => setIsEditingPhoto(true)} disabled={isEditingPhoto}>
                                                                Edit
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}

                        <div ref={boardRef} className="photo-board">
                                {items.map((photo) => (
                                        <Photo key={photo.id} {...photo} onOpenPhoto={setOpenPhoto} />
                                ))}
                        </div>
                </>
        );
}
