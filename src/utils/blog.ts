import { getCollection, render, type CollectionEntry } from "astro:content";

export interface BlogPost {
  slug: string;
  source: "event" | "blog";
  title: string;
  titleAr?: string;
  date: Date;
  description: string;
  descriptionAr?: string;
  author?: string;
  tags?: string[];
  coverImage?: string;
  // Event-specific fields
  eventType?: "meetup" | "hackathon" | "workshop";
  eventLocation?: string;
  eventLocationAr?: string;
  eventSlides?: string[];
  // The raw entry for rendering
  entry: any;
}

export async function getEventBlogPosts(): Promise<BlogPost[]> {
  const events = await getCollection("events");
  const posts: BlogPost[] = [];

  for (const event of events) {
    if (event.data.status !== "completed") continue;
    const { Content } = await render(event);
    // Check if body content is substantial
    if (!event.body || event.body.length <= 100) continue;

    posts.push({
      slug: `event-${event.id}`,
      source: "event",
      title: event.data.title,
      titleAr: event.data.titleAr,
      date: event.data.date,
      description: event.data.description,
      descriptionAr: event.data.descriptionAr,
      author: event.data.speakers?.[0],
      tags: [event.data.type],
      coverImage: event.data.coverPhoto
        ? `/events/${event.id}/${event.data.coverPhoto}`
        : event.data.photos?.[0]
          ? `/events/${event.id}/${event.data.photos[0]}`
          : undefined,
      eventType: event.data.type,
      eventLocation: event.data.location,
      eventLocationAr: event.data.locationAr,
      eventSlides: event.data.slides,
      entry: event,
    });
  }

  return posts;
}

export async function getStandaloneBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection("blog");
  return entries
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({
      slug: entry.id,
      source: "blog" as const,
      title: entry.data.title,
      titleAr: entry.data.titleAr,
      date: entry.data.date,
      description: entry.data.description,
      descriptionAr: entry.data.descriptionAr,
      author: entry.data.author,
      tags: entry.data.tags,
      coverImage: entry.data.coverImage,
      entry,
    }));
}

/** Returns a Set of event IDs that have a blog post (completed + body > 100 chars). */
export async function getEventIdsWithBlog(): Promise<Set<string>> {
  const events = await getCollection("events");
  const ids = new Set<string>();
  for (const event of events) {
    if (event.data.status === "completed" && event.body && event.body.length > 100) {
      ids.add(event.id);
    }
  }
  return ids;
}

/** Returns the blog slug for a given event ID. */
export function eventBlogSlug(eventId: string): string {
  return `event-${eventId}`;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const [eventPosts, standalonePosts] = await Promise.all([
    getEventBlogPosts(),
    getStandaloneBlogPosts(),
  ]);
  return [...eventPosts, ...standalonePosts].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}
