import React from "react";
import LocationPin from "./LocationPin";

interface PinGroup {
  x: number;
  y: number;
  bgSvg: React.ReactNode;
  country: string;
}

interface WorldMapProps {
  showShardNumbers?: boolean;
}

const pinGroups: PinGroup[] = [
  // Canada
  {
    x: 358,
    y: 191,
    country: "ca",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "286px", top: "230px", width: "192px", height: "110px" }}
        viewBox="0 0 192 110"
        fill="none"
      >
        <rect
          y="21"
          width="192"
          height="89"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // US pin 1
  {
    x: 196,
    y: 300,
    country: "us",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "187px", top: "350px", width: "132px", height: "117px" }}
        viewBox="0 0 132 117"
        fill="none"
      >
        <rect
          y="12"
          width="132"
          height="105"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // US pin 2
  {
    x: 488,
    y: 281,
    country: "us",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "400px", top: "335px", width: "132px", height: "117px" }}
        viewBox="0 0 132 117"
        fill="none"
      >
        <rect
          y="12"
          width="132"
          height="105"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // US pin 3
  {
    x: 300,
    y: 495,
    country: "us",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "187px", top: "475px", width: "238px", height: "238px" }}
        viewBox="0 0 238 238"
        fill="none"
      >
        <path
          d="M119.336 40.7259C119.336 45.9826 121.406 51.0279 125.097 54.7705L175.011 105.377C182.745 113.219 182.684 125.837 174.875 133.604L143.906 164.399C136.085 172.176 123.445 172.154 115.651 164.349L5.84755 54.3844C2.10315 50.6345 3.91174e-05 45.5518 4.97217e-05 40.2526L9.02467e-05 20.001C0.00011235 8.95542 8.95422 0.00119695 19.9998 0.00102718L99.3363 -0.000192241C110.382 -0.000362019 119.337 8.95418 119.337 20.0001L119.336 40.7259Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // US pin 4
  {
    x: 376,
    y: 412,
    country: "us",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "375px", top: "447px", width: "128px", height: "112px" }}
        viewBox="0 0 128 112"
        fill="none"
      >
        <rect
          y="12"
          width="128"
          height="100"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Ireland
  {
    x: 688,
    y: 238,
    country: "ie",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "593px", top: "295px", width: "247px", height: "247px" }}
        viewBox="0 0 247 247"
        fill="none"
      >
        <path
          d="M93.581 116.899C98.8548 116.876 103.906 114.771 107.635 111.041L184.535 34.1419C197.164 21.5126 188.165 -0.0786318 170.304 2.36569e-05L96.8521 0.323499C91.5784 0.346725 86.5272 2.45202 82.7981 6.18117L5.89859 83.0806C-6.73076 95.71 2.26841 117.301 20.1288 117.223L93.581 116.899Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // UK
  {
    x: 843,
    y: 234,
    country: "uk",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "730px", top: "298px", width: "250px", height: "250px" }}
        viewBox="0 0 250 250"
        fill="none"
      >
        <path
          d="M94.7977 117.993C100.071 117.97 105.123 115.864 108.852 112.135L186.844 34.1423C199.474 21.513 190.475 -0.0782574 172.614 0.000397118L97.9456 0.329227C92.6718 0.352452 87.6206 2.45775 83.8915 6.1869L5.89876 84.1796C-6.73059 96.809 2.26855 118.4 20.129 118.322L94.7977 117.993Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Sweden
  {
    x: 880,
    y: 50,
    country: "se",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "840px", top: "110px", width: "250px", height: "250px" }}
        viewBox="0 0 250 250"
        fill="none"
      >
        <path
          d="M119.336 40.7259C119.336 45.9826 121.406 51.0279 125.097 54.7705L175.011 105.377C182.745 113.219 182.684 125.837 174.875 133.604L143.906 164.399C136.085 172.176 123.445 172.154 115.651 164.349L5.84755 54.3844C2.10315 50.6345 3.91174e-05 45.5518 4.97217e-05 40.2526L9.02467e-05 20.001C0.00011235 8.95542 8.95422 0.00119695 19.9998 0.00102718L99.3363 -0.000192241C110.382 -0.000362019 119.337 8.95418 119.337 20.0001L119.336 40.7259Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Germany
  {
    x: 939,
    y: 289,
    country: "de",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "850px", top: "350px", width: "221px", height: "221px" }}
        viewBox="0 0 221 221"
        fill="none"
      >
        <path
          d="M85.6089 98.8362C90.8782 98.8103 95.9245 96.706 99.6511 92.9804L158.503 34.1439C171.105 21.5453 162.182 -0.000140356 144.363 -0.000149462L78.5925 -0.00018307C73.2525 -0.000185799 68.1342 2.13532 64.3777 5.93067L5.82607 65.0883C-6.70654 77.7506 2.32337 99.2446 20.1389 99.1572L85.6089 98.8362Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // France
  {
    x: 790,
    y: 480,
    country: "fr",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "730px", top: "525px", width: "124px", height: "113px" }}
        viewBox="0 0 124 113"
        fill="none"
      >
        <rect
          y="16"
          width="124"
          height="97"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // India
  {
    x: 1101,
    y: 290,
    country: "in",
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "1090px",
          top: "330px",
          width: "134px",
          height: "133px",
        }}
        viewBox="0 0 134 133"
        fill="none"
      >
        <rect
          y="19"
          width="134"
          height="114"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Singapore
  {
    x: 1267,
    y: 485,
    country: "sg",
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "1120px",
          top: "485px",
          width: "315px",
          height: "180px",
        }}
        viewBox="0 0 143 187"
        fill="none"
      >
        <path
          d="M0.000116313 20.0401C3.88011e-05 2.13797 21.7165 -6.74696 34.2646 6.02129L136.633 110.185C144.328 118.015 144.273 130.583 136.51 138.346L94.4596 180.397C86.5392 188.317 73.6588 188.189 65.8972 180.113L5.58022 117.351C2.00006 113.625 0.000500011 108.659 0.000477641 103.492L0.000116313 20.0401Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Hong Kong
  {
    x: 1347,
    y: 330,
    country: "hk",
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "1330px",
          top: "390px",
          width: "195px",
          height: "195px",
        }}
        viewBox="0 0 195 195"
        fill="none"
      >
        <path
          d="M19.9292 0.216875C8.9112 0.255953 6.10965e-05 9.19878 8.89663e-05 20.2168L0.000244652 81.7656C0.000289842 99.6311 21.641 108.533 34.2116 95.8381L95.3739 34.0724C107.902 21.4207 98.8964 -0.0632039 81.0916 -5.4179e-05L19.9292 0.216875Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // South Korea
  {
    x: 1540,
    y: 350,
    country: "kr",
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "1406px",
          top: "265px",
          width: "200px",
          height: "230px",
        }}
        viewBox="0 0 154 231"
        fill="none"
      >
        <path
          d="M142.491 168.273C149.98 160.5 149.95 148.187 142.423 140.45L106.259 103.279C98.6193 95.4269 98.7188 82.8901 106.482 75.1601L147.646 34.1721C160.286 21.5852 151.372 -0.000242803 133.534 -0.000242024L46.2431 -0.000238208L20 -0.000237061C8.95432 -0.000236578 1.95283e-05 8.95407 2.00111e-05 19.9998L2.43805e-05 119.959C2.49935e-05 133.983 16.9233 141.04 26.8868 131.172C36.8502 121.304 53.7734 128.362 53.7735 142.385L53.7736 210.774C53.7737 228.772 75.6894 237.612 88.1768 224.65L142.491 168.273Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Japan 1
  {
    x: 1515,
    y: 470,
    country: "jp",
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "1430px",
          top: "520px",
          width: "179px",
          height: "100px",
        }}
        viewBox="0 0 92 91"
        fill="none"
      >
        <path
          d="M91.072 20.0401C91.072 2.27305 69.6346 -6.67324 57.005 5.82321L5.97312 56.317C-6.72888 68.8851 2.17054 90.5332 20.0394 90.5339L71.0712 90.5357C82.1172 90.5361 91.072 81.5817 91.072 70.5357V20.0401Z"
          fill="#D9D9D9"
        />
      </svg>
    ),
  },
  // Japan 2
  {
    x: 1653,
    y: 400,
    country: "jp",
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "1571px",
          top: "410px",
          width: "209px",
          height: "180px",
        }}
        viewBox="0 0 126 179"
        fill="none"
      >
        <path
          d="M20 178.466C8.95429 178.466 -5.06711e-07 169.512 -1.13177e-06 158.466L-3.8792e-06 109.915C-4.16914e-06 104.792 1.96644 99.8632 5.49371 96.1469L90.7968 6.27189C103.237 -6.83513 125.303 1.96944 125.303 20.0403L125.303 158.466C125.303 169.512 116.349 178.466 105.303 178.466L20 178.466Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Brazil
  {
    x: 529,
    y: 660,
    country: "br",
    bgSvg: (
      <svg
        className="absolute"
        style={{ left: "420px", top: "720px", width: "300px", height: "250px" }}
        viewBox="0 0 219 219"
        fill="none"
      >
        <path
          d="M0.258574 103.756C0.281799 98.4819 2.38709 93.4308 6.11624 89.7016L89.9601 5.85781C97.7691 -1.95119 110.429 -1.9529 118.241 5.85399L147.461 35.0589C155.275 42.8688 155.277 55.5351 147.465 63.347L34.1421 176.669C21.5127 189.299 -0.07851 180.299 0.000143786 162.439L0.258574 103.756Z"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  // Australia
  {
    x: 1541,
    y: 710,
    country: "au",
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "1505px",
          top: "760px",
          width: "119px",
          height: "113px",
        }}
        viewBox="0 0 119 113"
        fill="none"
      >
        <rect
          y="19"
          width="119"
          height="93"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
];

