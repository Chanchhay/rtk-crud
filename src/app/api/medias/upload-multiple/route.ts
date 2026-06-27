import { NextResponse } from "next/server";

const getMediaUploadUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_ISHOP_BASE_URL;

    if (!baseUrl) {
        return null;
    }

    return `${baseUrl.replace(/\/$/, "")}/medias/upload-multiple`;
};

const getAccessToken = () => process.env.ACCESS_TOKEN;

export async function POST(request: Request) {
    const mediaUploadUrl = getMediaUploadUrl();
    const accessToken = getAccessToken();

    if (!mediaUploadUrl || !accessToken) {
        return NextResponse.json(
            { message: "Missing media upload API configuration." },
            { status: 500 },
        );
    }

    const formData = await request.formData();

    const response = await fetch(mediaUploadUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    const text = await response.text();

    if (!text) {
        return new Response(null, { status: response.status });
    }

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
        ? JSON.parse(text)
        : { message: text };

    return NextResponse.json(data, { status: response.status });
}
