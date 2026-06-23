import { NextResponse } from "next/server";

const getProductUrl = (uuid: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_ISHOP_BASE_URL;

    if (!baseUrl) {
        return null;
    }

    return `${baseUrl.replace(/\/$/, "")}/products/${uuid}`;
};

export async function PUT(
    request: Request,
    context: { params: Promise<{ uuid: string }> },
) {
    const { uuid } = await context.params;
    const productUrl = getProductUrl(uuid);
    const accessToken = process.env.ACCESS_TOKEN ?? process.env.ACCESS_TOEKN;

    if (!productUrl || !accessToken) {
        return NextResponse.json(
            { message: "Missing product API configuration." },
            { status: 500 },
        );
    }

    const product = await request.json();

    const response = await fetch(productUrl, {
        method: "PUT",
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

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ uuid: string }> },
) {
    const { uuid } = await context.params;
    const productUrl = getProductUrl(uuid);
    const accessToken = process.env.ACCESS_TOKEN ?? process.env.ACCESS_TOEKN;

    if (!productUrl || !accessToken) {
        return NextResponse.json(
            { message: "Missing product API configuration." },
            { status: 500 },
        );
    }

    const response = await fetch(productUrl, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
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
