export const PRODUCT_PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export const getProductImageSrc = (src: unknown) => {
    if (typeof src !== "string") {
        return PRODUCT_PLACEHOLDER_IMAGE;
    }

    const trimmedSrc = src.trim();

    if (!trimmedSrc) {
        return PRODUCT_PLACEHOLDER_IMAGE;
    }

    if (trimmedSrc.startsWith("/")) {
        return trimmedSrc;
    }

    try {
        const url = new URL(trimmedSrc);
        return url.protocol === "http:" || url.protocol === "https:"
            ? trimmedSrc
            : PRODUCT_PLACEHOLDER_IMAGE;
    } catch {
        return PRODUCT_PLACEHOLDER_IMAGE;
    }
};
