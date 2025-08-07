import React, { lazy, Suspense } from 'react';
import { useGallery } from './useGallery';
import { GalleryStates } from './GalleryStates';
import { GalleryGrid } from './GalleryGrid';
import { SearchBar } from '../SearchBar/SearchBar';
import { GalleryControls } from '../GalleryControls';
import { QuoteLoader } from '../QuoteLoader';
import { Spinner } from '../Loader';
import styles from './Gallery.module.scss';
import { TEXTS } from '../../constants/texts';

const ImageModal = lazy(() => import('../ImageModal/index'));

export const Gallery: React.FC = () => {
    const {
        isLoading,
        error,
        isSearching,
        sortedImages,
        currentSearchQuery,
        sortOption,
        setSortOption,
        averageConfidence,
        selectedImage,
        showControls,
        currentQuote,
        handleResults,
        handleSearchQuery,
        handleSearchingState,
        handleImageClick,
        handleCloseModal
    } = useGallery();

    const renderMainContent = () => {
        // If loading initial data OR actively searching, show the quote loader.
        // This is the highest priority.
        if (isLoading || isSearching) {
            return <QuoteLoader quote={currentQuote} />;
        }
        
        // If there are images to display, show the gallery.
        // This runs only if not loading and not searching.
        if (sortedImages.length > 0) {
            return (
                 <>
                    {showControls && (
                        <GalleryControls
                            count={sortedImages.length}
                            searchQuery={currentSearchQuery}
                            isLoading={isSearching}
                            currentSort={sortOption}
                            onSortChange={setSortOption}
                        />
                    )}
                    <div className={styles.galleryWrapper}>
                        <GalleryGrid images={sortedImages} onImageClick={handleImageClick} />
                    </div>
                </>
            );
        }

        // If not loading/searching and there are no images, show the appropriate state (error or empty).
        // This is the fallback state.
        return (
            <GalleryStates
                isLoading={false}
                isError={!!error}
                isEmpty={true}
                searchQuery={currentSearchQuery}
            />
        );
    };

    return (
        <div className={styles.galleryContainer}>
            <SearchBar
                onResults={handleResults}
                onSearchQueryChange={handleSearchQuery}
                onSearching={handleSearchingState}
                placeholder={TEXTS.SEARCH.PLACEHOLDER}
                debounceMs={500}
                averageConfidence={averageConfidence}
            />

            {renderMainContent()}

            <Suspense fallback={<Spinner />}>
                {selectedImage && (
                    <ImageModal 
                        image={selectedImage} 
                        onClose={handleCloseModal} 
                    />
                )}
            </Suspense>
        </div>
    );
};
