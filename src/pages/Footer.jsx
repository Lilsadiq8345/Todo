import React from "react";

const Footer = () => {
    return (
        <footer className="bg-indigo-900 text-cyan-300 py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Carbonetrix. Promoting carbon intelligence.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
