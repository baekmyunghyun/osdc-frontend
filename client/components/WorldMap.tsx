import LocationPin from "./LocationPin";

interface PinLocation {
  country: string;
  lat: number;
  lng: number;
}

// Geographic coordinates (latitude, longitude) for each country's major city
const locations: PinLocation[] = [
  // North America
  { country: "ca", lat: 56.13, lng: -106.35 }, // Canada
  { country: "us", lat: 37.27, lng: -95.71 }, // USA
  { country: "us", lat: 39.82, lng: -98.58 }, // USA (Central)

  // Europe
  { country: "ie", lat: 53.41, lng: -8.24 }, // Ireland
  { country: "uk", lat: 51.51, lng: -0.13 }, // UK
  { country: "se", lat: 59.33, lng: 18.07 }, // Sweden
  { country: "de", lat: 52.52, lng: 13.41 }, // Germany
  { country: "fr", lat: 48.86, lng: 2.35 }, // France

  // Asia
  { country: "in", lat: 28.61, lng: 77.23 }, // India
  { country: "sg", lat: 1.35, lng: 103.82 }, // Singapore
  { country: "hk", lat: 22.3, lng: 114.18 }, // Hong Kong
  { country: "kr", lat: 37.57, lng: 126.98 }, // South Korea
  { country: "jp", lat: 35.68, lng: 139.69 }, // Japan

  // South America
  { country: "br", lat: -15.79, lng: -48.88 }, // Brazil

  // Oceania
  { country: "au", lat: -25.27, lng: 133.78 }, // Australia
];

