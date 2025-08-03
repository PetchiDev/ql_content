// utils/community/api.ts

export interface CreatePostPayload {
  title: string;
  category: string;
  categoryId: string;
  description: string;
  imageBase64: string;
  isActive: boolean;
  dateCreated: string;
}

// Helper to extract cookie by name
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : null;
};


// usage
const tokenFromCookie = getCookie("qat");

//Create community post API
export const createCommunityPost = async (payload: CreatePostPayload) => {
  try {
    const token = getCookie("qat");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}community/createPost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add header only if token exists
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create community post");
    }

    return await response.json();
  } catch (error) {
    console.error(" Error creating community post:", error);
    throw error;
  }
};

///Dropdown API - categories for community create page
export const getAllForumCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}community/getAllForumCategories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch categories");

    const result = await response.json();
    return result.forumCategories || [];
  } catch (err) {
    console.error("Error fetching forum categories", err);
    return [];
  }
};
