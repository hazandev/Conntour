import { useState, useEffect } from 'react';
import { get } from '../../utils/fetchClient';
import type { ImageItem } from '../../types/ImageItem';
import { toast } from 'react-toastify';
import { useSortImages } from './useSortImages';

export const useGallery = () => {
    const [initialImages, setInitialImages] = useState<ImageItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<ImageItem[]>([]);
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    useEffect(() => {
        const fetchInitialImages = async () => {
            try {
                setIsLoading(true);
                const fetchedImages = await get<ImageItem[]>('/sources');
                setInitialImages(fetchedImages);
            } catch (err: any) {
                const errorMessage = err.message || 'Failed to load initial images.';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialImages();
    }, []);

    const imagesToDisplay = currentSearchQuery ? searchResults : initialImages;
    const { sortOption, setSortOption, sortedImages, averageConfidence } = useSortImages(imagesToDisplay);

    const handleResults = (results: ImageItem[]) => {
        setSearchResults(results);
    };

    const handleSearchQuery = (query: string) => {
        setCurrentSearchQuery(query);
    };
    
    const handleSearchingState = (searching: boolean) => {
        setIsSearching(searching);
    }

    const handleImageClick = (image: ImageItem) => {
        setSelectedImage(image);
    }
    
    const handleCloseModal = () => {
        setSelectedImage(null);
    }

    const hasStateToRender = (isLoading || !!error || !sortedImages.length) && !isSearching;
    const showControls = currentSearchQuery && !hasStateToRender;

    return {
        isLoading,
        error,
        isSearching,
        sortedImages,
        currentSearchQuery,
        sortOption,
        setSortOption,
        averageConfidence,
        selectedImage,
        hasStateToRender,
        showControls,
        handleResults,
        handleSearchQuery,
        handleSearchingState,
        handleImageClick,
        handleCloseModal
    };
};
