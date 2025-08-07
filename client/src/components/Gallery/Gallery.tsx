import React, { lazy, Suspense } from 'react';
import { useGallery } from './useGallery';
import { GalleryStates } from './GalleryStates';
import { GalleryGrid } from './GalleryGrid';
import { SearchBar } from '../SearchBar/SearchBar';
import { GalleryControls } from '../GalleryControls';
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
        hasStateToRender,
        showControls,
        handleResults,
        handleSearchQuery,
        handleSearchingState,
        handleImageClick,
        handleCloseModal
    } = useGallery();

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

            {hasStateToRender ? (
                <GalleryStates
                    isLoading={isLoading && !currentSearchQuery}
                    isError={!!error && !sortedImages.length}
                    isEmpty={!sortedImages.length && !isLoading && !error && !isSearching}
                    searchQuery={currentSearchQuery}
                />
            ) : (
                <>
                    {isSearching && (
                        <div className={styles.searchingContainer}>
                            <Spinner message={`Searching for "${currentSearchQuery}"...`} />
                        </div>
                    )}
                    
                    {!isSearching && showControls && (
                        <GalleryControls
                            count={sortedImages.length}
                            searchQuery={currentSearchQuery}
                            isLoading={isSearching}
                            currentSort={sortOption}
                            onSortChange={setSortOption}
                        />
                    )}

                    {!isSearching && (
                        <div className={styles.galleryWrapper}>
                            <GalleryGrid images={sortedImages} onImageClick={handleImageClick} />
                        </div>
                    )}
                </>
            )}

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
