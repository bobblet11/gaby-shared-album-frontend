import React, { useMemo, useRef, useState } from "react";
import Photo from "./Photo";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function rand(min, max) {
        return Math.random() * (max - min) + min;
}

export default function PhotoBoard({ photos = [] }) {
        const boardRef = useRef(null);
        const [openPhoto, setOpenPhoto] = useState(null);
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

        const onOpenPhoto = (photo) => {
                if (openPhoto && photo.imageUrl === openPhoto.imageUrl) {
                        return;
                }

                setOpenPhoto(photo);
        };

        const onClosePhoto = () => {
                setOpenPhoto(null);
        };

        return (
                <>
                        {openPhoto && (
                                <div className="photo-modal-backdrop" onClick={onClosePhoto}>
                                        <div className="photo-modal-image-container" onClick={(e) => e.stopPropagation()}>
                                                <TransformWrapper initialScale={1} minScale={1} maxScale={5} centerOnInit wheel={{ step: 0.001 }} pinch={{ step: 1 }}>
                                                        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                                                                <img className="photo-modal-image" src={openPhoto.checkedImageUrl} alt={openPhoto.title} />
                                                        </TransformComponent>
                                                </TransformWrapper>

                                                <button className="photo-modal-delete " onClick={() => deletePhoto(openPhoto)}>
                                                        Delete
                                                </button>
                                        </div>
                                </div>
                        )}

                        <div ref={boardRef} className="photo-board">
                                {items.map((photo) => (
                                        <Photo key={photo.id} {...photo} onOpenPhoto={onOpenPhoto} />
                                ))}
                        </div>
                </>
        );
}
