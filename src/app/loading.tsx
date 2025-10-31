"use client";

import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function Loading() {
    return (
        <div className='bg-black flex items-center justify-center min-h-screen'>
            <LoadingSpinner />
        </div>
    );
}