export default function WorldMap({ showShardNumbers = false }: WorldMapProps = {}) {
  // Shard numbers to display around France (x:790, y:480)
  const franceShardNumbers = [
    { num: 16, offsetX: -60, offsetY: -30 },
    { num: 16, offsetX: -40, offsetY: -30 },
    { num: 16, offsetX: -20, offsetY: -30 },
    { num: 15, offsetX: -60, offsetY: -10 },
    { num: 7, offsetX: -40, offsetY: -10 },
    { num: 19, offsetX: -20, offsetY: -10 },
    { num: 10, offsetX: -60, offsetY: 10 },
    { num: 10, offsetX: -40, offsetY: 10 },
    { num: 5, offsetX: -20, offsetY: 10 },
    { num: 19, offsetX: 0, offsetY: 10 },
    { num: 10, offsetX: -60, offsetY: 30 },
    { num: 5, offsetX: -40, offsetY: 30 },
    { num: 19, offsetX: -20, offsetY: 30 },
    { num: 17, offsetX: 50, offsetY: -30 },
    { num: 24, offsetX: 70, offsetY: -30 },
    { num: 24, offsetX: 90, offsetY: -30 },
    { num: 7, offsetX: 50, offsetY: -10 },
    { num: 14, offsetX: 70, offsetY: -10 },
    { num: 14, offsetX: 90, offsetY: -10 },
    { num: 15, offsetX: 50, offsetY: 10 },
    { num: 7, offsetX: 70, offsetY: 10 },
    { num: 19, offsetX: 90, offsetY: 10 },
    { num: 19, offsetX: 110, offsetY: 10 },
    { num: 10, offsetX: 50, offsetY: 30 },
    { num: 5, offsetX: 70, offsetY: 30 },
    { num: 19, offsetX: 90, offsetY: 30 },
    { num: 19, offsetX: 110, offsetY: 30 },
  ];

  return (
    <div className="relative w-full h-full bg-[#EEEEEE] flex items-center justify-center overflow-hidden">
      {/* Fixed size container matching Figma: 1850x1000 */}
      <div
        className="relative bg-[#EEEEEE] overflow-visible flex-shrink-0"
        style={{ width: "1850px", height: "1000px" }}
      >
        {/* Background continent shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top left cluster - North America */}
          <svg
            className="absolute opacity-100"
            style={{
              left: "0px",
              top: "207px",
              width: "593px",
              height: "446px",
            }}
            viewBox="0 0 565 439"
            fill="none"
          >
            <path
              d="M54.3375 5.67998L6.07832 52.7326C-6.76705 65.2568 2.09987 87.0526 20.0403 87.0526H88.9864C94.4565 87.0526 99.6879 89.2931 103.462 93.2523L161.344 153.968C164.889 157.687 166.868 162.629 166.868 167.768V302.649C166.868 307.976 168.993 313.083 172.772 316.837L288.936 432.239C296.759 440.01 309.397 439.984 317.187 432.179L391.775 357.456C395.527 353.697 400.619 351.585 405.93 351.585H472.179C483.224 351.585 492.179 342.631 492.179 331.585V265.143C492.179 259.845 494.281 254.764 498.024 251.014L558.169 190.759C561.912 187.01 564.014 181.928 564.014 176.63L564.014 20C564.014 8.9543 555.06 0 544.014 0H68.2995C63.0829 0 58.0727 2.03824 54.3375 5.67998Z"
              fill="white"
            />
          </svg>

          {/* Top center cluster */}
          <svg
            className="absolute opacity-100"
            style={{
              left: "587px",
              top: "44px",
              width: "191px",
              height: "254px",
            }}
            viewBox="0 0 192 226"
            fill="none"
          >
            <path
              d="M185.463 105.516L71.032 219.949C58.4328 232.549 36.8897 223.625 36.8897 205.807L36.8897 132.725C36.8897 122.539 28.6317 114.281 18.4449 114.281C8.25805 114.281 0 106.022 0 95.8357V20C0 8.9543 8.95432 0 20 0H171.32C182.366 0 191.32 8.95429 191.32 20L191.321 91.3738C191.321 96.678 189.213 101.765 185.463 105.516Z"
              fill="white"
            />
          </svg>

          {/* Large top right - Asia */}
          <svg
            className="absolute opacity-100"
            style={{
              left: "577px",
              top: "0px",
              width: "1260px",
              height: "870px",
            }}
            viewBox="0 0 1231 842"
            fill="none"
          >
            <path
              d="M105.688 273.165L6.02384 371.08C-6.74747 383.627 2.13664 405.346 20.0402 405.346H117.276C128.322 405.346 137.276 414.301 137.276 425.346L137.276 607.797C137.276 618.843 146.231 627.797 157.276 627.797H266.931C277.976 627.797 286.931 636.751 286.931 647.797V821.809C286.931 839.627 308.473 848.551 321.073 835.951L487.4 669.624C495.21 661.813 495.21 649.15 487.4 641.34L340.748 494.687C332.938 486.877 332.938 474.214 340.748 466.403L451.421 355.73C455.172 351.98 460.258 349.872 465.563 349.872L475.936 349.872C486.982 349.872 495.936 358.826 495.936 369.872V435.437C495.936 446.483 504.891 455.437 515.936 455.437H582.21C593.256 455.437 602.21 464.391 602.21 475.437V569.731C602.21 574.983 604.276 580.024 607.961 583.765L678.107 654.983C685.968 662.964 698.851 662.933 706.673 654.913L760.087 600.152C767.748 592.298 767.651 579.74 759.872 572.004L735.692 547.963C727.885 540.201 727.82 527.588 735.546 519.745L860.163 393.24C864.02 389.325 870.388 389.499 874.025 393.62C875.554 395.352 876.398 397.583 876.398 399.894V481.111C876.398 498.939 897.962 507.858 910.555 495.237L987.54 418.084C995.378 410.229 995.322 397.494 987.416 389.707L953.472 356.279C945.665 348.591 945.498 336.052 953.098 328.158L984.011 296.048C987.599 292.322 989.603 287.35 989.603 282.177V250.219C989.603 244.862 991.753 239.728 995.57 235.969L1045.59 186.717C1049.33 183.033 1054.37 180.968 1059.62 180.968H1210.69C1221.74 180.968 1230.69 172.013 1230.69 160.968V20.0005C1230.69 8.95486 1221.74 0.000564381 1210.69 0.000527778L1051.42 0L369.046 0.000587979C363.742 0.000592549 358.655 2.10774 354.904 5.85845L241.189 119.574C233.378 127.384 233.378 140.048 241.189 147.858L326.62 233.289C339.219 245.889 330.296 267.431 312.478 267.431H119.704C114.461 267.431 109.428 269.49 105.688 273.165Z"
              fill="white"
            />
          </svg>

          {/* Bottom left cluster - South America */}
          <svg
            className="absolute opacity-100"
            style={{
              left: "292px",
              top: "627px",
              width: "344px",
              height: "379px",
            }}
            viewBox="0 0 328 350"
            fill="none"
          >
            <path
              d="M91.0046 204.435L5.85774 119.289C-1.95276 111.478 -1.95273 98.8147 5.85778 91.0043L91.0046 5.85783C94.7553 2.10712 99.8424 0 105.147 0H193.984C199.289 0 204.376 2.10714 208.126 5.85787L321.72 119.452C329.457 127.189 329.541 139.707 321.907 147.547L131.191 343.4C118.671 356.258 96.8625 347.394 96.8625 329.447L96.8625 218.578C96.8625 213.273 94.7554 208.186 91.0046 204.435Z"
              fill="white"
            />
          </svg>

          {/* Bottom right - Australia */}
          <svg
            className="absolute opacity-100"
            style={{
              left: "1297px",
              top: "697px",
              width: "335px",
              height: "285px",
            }}
            viewBox="0 0 335 277"
            fill="none"
          >
            <path
              d="M82.3892 5.85786L5.85787 82.3892C2.10714 86.1399 0 91.227 0 96.5313V164.661C0 182.479 21.5428 191.403 34.1421 178.803L57.6868 155.259C65.4973 147.448 78.1606 147.448 85.9711 155.259L201.344 270.632C209.155 278.443 221.818 278.443 229.629 270.632L328.659 171.602C332.41 167.851 334.517 162.764 334.517 157.459V65.7472C334.517 60.4429 332.41 55.3558 328.659 51.6051L282.912 5.85786C279.161 2.10714 274.074 0 268.77 0H96.5313C91.227 0 86.14 2.10713 82.3892 5.85786Z"
              fill="white"
            />
          </svg>

          {/* Right middle cluster */}
          <svg
            className="absolute opacity-100"
            style={{
              left: "1400px",
              top: "245px",
              width: "457px",
              height: "417px",
            }}
            viewBox="0 0 429 418"
            fill="none"
          >
            <path
              d="M5.89802 382.946L136.856 251.987C140.607 248.237 145.694 246.129 150.998 246.129H187.093C192.524 246.129 197.721 243.921 201.49 240.012L278.014 160.654C281.609 156.926 283.618 151.949 283.618 146.771V20.0001C283.618 8.95435 292.572 3.5462e-05 303.618 7.92064e-05L408.587 0.000494917C419.633 0.000538661 428.587 8.95483 428.587 20.0005V226.129C428.587 237.175 419.633 246.129 408.587 246.129H365.683C354.638 246.129 345.683 255.084 345.683 266.129V346.332C345.683 357.378 336.729 366.332 325.683 366.332H171.699C166.395 366.332 161.308 368.439 157.557 372.19L118.517 411.23C114.766 414.981 109.679 417.088 104.375 417.088H20.0402C2.22214 417.088 -6.70123 395.545 5.89802 382.946Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Individual marker backgrounds with unique SVG shapes */}
        <div className="absolute inset-0">
          {pinGroups.map((group, index) => (
            <React.Fragment key={index}>{group.bgSvg}</React.Fragment>
          ))}
        </div>

        {/* Location pins */}
        {pinGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="absolute"
            style={{
              left: `${group.x}px`,
              top: `${group.y}px`,
              zIndex: 10,
            }}
          >
            <LocationPin country={group.country} />
          </div>
        ))}

        {/* Numbered shard indicators around France */}
        {showShardNumbers && franceShardNumbers.map((shard, index) => (
          <div
            key={`shard-${index}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${790 + shard.offsetX}px`,
              top: `${480 + shard.offsetY}px`,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "#000",
              zIndex: 15,
            }}
          >
            <span
              style={{
                color: "#FFF",
                fontSize: "13px",
                fontWeight: "800",
                lineHeight: "13px",
                letterSpacing: "-0.39px",
                fontFamily: "Outfit, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              {shard.num}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