// Convert latitude/longitude to percentage positions for responsive layout
function getPositionPercent(lat: number, lng: number) {
  // Assuming 0,0 is at center
  // Latitude: -90 to 90 (top to bottom)
  // Longitude: -180 to 180 (left to right)
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

export default function WorldMap() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left cluster */}
        <svg
          className="absolute left-0 top-[20%] w-[30%] max-w-[593px] h-auto opacity-70"
          viewBox="0 0 565 439"
          fill="none"
        >
          <path
            d="M54.3375 5.67998L6.07832 52.7326C-6.76705 65.2568 2.09987 87.0526 20.0403 87.0526H88.9864C94.4565 87.0526 99.6879 89.2931 103.462 93.2523L161.344 153.968C164.889 157.687 166.868 162.629 166.868 167.768V302.649C166.868 307.976 168.993 313.083 172.772 316.837L288.936 432.239C296.759 440.01 309.397 439.984 317.187 432.179L391.775 357.456C395.527 353.697 400.619 351.585 405.93 351.585H472.179C483.224 351.585 492.179 342.631 492.179 331.585V265.143C492.179 259.845 494.281 254.764 498.024 251.014L558.169 190.759C561.912 187.01 564.014 181.928 564.014 176.63L564.014 20C564.014 8.9543 555.06 0 544.014 0H68.2995C63.0829 0 58.0727 2.03824 54.3375 5.67998Z"
            fill="white"
          />
        </svg>

        {/* Top center */}
        <svg
          className="absolute left-[30%] top-[4%] w-[25%] max-w-[192px] h-auto opacity-70"
          viewBox="0 0 192 226"
          fill="none"
        >
          <path
            d="M185.463 105.516L71.032 219.949C58.4328 232.549 36.8897 223.625 36.8897 205.807L36.8897 132.725C36.8897 122.539 28.6317 114.281 18.4449 114.281C8.25805 114.281 0 106.022 0 95.8357V20C0 8.9543 8.95432 0 20 0H171.32C182.366 0 191.32 8.95429 191.32 20L191.321 91.3738C191.321 96.678 189.213 101.765 185.463 105.516Z"
            fill="white"
          />
        </svg>

        {/* Large top right */}
        <svg
          className="absolute right-0 top-0 w-[65%] max-w-[1231px] h-auto opacity-70"
          viewBox="0 0 1231 842"
          fill="none"
        >
          <path
            d="M105.688 273.165L6.02384 371.08C-6.74747 383.627 2.13664 405.346 20.0402 405.346H117.276C128.322 405.346 137.276 414.301 137.276 425.346L137.276 607.797C137.276 618.843 146.231 627.797 157.276 627.797H266.931C277.976 627.797 286.931 636.751 286.931 647.797V821.809C286.931 839.627 308.473 848.551 321.073 835.951L487.4 669.624C495.21 661.813 495.21 649.15 487.4 641.34L340.748 494.687C332.938 486.877 332.938 474.214 340.748 466.403L451.421 355.73C455.172 351.98 460.258 349.872 465.563 349.872L475.936 349.872C486.982 349.872 495.936 358.826 495.936 369.872V435.437C495.936 446.483 504.891 455.437 515.936 455.437H582.21C593.256 455.437 602.21 464.391 602.21 475.437V569.731C602.21 574.983 604.276 580.024 607.961 583.765L678.107 654.983C685.968 662.964 698.851 662.933 706.673 654.913L760.087 600.152C767.748 592.298 767.651 579.74 759.872 572.004L735.692 547.963C727.885 540.201 727.82 527.588 735.546 519.745L860.163 393.24C864.02 389.325 870.388 389.499 874.025 393.62C875.554 395.352 876.398 397.583 876.398 399.894V481.111C876.398 498.939 897.962 507.858 910.555 495.237L987.54 418.084C995.378 410.229 995.322 397.494 987.416 389.707L953.472 356.279C945.665 348.591 945.498 336.052 953.098 328.158L984.011 296.048C987.599 292.322 989.603 287.35 989.603 282.177V250.219C989.603 244.862 991.753 239.728 995.57 235.969L1045.59 186.717C1049.33 183.033 1054.37 180.968 1059.62 180.968H1210.69C1221.74 180.968 1230.69 172.013 1230.69 160.968V20.0005C1230.69 8.95486 1221.74 0.000564381 1210.69 0.000527778L1051.42 0L369.046 0.000587979C363.742 0.000592549 358.655 2.10774 354.904 5.85845L241.189 119.574C233.378 127.384 233.378 140.048 241.189 147.858L326.62 233.289C339.219 245.889 330.296 267.431 312.478 267.431H119.704C114.461 267.431 109.428 269.49 105.688 273.165Z"
            fill="white"
          />
        </svg>

        {/* Bottom left */}
        <svg
          className="absolute left-0 bottom-[15%] w-[18%] max-w-[328px] h-auto opacity-70"
          viewBox="0 0 328 350"
          fill="none"
        >
          <path
            d="M91.0046 204.435L5.85774 119.289C-1.95276 111.478 -1.95273 98.8147 5.85778 91.0043L91.0046 5.85783C94.7553 2.10712 99.8424 0 105.147 0H193.984C199.289 0 204.376 2.10714 208.126 5.85787L321.72 119.452C329.457 127.189 329.541 139.707 321.907 147.547L131.191 343.4C118.671 356.258 96.8625 347.394 96.8625 329.447L96.8625 218.578C96.8625 213.273 94.7554 208.186 91.0046 204.435Z"
            fill="white"
          />
        </svg>

        {/* Bottom right */}
        <svg
          className="absolute right-0 bottom-0 w-[18%] max-w-[335px] h-auto opacity-70"
          viewBox="0 0 335 277"
          fill="none"
        >
          <path
            d="M82.3892 5.85786L5.85787 82.3892C2.10714 86.1399 0 91.227 0 96.5313V164.661C0 182.479 21.5428 191.403 34.1421 178.803L57.6868 155.259C65.4973 147.448 78.1606 147.448 85.9711 155.259L201.344 270.632C209.155 278.443 221.818 278.443 229.629 270.632L328.659 171.602C332.41 167.851 334.517 162.764 334.517 157.459V65.7472C334.517 60.4429 332.41 55.3558 328.659 51.6051L282.912 5.85786C279.161 2.10714 274.074 0 268.77 0H96.5313C91.227 0 86.14 2.10713 82.3892 5.85786Z"
            fill="white"
          />
        </svg>

        {/* Right middle */}
        <svg
          className="absolute right-0 top-[24%] w-[23%] max-w-[429px] h-auto opacity-70"
          viewBox="0 0 429 418"
          fill="none"
        >
          <path
            d="M5.89802 382.946L136.856 251.987C140.607 248.237 145.694 246.129 150.998 246.129H187.093C192.524 246.129 197.721 243.921 201.49 240.012L278.014 160.654C281.609 156.926 283.618 151.949 283.618 146.771V20.0001C283.618 8.95435 292.572 3.5462e-05 303.618 7.92064e-05L408.587 0.000494917C419.633 0.000538661 428.587 8.95483 428.587 20.0005V226.129C428.587 237.175 419.633 246.129 408.587 246.129H365.683C354.638 246.129 345.683 255.084 345.683 266.129V346.332C345.683 357.378 336.729 366.332 325.683 366.332H171.699C166.395 366.332 161.308 368.439 157.557 372.19L118.517 411.23C114.766 414.981 109.679 417.088 104.375 417.088H20.0402C2.22214 417.088 -6.70123 395.545 5.89802 382.946Z"
            fill="white"
          />
        </svg>
      </div>

      {/* World map container with geographically accurate positions */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl aspect-video bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg shadow-lg overflow-hidden">
          {/* Map background grid (optional) */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-6 h-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-r border-gray-400" />
              ))}
            </div>
            <div className="grid grid-rows-4 h-full absolute inset-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-b border-gray-400" />
              ))}
            </div>
          </div>

          {/* Location pins */}
          {locations.map((location, index) => {
            const { x, y } = getPositionPercent(location.lat, location.lng);
            return (
              <div
                key={index}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <LocationPin country={location.country} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative shadow overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100/30 pointer-events-none" />
    </div>
  );
}
