import { Helmet } from "react-helmet-async";

const SITE_NAME = "RentlyGo";
const SITE_URL  = "https://rentlygo.netlify.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

export default function SEO({
  title,
  description,
  keywords = "",
  image = DEFAULT_IMAGE,
  url,
  noindex = false,
  jsonLd = null,
  type = "website",
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Rent Anything Near You`;
  const canonical = url ? `${SITE_URL}${url}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name"   content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
