import { useState, useEffect, useCallback } from 'react';
import { get } from '../../utils/fetchClient';
import type { ImageItem } from '../../types/ImageItem';
import { toast } from 'react-toastify';
import { useSortImages } from './useSortImages';
import { TEXTS } from '../../constants/texts';
import { QUOTES } from '../../constants/quotes';

export const useGallery = () => {
    const [initialImages, setInitialImages] = useState<ImageItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<ImageItem[]>([]);
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
    const [quoteIndex, setQuoteIndex] = useState(0);

    const currentQuote = QUOTES[quoteIndex];

    useEffect(() => {
        const fetchInitialImages = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedImages = await get<ImageItem[]>('/sources');
                setInitialImages(fetchedImages);
                setError(null);
            } catch (err: any) {
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

    const handleResults = useCallback((results: ImageItem[]) => {
        setSearchResults(results);
        setError(null);
    }, []);

    const handleSearchQuery = useCallback((query: string) => {
        setCurrentSearchQuery(query);
    }, []);
    
    const handleSearchingState = useCallback((searching: boolean) => {
        if (searching) {
            setSearchResults([]); // Reset results to show quote loader
            setQuoteIndex((prevIndex) => (prevIndex + 1) % QUOTES.length);
        }
        setIsSearching(searching);
    }, []);

    const handleImageClick = useCallback((image: ImageItem) => {
        setSelectedImage(image);
    }, []);
    
    const handleCloseModal = useCallback(() => {
        setSelectedImage(null);
    }, []);

    const showControls = !!currentSearchQuery && sortedImages.length > 0;

    return {
        isLoading,
        error,
        isSearching,
        sortedImages,
        currentSearchQuery,
        sortOption,
        setSortOption: setSortOption, // Pass setter directly
        averageConfidence,
        selectedImage,
        showControls,
        currentQuote,
        handleResults,
        handleSearchQuery,
        handleSearchingState,
        handleImageClick,
        handleCloseModal
    };
};
