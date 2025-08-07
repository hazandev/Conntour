import { useState, useEffect } from 'react';
import { get } from '../../utils/fetchClient';
import type { ImageItem } from '../../types/ImageItem';
import { toast } from 'react-toastify';
import { useSortImages } from './useSortImages';
import { TEXTS, formatText } from '../../constants/texts';

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
                setError(null);
                console.log('Fetching initial images...');
                const fetchedImages = await get<ImageItem[]>('/sources');
                console.log('Fetched images:', fetchedImages.length);
                setInitialImages(fetchedImages);
                // Clear any previous errors when data loads successfully
                setError(null);
            } catch (err: any) {
                console.error('Error fetching images:', err);
                const errorMessage = err.message || TEXTS.ERRORS.LOADING_ERROR;
                setError(errorMessage);
                toast.error(TEXTS.TOAST.ERROR_PREFIX + errorMessage);
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
        // Clear error when search results are received
        setError(null);
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

    // Only show error state if there's an error AND no images to display
    const hasStateToRender = (isLoading || (!!error && !sortedImages.length) || (!sortedImages.length && !isSearching));
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
