import Script from 'next/script'

/** Site GA4 measurement ID. Overridable via env. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-BYJ6D14KLM'

/** Google Ads conversion ID. Overridable via env. */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || 'AW-18308378295'

/** Meta (Facebook) Pixel ID. Overridable via env. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '1583262146501649'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim()
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim()
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID?.trim()

function googleTagIds() {
  return [GA_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(Boolean)
}

/**
 * Prefer GTM when configured (container health / Tag Assistant).
 * Otherwise load a single gtag.js for GA4 + Google Ads.
 */
export function GoogleAnalyticsTag() {
  if (GTM_ID) {
    return (
      <>
        <Script id="gtm-bootstrap" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </>
    )
  }

  const ids = googleTagIds()
  if (ids.length === 0) return null

  const primaryId = ids[0]
  const idsJson = JSON.stringify(ids)

  return (
    <>
      {/* beforeInteractive puts the loader in initial HTML so Tag Assistant / Ads can detect it */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="beforeInteractive"
      />
      <Script id="google-tag" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
(function(){
  var ids = ${idsJson};
  var ua = navigator.userAgent || '';
  var isBot = /Googlebot|Google-InspectionTool|AdsBot-Google|Mediapartners-Google|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot|Applebot|SemrushBot|AhrefsBot|DotBot|PetalBot|bytespider/i.test(ua);
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    if (!id) continue;
    if (id.indexOf('AW-') === 0) {
      if (isBot) continue;
      gtag('config', id);
      continue;
    }
    if (id.indexOf('G-') === 0) {
      gtag('config', id, {
        send_page_view: true,
        anonymize_ip: false,
        page_path: location.pathname + location.search,
        allow_google_signals: !isBot,
        allow_ad_personalization_signals: !isBot
      });
      continue;
    }
    gtag('config', id);
  }
})();`}
      </Script>
    </>
  )
}

/** Meta Pixel bootstrap + PageView. */
export function MetaPixelTag() {
  if (!META_PIXEL_ID) return null

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
    </Script>
  )
}

/** Noscript fallback required by Meta Pixel install instructions. */
export function MetaPixelNoscript() {
  if (!META_PIXEL_ID) return null

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height={1}
        width={1}
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}

/** Extra marketing pixels. GTM already covers Google tags when GTM_ID is set. */
export function AnalyticsTags() {
  return (
    <>
      <MetaPixelTag />

      {CLARITY_ID ? (
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      ) : null}

      {LINKEDIN_PARTNER_ID ? (
        <Script id="linkedin-insight" strategy="lazyOnload">
          {`_linkedin_partner_id="${LINKEDIN_PARTNER_ID}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];
var b=document.createElement("script");b.type="text/javascript";b.async=true;
b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      ) : null}
    </>
  )
}

export function GtmNoscript() {
  if (!GTM_ID) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
