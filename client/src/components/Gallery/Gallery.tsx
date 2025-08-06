import React from 'react';
import { useGallery } from './useGallery';
import { GalleryStates } from './GalleryStates';
import { GalleryGrid } from './GalleryGrid';
import { SearchBar } from '../SearchBar/SearchBar';
import { GalleryControls } from '../GalleryControls';
import { ImageModal } from '../ImageModal';
import styles from './Gallery.module.scss';

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
                placeholder={`Search NASA images...`}
                debounceMs={500}
                averageConfidence={averageConfidence}
            />

            {hasStateToRender ? (
                <GalleryStates
                    isLoading={isLoading && !currentSearchQuery}
                    isError={!!error}
                    isEmpty={!sortedImages.length && !isLoading && !error}
                    searchQuery={currentSearchQuery}
                />
            ) : (
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
            )}

            {selectedImage && (
                <ImageModal 
                    image={selectedImage} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};
