import { useState } from "react";

/**
 * Array of GIF URLs that tell the user to go away.
 * Displayed randomly when a user tries to access a blocked site.
 */
const HELL_NO_GIFS = [
    "https://media3.giphy.com/media/cf8wLYdRWjM6A/giphy.gif?cid=ecf05e47cxm4gtpsexiudbi68b1g7j8bghfn1j0sp9bi78di&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/STfLOU6iRBRunMciZv/giphy.gif",
    "https://media.giphy.com/media/d10dMmzqCYqQ0/giphy.gif",
    "https://media.giphy.com/media/xiMUwBRn5RDLhzwO80/giphy.gif",
    "https://media.giphy.com/media/15aGGXfSlat2dP6ohs/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjVidjJwMnRxM3pmMnU3cDB4M2c1ZTh1eGlodGlyZ3E3cHZtazUwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OIBjJZHpzbcR2/giphy.gif"
];

const BlockedPage = () => {
    const [gifUrl] = useState<string>(() => {
        // Select a random "go away" GIF when the component mounts
        return HELL_NO_GIFS[Math.floor(Math.random() * HELL_NO_GIFS.length)];
    });
    const [imageError, setImageError] = useState(false);

    return (
        <div className="container flex flex-col items-center justify-center h-screen">
            <h1 className="scroll-m-20 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 md:mb-8 block">
                Hell no!
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-1 text-center">
                You&apos;ve told me you don&apos;t want to see this page again.
                So I&apos;m not showing it to you.
            </p>

            <p className="text-base md:text-lg font-bold mb-6 md:mb-8 text-center">
                Sorry, not sorry.
            </p>

            {gifUrl && !imageError ? (
                <img
                    src={gifUrl}
                    alt="Hell no!"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="text-5xl md:text-6xl">🚫</div>
            )}
        </div>
    );
};

export default BlockedPage;
