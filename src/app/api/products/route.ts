import { NextResponse } from "next/server";

const getProductsUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_ISHOP_BASE_URL;

    if (!baseUrl) {
        return null;
    }

    return `${baseUrl.replace(/\/$/, "")}/products`;
};

const getAccessToken = () =>
    process.env.ACCESS_TOKEN;

export async function POST(request: Request) {
    const productsUrl = getProductsUrl();
    const accessToken = getAccessToken();

    if (!productsUrl || !accessToken) {
        return NextResponse.json(
            { message: "Missing product API configuration." },
            { status: 500 },
        );
    }

    const product = await request.json();

    const response = await fetch(productsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(product),
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
