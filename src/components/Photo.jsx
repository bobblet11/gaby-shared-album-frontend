import React, { useState } from "react";


export default function Photo({ id, title, date, caption, imageUrl, placeholderUrl, rotation = 0, size = 1, offsetX = 0, offsetY = 0, onOpenPhoto }) {
        const [isLoaded, setIsLoaded] = useState(false);

        return (
                <div
                        className="photo-card"
                        style={{
                                zIndex: 1,
                                cursor: "pointer",
                                userSelect: "none",
                                transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${size})`,
                                transition: "transform 0.2s ease",
                        }}
                        onClick={() => {
                                if (!isLoaded) {
                                        return;
                                }

                                const photo = {
                                        id,
                                        title,
                                        imageUrl,
                                };
                                onOpenPhoto(photo);
                        }}
                        role="button"
                        tabIndex={0}
                >
                        <div className="photo-inner">
                                <div className="photo-image-wrap">
                                        {placeholderUrl && !isLoaded && <img className="photo-image photo-placeholder" src={placeholderUrl} alt={title} />}
                                        <img className="photo-image" src={imageUrl} alt={title} loading="lazy" onLoad={() => setIsLoaded(true)} />
                                        <div className="photo-filter" />
                                </div>

                                <div className="photo-caption">
                                        <div className="photo-title">{title}</div>
                                        <div className="photo-date">{date}</div>
                                        <div className="photo-text">{caption}</div>
                                </div>
                        </div>
                </div>
        );
}
