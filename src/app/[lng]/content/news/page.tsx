'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import {
    Box,
    Skeleton,
    useMediaQuery,
    Grid,
} from '@mui/material';
import BaseLayout from '@/layouts/base-layout';
import dynamic from 'next/dynamic';
import TakeOverBannerCarousel from '@/components/banner/TakeOverBannerCarousel';
import BannerCarousel from '@/components/banner/BannerCarousel';
import EmptyState from '@/components/empty-box';
import { getAllNewsLiving, getAllBanner } from '@/utils/content/content';
import { extractBanner } from '@/hooks/use-banner';
import NewsHighlights from './components/FeaturedArticleCard';
import CategoryTabsWithSubTabs from './components/CategoryTabsWithSubTabs';
import NewsCardSection from './components/NewsCardSection';
import DailyTopic from './components/DailyTopic';
import PopularArtical from '@/components/content/news-components/popularArtical';
const Submenu = dynamic(() => import('@/components/header/submenu'));
import SideBannerCarousel from '@/components/banner/SideBanner';

export default function Page() {
    const [newsData, setNewsData] = useState<any>({});
    const [loadingNewsLiving, setLoadingNewsLiving] = useState(true);
    const [bannerData, setBannerData] = useState<any[]>([]);
    const [bannerLoading, setBannerLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const verticalId = 5;
                const data = await getAllBanner(verticalId);
                setBannerData(data || []);
            } catch (error) {
                console.error('Failed to fetch banner data:', error);
            } finally {
                setBannerLoading(false);
            }
        };
        fetchBanner();
    }, []);

    useEffect(() => {
        if (selectedCategoryId == null || selectedSubCategoryId == null) return;

        let canceled = false;

        const fetchNewsData = async () => {
            try {
                setLoadingNewsLiving(true);
                const data = await getAllNewsLiving({
                    categoryId: selectedCategoryId,
                    subCategoryId: selectedSubCategoryId,
                });
                const content = data?.news || {};
                if (!canceled) setNewsData(content);
            } catch (error) {
                if (!canceled) console.error('Failed to fetch news:', error);
            } finally {
                if (!canceled) setLoadingNewsLiving(false);
            }
        };

        fetchNewsData();
        return () => {
            canceled = true;
        };
    }, [selectedCategoryId, selectedSubCategoryId]);

    const newsHeroBanner = useMemo(
        () => extractBanner(bannerData, 'News', 'Hero Banner(multi) (1170 x 250)'),
        [bannerData]
    );

    const takeOverBannerOne = useMemo(
        () => extractBanner(bannerData, 'News', 'Take Over Banner (1170 x 250)'),
        [bannerData]
    );
    const sideBanner = useMemo(
        () => extractBanner(bannerData, 'News', 'Side Banner (300 x 250)'),
        [bannerData]
    );

    return (
        <BaseLayout>
            <Suspense fallback={<></>}>
                <Submenu />
                <Box sx={{ maxWidth: '1170px', mx: 'auto', width: '100%' }}>
                    {/* ✅ Hero Banner */}
                    {bannerLoading ? (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={isMobile ? 200 : 250}
                            sx={{ borderRadius: 2, mb: 4 }}
                        />
                    ) : !newsHeroBanner?.images?.length ? (
                        <EmptyState title="No banners available" subtitle="Please check again later." />
                    ) : (
                        <Box sx={{ pt: isMobile ? 2 : 0 }}>
                            <BannerCarousel
                                banners={newsHeroBanner.images.map((img: any) => ({
                                    id: img.id,
                                    image: isMobile ? img.image_url_mobile : img.image_url,
                                    title: '',
                                    subtitle: '',
                                    cta: '',
                                    href: img.link || '#',
                                    duration: img.duration,
                                }))}
                                loading={false}
                            />
                        </Box>
                    )}

                    {/* ✅ Category Tabs */}
                    <CategoryTabsWithSubTabs
                        onCategoryChange={setSelectedCategoryId}
                        onSubCategoryChange={setSelectedSubCategoryId}
                    />

                    {/* ✅ News Highlights */}
                    <NewsHighlights newsData={newsData} loading={loadingNewsLiving} />

                    {/* ✅ Top Stories */}
                    {!loadingNewsLiving && !newsData?.top_story?.items?.length ? (
                        <Box sx={{ mt: 4 }}>
                            <EmptyState title="No top stories available" subtitle="Please check back later." />
                        </Box>
                    ) : (
                        <NewsCardSection newsData={newsData?.top_story} loading={loadingNewsLiving} />
                    )}
                    {/* ✅ Take Over Banner */}
                    {bannerLoading ? (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={isMobile ? 200 : 300}
                            sx={{ borderRadius: 2, mb: 4 }}
                        />
                    ) : !takeOverBannerOne?.images?.length ? (
                        <EmptyState title="No takeover banners" subtitle="Please check again soon." />
                    ) : (
                        <TakeOverBannerCarousel
                            banners={takeOverBannerOne.images.map((img: any) => ({
                                id: img.id,
                                image: isMobile ? img.image_url_mobile : img.image_url,
                                title: '',
                                subtitle: '',
                                cta: '',
                                href: img.link || '#',
                                duration: img.duration,
                            }))}
                            loading={false}
                        />
                    )}
                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        <Grid item xs={12} md={8}>
                            {!loadingNewsLiving && !newsData?.most_popular_articles?.items?.length ? (
                                <EmptyState title="No Popular Article available" subtitle="Please check back later." />
                            ) : (
                                <PopularArtical
                                    moreArticles={newsData?.most_popular_articles?.items || []}
                                    loading={false}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            {!sideBanner?.images?.length ? (
                                <EmptyState title="No Side banners available" subtitle="Please check again later." />
                            ) : (
                                <SideBannerCarousel
                                    banners={sideBanner.images.map((img: any) => ({
                                        id: img.id,
                                        image: img.image_url,
                                        title: '',
                                        subtitle: '',
                                        cta: '',
                                        href: img.link || '#',
                                        duration: img.duration,
                                    }))}
                                    loading={false}
                                />
                            )}
                        </Grid>
                    </Grid>
                    {/* ✅ Daily Topics */}
                    {[1, 2, 3].map((num) => {
                        const topic = newsData?.[`articles_${num}`];
                        return !loadingNewsLiving && (!topic?.items?.length ? (
                            <EmptyState key={num} title="No content available" subtitle="Please check back later." />
                        ) : (
                            <DailyTopic
                                key={num}
                                title={topic?.queue_label || `Everything ${num}`}
                                items={topic?.items || []}
                                loading={loadingNewsLiving}
                            />
                        ));
                    })}
                </Box>
            </Suspense>
        </BaseLayout>
    );
}
