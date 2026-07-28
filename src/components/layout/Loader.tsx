import React from 'react';

interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
    const sizeClass = {
        small: 'spinner-sm',
        medium: '',
        large: 'spinner-lg'
    }[size];

    return (
        <div className="loader-container">
            <div className={`spinner-border text-info ${sizeClass}`} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;