import React, { useMemo, useRef, useState } from "react";
import Photo from "./Photo";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function rand(min, max) {
        return Math.random() * (max - min) + min;
}

export default function PhotoBoard({ photos = [] }) {
        const boardRef = useRef(null);
        const [openPhoto, setOpenPhoto] = useState(null);

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
