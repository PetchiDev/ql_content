"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Skeleton, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import BaseLayout from "@/layouts/base-layout";
import NewsHighlights from "./components/NewsHighlights";
import NewsCardSection from "./components/NewsCardSection";
import InTheKnow from "./components/InTheKnow";
import FeaturedEvents from "./components/FeaturedEvents";
import MoreEvents from "./components/MoreEvents";
import DailyTopic from "./components/DailyTopic";
import TakeOverBannerCarousel from "@/components/banner/TakeOverBannerCarousel";
import BannerCarousel from "@/components/banner/BannerCarousel";
import EmptyState from "@/components/empty-box";
import { getAllDailyLiving, getAllBanner } from "@/utils/content/content";
import { extractBanner } from "@/hooks/use-banner";
const Submenu = dynamic(() => import("@/components/header/submenu"));

export default function DailyLandingPage() {
  const [dailyData, setDailyData] = useState<{ qln_contents_daily: any } | null>(null);
  const [loadingDailyLiving, SetloadingDailyLiving] = useState(true);
  const [bannerData, setBannerData] = useState<any[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    let canceled = false;

    const fetchDailyLiving = async () => {
      try {
        const data = await getAllDailyLiving();
        if (!canceled) setDailyData(data || []);
      } catch (error) {
        if (!canceled) console.error("Failed to fetch dailyData:", error);
      } finally {
        if (!canceled) SetloadingDailyLiving(false);
      }
    };

    fetchDailyLiving();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;

    const fetchBanner = async () => {
      try {
        const verticalId = 5;
        const data = await getAllBanner(verticalId);
        if (!canceled) setBannerData(data || []);
      } catch (error) {
        if (!canceled) console.error("Failed to fetch banner data:", error);
      } finally {
        if (!canceled) setBannerLoading(false);
      }
    };

    fetchBanner();
    return () => {
      canceled = true;
    };
  }, []);


  const dailyHeroBanner = useMemo(
    () => extractBanner(bannerData, "Daily Living (Home)", "Hero Banner(multi) (1170 x 250)"),
    [bannerData]
  );

  const takeOverBannerOne = useMemo(
    () => extractBanner(bannerData, "Daily Living (Home)", "Take Over Banner 1 (1170 x 250)"),
    [bannerData]
  );

  const takeOverBannerTwo = useMemo(
    () => extractBanner(bannerData, "Daily Living (Home)", "Take Over Banner 2 (1170 x 250)"),
    [bannerData]
  );

  return (
    <BaseLayout>
      <Suspense fallback={<></>}>
        <Submenu />
        <Box sx={{ maxWidth: "1170px", mx: "auto", width: "100%" }}>
          {/*Hero Banner */}
          {bannerLoading ? (
            <Skeleton variant="rectangular" width="100%" height={isMobile ? 200 : 250} animation="wave" sx={{ borderRadius: 2, mb: 4 }} />
          ) : !dailyHeroBanner?.images?.length ? (
            <EmptyState title="No banners available" subtitle="Please check again later." />
          ) : (
            <Box sx={{ pt: isMobile ? 2 : 0, px: isMobile ? 2 : 0 }}>
              <BannerCarousel
                banners={dailyHeroBanner.images.map((img: any) => ({
                  id: img.id,
                  image: isMobile ? img.image_url_mobile : img.image_url,
                  title: "",
                  subtitle: "",
                  cta: "",
                  href: img.link || "#",
                  duration: img.duration,
                }))}
                loading={false}
              />
            </Box>
          )}

          {/*News Highlights */}
          {!loadingDailyLiving && Object.keys(dailyData?.qln_contents_daily || {}).length === 0 ? (
            <EmptyState title="No highlights available" subtitle="Check back soon." />
          ) : (
            <NewsHighlights dailyData={dailyData?.qln_contents_daily || {}} loading={loadingDailyLiving} />
          )}

          {/*Top Stories */}
          {!loadingDailyLiving && !dailyData?.qln_contents_daily?.qln_contents_daily_top_stories?.items?.length ? (
            <EmptyState title="No top stories available" subtitle="Please check back later." />
          ) : (
            <NewsCardSection qln_contents_daily={dailyData?.qln_contents_daily} loading={loadingDailyLiving} />
          )}

          <InTheKnow />

          {/*Featured Events */}
          {!loadingDailyLiving && !dailyData?.qln_contents_daily?.qln_contents_daily_featured_events?.items?.length ? (
            <EmptyState title="No featured events" subtitle="Try again later." />
          ) : (
            <FeaturedEvents
              featuredEvents={dailyData?.qln_contents_daily?.qln_contents_daily_featured_events?.items || []}
              loading={loadingDailyLiving}
            />
          )}

          <MoreEvents />

          {/*Take Over Banner 1 */}
          {bannerLoading ? (
            <Skeleton variant="rectangular" width="100%" height={isMobile ? 200 : 300} animation="wave" sx={{ borderRadius: 2, mb: 4 }} />
          ) : !takeOverBannerOne?.images?.length ? (
            <EmptyState title="No takeover banners" subtitle="Please check again soon." />
          ) : (
            <TakeOverBannerCarousel
              banners={takeOverBannerOne.images.map((img: any) => ({
                id: img.id,
                image: isMobile ? img.image_url_mobile : img.image_url,
                title: "",
                subtitle: "",
                cta: "",
                href: img.link || "#",
                duration: img.duration,
              }))}
              loading={bannerLoading}
            />
          )}


          {
            !loadingDailyLiving &&
            (!dailyData?.qln_contents_daily?.qln_contents_daily_topics_1?.items?.length ? (
              <EmptyState title="No content available" subtitle="Please check back later." />
            ) : (
              <DailyTopic
                title={
                  dailyData?.qln_contents_daily?.qln_contents_daily_topics_1?.queue_label || "Everything 1"
                }
                items={dailyData?.qln_contents_daily?.qln_contents_daily_topics_1?.items || []}
                loading={loadingDailyLiving}
              />
            ))
          }
          {/*Take Over Banner 2 */}
          {bannerLoading || !takeOverBannerTwo?.images?.length ? (
            <Skeleton variant="rectangular" width="100%" height={isMobile ? 200 : 300} animation="wave" sx={{ borderRadius: 2, py: 4 }} />
          ) : (
            <TakeOverBannerCarousel
              banners={takeOverBannerTwo.images.map((img: any) => ({
                id: img.id,
                image: isMobile ? img.image_url_mobile : img.image_url,
                title: "",
                subtitle: "",
                cta: "",
                href: img.link || "#",
                duration: img.duration,
              }))}
              loading={bannerLoading}
            />
          )}
          {/*Daily Topics 1 to 5 */}
          {[2, 3, 4, 5].map((num) => {
            const topic = dailyData?.qln_contents_daily?.[`qln_contents_daily_topics_${num}`];
            return !loadingDailyLiving && (!topic?.items?.length ? (
              <EmptyState key={num} title="No content available" subtitle="Please check back later." />
            ) : (
              <DailyTopic
                key={num}
                title={topic?.queue_label || `Everything ${num}`}
                items={topic?.items || []}
                loading={loadingDailyLiving}
              />
            ));
          })}
        </Box>
      </Suspense>
    </BaseLayout>
  );
}
