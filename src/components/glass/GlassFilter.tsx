/**
 * The refraction filter, as one definition instead of one per surface.
 *
 * This had been copy-pasted into every glass surface, and the copies had begun
 * to drift — which matters more than tidiness here, because the whole claim
 * these surfaces make is that they are the SAME material. Two surfaces with
 * subtly different dispersion are two materials, and the eye notices even when
 * it cannot say why.
 *
 * Only surfaces that filter a live backdrop use this. GlassIndicator and
 * GlassDragCard bend a counter-positioned copy with a plain `filter` instead,
 * because `backdrop-filter: url(#...)` resolves in Chromium alone
 * (w3c/svgwg#1142) and those two must work everywhere.
 */
'use client';

import { FILTER_UNITS, LENS_BLEED, type DisplacementMap } from '@/lib/liquidGlass';

export function GlassFilter({
  id, map, width, height, dispersion, saturation = 1.2, blur = 1.4,
}: {
  id: string;
  map: DisplacementMap;
  width: number;
  height: number;
  dispersion: number;
  saturation?: number;
  blur?: number;
}) {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      // Not display:none — a filter hosted in a fully hidden subtree gets
      // skipped by the compositor in more than one engine.
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <filter
          id={id}
          filterUnits={FILTER_UNITS}
          primitiveUnits={FILTER_UNITS}
          // Inflated: filter regions clip, and a Gaussian reaches about 3x its
          // deviation, so sized to the box exactly the blur drags transparent
          // black inward and eats the rim.
          x={-LENS_BLEED}
          y={-LENS_BLEED}
          width={width + 2 * LENS_BLEED}
          height={height + 2 * LENS_BLEED}
          colorInterpolationFilters="sRGB">
          {/* Neutral grey beneath the map. SVG filters work on premultiplied
              alpha, so wherever the map does not reach reads as R=0,G=0 and
              throws the backdrop hard sideways. */}
          <feFlood floodColor="rgb(128,128,0)" floodOpacity="1" result="neutral" />
          <feImage
            href={map.url}
            // Both spellings: older WebKit only ever honoured the namespaced
            // one, and an unresolved feImage means no refraction rather than a
            // visible error.
            xlinkHref={map.url}
            x={0} y={0} width={width} height={height}
            preserveAspectRatio="none" result="mapImg"
          />
          <feComposite in="mapImg" in2="neutral" operator="over" result="map" />

          {/* Three taps at slightly different scales. Blue bends most, so it
              takes the largest offset — that ordering is what makes the fringe
              read as dispersion rather than as a bug. */}
          <feDisplacementMap in="SourceGraphic" in2="map" result="dR"
            scale={map.scale * (1 - dispersion * 0.12)}
            xChannelSelector="R" yChannelSelector="G" />
          <feDisplacementMap in="SourceGraphic" in2="map" result="dG"
            scale={map.scale} xChannelSelector="R" yChannelSelector="G" />
          <feDisplacementMap in="SourceGraphic" in2="map" result="dB"
            scale={map.scale * (1 + dispersion * 0.12)}
            xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix in="dR" type="matrix" result="cR"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feColorMatrix in="dG" type="matrix" result="cG"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feColorMatrix in="dB" type="matrix" result="cB"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          {/* Exact for an opaque source, which a backdrop image always is. */}
          <feBlend in="cR" in2="cG" mode="screen" result="rg" />
          <feBlend in="rg" in2="cB" mode="screen" result="refracted" />

          <feColorMatrix in="refracted" type="saturate" values={String(saturation)} result="vibrant" />
          <feGaussianBlur in="vibrant" stdDeviation={blur} result="soft" />

          {/* The Fresnel rim, taken from the map's blue channel. Not a drawn
              gradient: reflectance climbs toward grazing incidence, so it
              brightens at the edge the way glass does. */}
          <feColorMatrix in="map" type="matrix" result="rimAlpha"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 1 0 0" />
          <feFlood floodColor="#ffffff" floodOpacity="1" result="white" />
          <feComposite in="white" in2="rimAlpha" operator="in" result="rim" />
          <feComposite in="rim" in2="soft" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
