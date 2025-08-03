'use client';

import React, { useEffect, useState, Suspense } from "react";
import {
  Box,
  Skeleton,
  useMediaQuery,
  Grid
} from "@mui/material";
import BaseLayout from "@/layouts/base-layout";
import dynamic from "next/dynamic";
import BannerCarousel from "@/components/banner/BannerCarousel";
import { getDailyPageData } from '@/utils/content/getDailyPageData';
import EmptyState from "@/components/empty-box";
import FeaturedEvents from "@/components/content/events-components/FeaturedEvents";
import EventCard from "./components/EventCard";
import EventFilterBar from "./components/EventFilterBar";
import SortDropdown from "./components/SortDropdown";
import { getAllEventData } from "@/utils/content/event-datas";
import PaginationFooter from './components/PaginationFooter';

const Submenu = dynamic(() => import("@/components/header/submenu"));

interface EventSchedule {
  startDate: string;
  endDate: string;
  timeSlotType: number;
  generalTextTime: string | null;
  timeSlots: {
    dayOfWeek: number;
    textTime: string;
  }[];
}

interface FeaturedSlot {
  id: number;
  name: string | null;
}

interface Event {
  id: string;
  eventTitle: string;
  categoryId: number;
  categoryName: string;
  eventType: number;
  price: number | null;
  location: string;
  locationId: number;
  venue: string;
  longitude: string;
  latitude: string;
  redirectionLink: string;
  eventSchedule: EventSchedule;
  eventDescription: string;
  coverImage: string;
  isFeatured: boolean;
  featuredSlot: FeaturedSlot;
  publishedDate: string;
  status: number;
  slug: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

interface FeaturedEvent {
  id: string;
  eventTitle: string;
  categoryId: number | null;
  categoryName: string;
  eventType: number;
  price: number | null;
  location: string;
  locationId: number | null;
  venue: string;
  longitude: string;
  latitude: string;
  redirectionLink: string;
  eventSchedule: {
    start: string;
    end: string;
  };
  eventDescription: string;
  coverImage: string;
  isFeatured: boolean;
  featuredSlot: {
    label: string;
    page: string;
  };
  publishedDate: string;
  status: number;
  slug: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}


interface BannerImage {
  id: string | number;
  image_url_mobile: string;
  image_url: string;
  link?: string;
  duration?: number | string;
}

interface EventHeroBanner {
  images: BannerImage[];
}

interface FeaturedEvent {
  id: string;
  title: string;
  image_url: string;
  // other props as needed
}

function EventLandingPage() {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [eventHeroBanner, setEventHeroBanner] = useState<EventHeroBanner | null>(null);
  const [featuredArticles, setFeaturedArticles] = useState<FeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);

  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const locationChangeFunction = (value: string[]): void => {
    setLocation(value);
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { eventHeroBanner, featuredArticles } = await getDailyPageData();
        setEventHeroBanner(eventHeroBanner);
        setFeaturedArticles(featuredArticles);
      } catch (error) {
        console.error("Failed to fetch banner data", error);
      }
    };
    fetchBanner();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await getAllEventData({
          page,
          perPage: pageSize,
          status: 1,
          search: search || undefined,
          categoryId: category ? Number(category) : undefined,
          sortOrder: sortDirection,
          fromDate: date || undefined,
          toDate: date || undefined,
          locationId: location.length ? location.map(Number) : undefined,
          freeOnly,
          featuredFirst: true,
        });

        // setEvents(response?.items || []);
        setEvents(
          (response?.items || []).map((item) => ({
            id: String(item.id),
            eventTitle: item.eventTitle ?? '',
            categoryId: 0, // item.categoryId doesn't exist, using default
            categoryName: item.categoryName ?? '',
            eventType: item.eventType, // item.eventType doesn't exist, using default
            price: item.price ?? null,
            location: item.location ?? '',
            locationId: 0, // item.locationId doesn't exist, using default
            venue: item.venue ?? '',
            longitude: item.longitude ?? '',
            latitude: item.latitude ?? '',
            redirectionLink: item.redirectionLink ?? '',
            eventSchedule: {
              startDate: item.eventSchedule.startDate ?? '',
              endDate: item.endDate ?? '',
              timeSlotType: 0,
              generalTextTime: null,
              timeSlots: [],
            },
            eventDescription: item.eventDescription ?? '',
            coverImage: item.coverImage ?? '',
            isFeatured: item.isFeatured ?? false,
            featuredSlot: { id: 0, name: null }, // item.featuredSlot doesn't exist, using default
            publishedDate: item.publishedDate ?? '', // Using item.date as publishedDate
            status: item.status ?? 0,
            slug: item.slug ?? '',
            isActive: true, // item.isActive doesn't exist, using default
            createdBy: '', // item.createdBy doesn't exist, using default
            createdAt: '', // item.createdAt doesn't exist, using default
            updatedBy: null, // item.updatedBy doesn't exist, using default
            updatedAt: null, // item.updatedAt doesn't exist, using default
            date: item.date ?? '', // Using item.date
          }))
        );

        setTotalPages(Math.ceil(response.totalCount / pageSize));
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, location, category, date, freeOnly, page, pageSize, sortDirection]);

  const mappedFeaturedArticles: FeaturedEvent[] = featuredArticles.map(event => ({
    ...event,
  }));


  return (
    <BaseLayout>
      <Submenu />
      <Box sx={{ maxWidth: "1170px", mx: "auto", width: "100%" }}>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={250} />
        ) : !eventHeroBanner?.images?.length ? (
          <EmptyState title="No banners available" subtitle="Please check again later." />
        ) : (
          <Box sx={{ pt: isMobile ? 2 : 0, px: isMobile ? 2 : 0 }}>
            <BannerCarousel
              banners={eventHeroBanner.images.map((img: BannerImage) => ({
                id: String(img.id),
                image: isMobile ? img.image_url_mobile : img.image_url,
                title: "",
                subtitle: "",
                cta: "",
                href: img.link || "#",
                duration: img.duration !== undefined ? Number(img.duration) : undefined,
              }))}
              loading={false}
            />
          </Box>
        )}

        {!loading && !featuredArticles.length ? (
          <EmptyState title="No featured events" subtitle="Try again later." />
        ) : (
          <FeaturedEvents
            featuredEvents={mappedFeaturedArticles}
            loading={loading}
          />
        )}

        <Box sx={{ mt: 4, px: isMobile ? 2 : 0 }}>
          <EventFilterBar
            searchText={search}
            onSearchChange={setSearch}
            location={location}
            onLocationChange={locationChangeFunction}
            category={category}
            onCategoryChange={setCategory}
            date={date}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onDateChange={setDate}
            showFreeOnly={freeOnly}
            onToggleFree={setFreeOnly}
            onClear={() => {
              setSearch('');
              setLocation([]);
              setCategory('');
              setDate('');
              setStartDate(null);
              setEndDate(null);
              setFreeOnly(false);
            }}
            categories={['Awareness campaigns', 'Forums', 'Workshops']}
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <SortDropdown value={sortDirection} onChange={setSortDirection} />
          </Box>

          {loading ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[...Array(6)].map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={250} />
                </Grid>
              ))}
            </Grid>
          ) : events.length === 0 ? (
            <EmptyState title="No Events Found" subtitle="Try adjusting your filters." />
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {events.map((event) => (
                <Grid item xs={12} sm={12} md={4} key={event.id}>
                  <EventCard
                    image={event.coverImage}
                    category={event.categoryName || '—'}
                    title={event.eventTitle}
                    location={event.location}
                    description={event.eventDescription}
                    startDate={event.eventSchedule?.startDate}
                    endDate={event.eventSchedule?.endDate}
                    slug={event.slug}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          <PaginationFooter
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </Box>
      </Box>
    </BaseLayout>
  );
}

function EventsPage() {
  return (
    <Suspense fallback={<></>}>
      <EventLandingPage />
    </Suspense>
  );
}

export default EventsPage;
