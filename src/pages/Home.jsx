import React, { useEffect, useState } from "react";
import PhotoBoard from "../components/PhotoBoard";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_PHOTOS = [
        {
                id: 1,
                title: "Beach Day",
                date: "2026-05-20",
                caption: "Sunset in Hong Kong",
                imageUrl: "https://picsum.photos/400/400?random=1",
                placeholderUrl: "https://picsum.photos/100/100?random=101",
        },
        {
                id: 2,
                title: "Coffee Time",
                date: "2026-05-19",
                caption: "Morning brew",
                imageUrl: "https://picsum.photos/400/400?random=2",
                placeholderUrl: "https://picsum.photos/100/100?random=102",
        },
        {
                id: 3,
                title: "City Walk",
                date: "2026-05-18",
                caption: "Exploring streets",
                imageUrl: "https://picsum.photos/400/400?random=3",
                placeholderUrl: "https://picsum.photos/100/100?random=103",
        },
        {
                id: 4,
                title: "Mountain View",
                date: "2026-05-17",
                caption: "Hiking adventure",
                imageUrl: "https://picsum.photos/400/400?random=4",
                placeholderUrl: "https://picsum.photos/100/100?random=104",
        },
        {
                id: 5,
                title: "Coffee Shop",
                date: "2026-05-16",
                caption: "Cozy corner",
                imageUrl: "https://picsum.photos/400/400?random=5",
                placeholderUrl: "https://picsum.photos/100/100?random=105",
        },
        {
                id: 6,
                title: "Night Sky",
                date: "2026-05-15",
                caption: "Starry night",
                imageUrl: "https://picsum.photos/400/400?random=6",
                placeholderUrl: "https://picsum.photos/100/100?random=106",
        },
        {
                id: 7,
                title: "Park Picnic",
                date: "2026-05-14",
                caption: "Sunday chill",
                imageUrl: "https://picsum.photos/400/400?random=7",
                placeholderUrl: "https://picsum.photos/100/100?random=107",
        },
        {
                id: 8,
                title: "Book Store",
                date: "2026-05-13",
                caption: "Found great books",
                imageUrl: "https://picsum.photos/400/400?random=8",
                placeholderUrl: "https://picsum.photos/100/100?random=108",
        },
        {
                id: 9,
                title: "Food Market",
                date: "2026-05-12",
                caption: "Delicious snacks",
                imageUrl: "https://picsum.photos/400/400?random=9",
                placeholderUrl: "https://picsum.photos/100/100?random=109",
        },
        {
                id: 10,
                title: "Train Ride",
                date: "2026-05-11",
                caption: "Travel mode",
                imageUrl: "https://picsum.photos/400/400?random=10",
                placeholderUrl: "https://picsum.photos/100/100?random=110",
        },
        {
                id: 11,
                title: "Garden",
                date: "2026-05-10",
                caption: "Flowers blooming",
                imageUrl: "https://picsum.photos/400/400?random=11",
                placeholderUrl: "https://picsum.photos/100/100?random=111",
        },
        {
                id: 12,
                title: "Art Gallery",
                date: "2026-05-09",
                caption: "Beautiful paintings",
                imageUrl: "https://picsum.photos/400/400?random=12",
                placeholderUrl: "https://picsum.photos/100/100?random=112",
        },
        {
                id: 13,
                title: "Rooftop",
                date: "2026-05-08",
                caption: "Skyline view",
                imageUrl: "https://picsum.photos/400/400?random=13",
                placeholderUrl: "https://picsum.photos/100/100?random=113",
        },
        {
                id: 14,
                title: "Bakery",
                date: "2026-05-07",
                caption: "Fresh pastries",
                imageUrl: "https://picsum.photos/400/400?random=14",
                placeholderUrl: "https://picsum.photos/100/100?random=114",
        },
        {
                id: 15,
                title: "River Side",
                date: "2026-05-06",
                caption: "Peaceful water",
                imageUrl: "https://picsum.photos/400/400?random=15",
                placeholderUrl: "https://picsum.photos/100/100?random=115",
        },
        {
                id: 16,
                title: "Office Day",
                date: "2026-05-05",
                caption: "Work vibes",
                imageUrl: "https://picsum.photos/400/400?random=16",
                placeholderUrl: "https://picsum.photos/100/100?random=116",
        },
        {
                id: 17,
                title: "Gym Time",
                date: "2026-05-04",
                caption: "Leg day",
                imageUrl: "https://picsum.photos/400/400?random=17",
                placeholderUrl: "https://picsum.photos/100/100?random=117",
        },
        {
                id: 18,
                title: "Movie Night",
                date: "2026-05-03",
                caption: "Just watched a film",
                imageUrl: "https://picsum.photos/400/400?random=18",
                placeholderUrl: "https://picsum.photos/100/100?random=118",
        },
        {
                id: 19,
                title: "Street Food",
                date: "2026-05-02",
                caption: "Yummy noodles",
                imageUrl: "https://picsum.photos/400/400?random=19",
                placeholderUrl: "https://picsum.photos/100/100?random=119",
        },
        {
                id: 20,
                title: "Library",
                date: "2026-05-01",
                caption: "Quiet reading",
                imageUrl: "https://picsum.photos/400/400?random=20",
                placeholderUrl: "https://picsum.photos/100/100?random=120",
        },
        {
                id: 21,
                title: "Bike Ride",
                date: "2026-04-30",
                caption: "Cycling around",
                imageUrl: "https://picsum.photos/400/400?random=21",
                placeholderUrl: "https://picsum.photos/100/100?random=121",
        },
        {
                id: 22,
                title: "Sunset",
                date: "2026-04-29",
                caption: "Amazing colors",
                imageUrl: "https://picsum.photos/400/400?random=22",
                placeholderUrl: "https://picsum.photos/100/100?random=122",
        },
        {
                id: 23,
                title: "Dinner",
                date: "2026-04-28",
                caption: "Fine dining",
                imageUrl: "https://picsum.photos/400/400?random=23",
                placeholderUrl: "https://picsum.photos/100/100?random=123",
        },
        {
                id: 24,
                title: "Museum",
                date: "2026-04-27",
                caption: "History lesson",
                imageUrl: "https://picsum.photos/400/400?random=24",
                placeholderUrl: "https://picsum.photos/100/100?random=124",
        },
        {
                id: 25,
                title: "Rainy Day",
                date: "2026-04-26",
                caption: "Cozy inside",
                imageUrl: "https://picsum.photos/400/400?random=25",
                placeholderUrl: "https://picsum.photos/100/100?random=125",
        },
        {
                id: 26,
                title: "Beach Walk",
                date: "2026-04-25",
                caption: "Sand between toes",
                imageUrl: "https://picsum.photos/400/400?random=26",
                placeholderUrl: "https://picsum.photos/100/100?random=126",
        },
        {
                id: 27,
                title: "Concert",
                date: "2026-04-24",
                caption: "Live music",
                imageUrl: "https://picsum.photos/400/400?random=27",
                placeholderUrl: "https://picsum.photos/100/100?random=127",
        },
        {
                id: 28,
                title: "Cat",
                date: "2026-04-23",
                caption: "Cute kitty",
                imageUrl: "https://picsum.photos/400/400?random=28",
                placeholderUrl: "https://picsum.photos/100/100?random=128",
        },
        {
                id: 29,
                title: "Dog",
                date: "2026-04-22",
                caption: "Good boy",
                imageUrl: "https://picsum.photos/400/400?random=29",
                placeholderUrl: "https://picsum.photos/100/100?random=129",
        },
        {
                id: 30,
                title: "Friends",
                date: "2026-04-21",
                caption: "Best times",
                imageUrl: "https://picsum.photos/400/400?random=30",
                placeholderUrl: "https://picsum.photos/100/100?random=130",
        },
];

export default function HomePage() {
        const [photos, setPhotos] = useState(PLACEHOLDER_PHOTOS);

        useEffect(() => {
                //returns json containing all the imageUrls and placeholderUrls
                const loadPhotos = async () => {
                        const res = await fetch("/api/photos");
                        const data = await res.json();
                        setPhotos(data);
                };
                loadPhotos();
        }, []);

        const navigate = useNavigate();

        const goToUploadPage = () => {
                try {
                        navigate("/upload");
                } catch (error) {
                        console.error("Navigation error:", error);
                }
        };

        return (
                <div className="home-page">
                        <header className="top-banner">
                                <div className="title-card">Gaby's Corkboard</div>
                                <button className="upload-button" onClick={goToUploadPage}>
                                        Upload
                                </button>
                        </header>

                        <main className="home-main">
                                <PhotoBoard photos={photos} />
                        </main>
                </div>
        );
}
