import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import LocationPin from "./LocationPin";

interface PinGroup {
  x: number;
  y: number;
  bgSvg: React.ReactNode;
  country: string;
}

interface WorldMapProps {
  showShardNumbers?: boolean;
  activeTab?: number;
}

interface AnimParticle {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startTime: number;
  duration: number;
  r: number;
  g: number;
  b: number;
}

// 33개 샤드별 노드 (절대좌표 x, y로 직접 저장)
// Force React.memo to avoid unnecessary re-renders from parent state changes
export const SHARDS: Array<{ num: number; x: number; y: number }[]> = [
  // Shard 0
  [
    { num: 1, x: 1430, y: 265 }, //서울1
    { num: 2, x: 1726, y: 476 }, //도쿄17
    { num: 3, x: 1624, y: 552 }, //도쿄40
    { num: 4, x: 1243, y: 540 }, //싱가포르12
    { num: 5, x: 1484, y: 341 }, //서울33
    { num: 6, x: 1224, y: 580 }, //싱가포르22
    { num: 7, x: 1505, y: 410 }, //서울45
    { num: 8, x: 960, y: 395 }, //독일10
  ],
  // Shard 1
  [
    { num: 1, x: 1448, y: 265 }, //서울 2
    { num: 2, x: 1620, y: 495 }, //도쿄18
    { num: 3, x: 1642, y: 552 }, //도쿄41
    { num: 4, x: 274, y: 474 }, //캘리13
    { num: 5, x: 1502, y: 341 }, //서울34
    { num: 6, x: 1243, y: 580 }, //싱가포르23
    { num: 7, x: 1525, y: 410 }, //서울46, 끝
    { num: 8, x: 414, y: 388 }, //캐나다21
  ],
  // Shard 2
  [
    { num: 1, x: 1466, y: 265 }, //서울 3
    { num: 2, x: 1638, y: 495 }, //도쿄19
    { num: 3, x: 1660, y: 552 }, //도쿄42
    { num: 4, x: 292, y: 474 }, //캘리14
    { num: 5, x: 1430, y: 360 }, //서울35
    { num: 6, x: 1262, y: 580 }, //싱가포르24
    { num: 7, x: 1233, y: 620 }, //싱가포르35
    { num: 8, x: 305, y: 408 }, //캐나다22
  ],
  // Shard 3
  [
    { num: 1, x: 1484, y: 265 }, //서울 4
    { num: 2, x: 1656, y: 495 }, //도쿄20
    { num: 3, x: 1678, y: 552 }, //도쿄43
    { num: 4, x: 184, y: 493 }, //캘리15
    { num: 5, x: 1448, y: 360 }, //서울36
    { num: 6, x: 1280, y: 580 }, //싱가포르25
    { num: 7, x: 1252, y: 620 }, //싱가포르36
    { num: 8, x: 940, y: 395 }, //독일11
  ],
  // Shard 4
  [
    { num: 1, x: 1502, y: 265 }, //서울 5
    { num: 2, x: 1674, y: 495 }, //도쿄21
    { num: 3, x: 1696, y: 552 }, //도쿄44
    { num: 4, x: 202, y: 493 }, //캘리16
    { num: 5, x: 292, y: 531 }, //캘리33
    { num: 6, x: 1298, y: 580 }, //싱가포르26
    { num: 7, x: 1271, y: 620 }, //싱가포르37
    { num: 8, x: 860, y: 415 }, //독일12
  ],
  // Shard 5
  [
    { num: 1, x: 1520, y: 265 }, //서울 6
    { num: 2, x: 1692, y: 495 }, //도쿄22
    { num: 3, x: 1714, y: 552 }, //도쿄45
    { num: 4, x: 1502, y: 303 }, //서울21
    { num: 5, x: 310, y: 531 }, //캘리34
    { num: 6, x: 1316, y: 580 }, //싱가포르27
    { num: 7, x: 1290, y: 620 }, //싱가포르38
    { num: 8, x: 324, y: 408 }, //캐나다23
  ],
  // Shard 6
  [
    { num: 1, x: 1538, y: 265 }, //서울 7
    { num: 2, x: 1710, y: 495 }, //도쿄23
    { num: 3, x: 305, y: 350 }, //캐나다1
    { num: 4, x: 1520, y: 303 }, //서울22
    { num: 5, x: 328, y: 531 }, //캘리35
    { num: 6, x: 1215, y: 600 }, //싱가포르28
    { num: 7, x: 1308, y: 620 }, //싱가포르39
    { num: 8, x: 342, y: 408 }, //캐나다24
  ],
  // Shard 7
  [
    { num: 1, x: 1556, y: 265 }, //서울 8
    { num: 2, x: 1728, y: 495 }, //도쿄24
    { num: 3, x: 324, y: 350 }, //캐나다2
    { num: 4, x: 1538, y: 303 }, //서울23
    { num: 5, x: 233, y: 550 }, //캘리36
    { num: 6, x: 938, y: 353 }, //독일1
    { num: 7, x: 1326, y: 620 }, //싱가포르40
    { num: 8, x: 1550, y: 570 }, //오사카7
  ],
  // Shard 8
  [
    { num: 1, x: 1707, y: 400 }, //도쿄1
    { num: 2, x: 1605, y: 514 }, //도쿄25
    { num: 3, x: 342, y: 350 }, //캐나다3
    { num: 4, x: 1430, y: 322 }, //서울24
    { num: 5, x: 1466, y: 360 }, //서울37
    { num: 6, x: 920, y: 353 }, //독일2
    { num: 7, x: 1250, y: 639 }, //싱가포르41
    { num: 8, x: 1490, y: 590 }, //오사카8
  ],
  // Shard 9
  [
    { num: 1, x: 1725, y: 400 }, //도쿄2
    { num: 2, x: 1624, y: 514 }, //도쿄25
    { num: 3, x: 360, y: 350 }, //캐나다4
    { num: 4, x: 220, y: 493 }, //캘리17
    { num: 5, x: 1484, y: 360 }, //서울38
    { num: 6, x: 900, y: 415 }, //독일3
    { num: 7, x: 1269, y: 639 }, //싱가포르42
    { num: 8, x: 900, y: 395 }, //독일13
  ],
  // Shard 10
  [
    { num: 1, x: 1702, y: 419 }, //도쿄3
    { num: 2, x: 1642, y: 514 }, //도쿄26
    { num: 3, x: 378, y: 350 }, //캐나다5
    { num: 4, x: 238, y: 493 }, //캘리18
    { num: 5, x: 1502, y: 360 }, //서울39
    { num: 6, x: 920, y: 415 }, //독일4
    { num: 7, x: 1288, y: 639 }, //싱가포르43
    { num: 8, x: 900, y: 375 }, //독일14
  ],
  // Shard 11
  [
    { num: 1, x: 1720, y: 419 }, //도쿄4
    { num: 2, x: 1660, y: 514 }, //도쿄27
    { num: 3, x: 396, y: 350 }, //캐나다6
    { num: 4, x: 256, y: 493 }, //캘리19
    { num: 5, x: 1520, y: 360 }, //서울40
    { num: 6, x: 324, y: 369 }, //캐나다9
    { num: 7, x: 1306, y: 639 }, //싱가포르44
    { num: 8, x: 360, y: 408 }, //캐나다25
  ],
  // Shard 12
  [
    { num: 1, x: 1738, y: 419 }, //도쿄5
    { num: 2, x: 1678, y: 514 }, //도쿄28
    { num: 3, x: 414, y: 350 }, //캐나다7
    { num: 4, x: 274, y: 493 }, //캘리20
    { num: 5, x: 252, y: 550 }, //캘리37
    { num: 6, x: 342, y: 369 }, //캐나다10
    { num: 7, x: 1270, y: 658 }, //싱가포르45
    { num: 8, x: 379, y: 408 }, //캐나다26
  ],
  // Shard 13
  [
    { num: 1, x: 1698, y: 438 }, //도쿄6
    { num: 2, x: 1696, y: 514 }, //도쿄29
    { num: 3, x: 305, y: 369 }, //캐나다8
    { num: 4, x: 292, y: 493 }, //캘리21
    { num: 5, x: 270, y: 550 }, //캘리38
    { num: 6, x: 360, y: 369 }, //캐나다11
    { num: 7, x: 1288, y: 658 }, //싱가포르46, 끝
    { num: 8, x: 1515, y: 590 }, //오사카9
  ],
  // Shard 14
  [
    { num: 1, x: 1716, y: 438 }, //도쿄7
    { num: 2, x: 1714, y: 514 }, //도쿄30
    { num: 3, x: 1430, y: 303 }, //서울17
    { num: 4, x: 200, y: 512 }, //캘리22
    { num: 5, x: 288, y: 550 }, //캘리39
    { num: 6, x: 378, y: 369 }, //캐나다12
    { num: 7, x: 1360, y: 415 }, //홍콩5
    { num: 8, x: 1540, y: 590 }, //오사카10, 끝
  ],
  // Shard 15
  [
    { num: 1, x: 1734, y: 438 }, //도쿄8
    { num: 2, x: 1430, y: 284 }, //서울9
    { num: 3, x: 1448, y: 303 }, //서울18
    { num: 4, x: 218, y: 512 }, //캘리23
    { num: 5, x: 306, y: 550 }, //캘리40
    { num: 6, x: 1340, y: 395 }, //홍콩1
    { num: 7, x: 1380, y: 415 }, //홍콩6
    { num: 8, x: 397, y: 408 }, //캐나다27
  ],
  // Shard 16
  [
    { num: 1, x: 1650, y: 457 }, //도쿄9
    { num: 2, x: 1448, y: 284 }, //서울10
    { num: 3, x: 1466, y: 303 }, //서울19
    { num: 4, x: 236, y: 512 }, //캘리24
    { num: 5, x: 324, y: 550 }, //캘리41
    { num: 6, x: 1380, y: 395 }, //홍콩2
    { num: 7, x: 1510, y: 550 }, //오사카1
    { num: 8, x: 416, y: 408 }, //캐나다28
  ],
  // Shard 17
  [
    { num: 1, x: 1688, y: 457 }, //도쿄10
    { num: 2, x: 1466, y: 284 }, //서울11
    { num: 3, x: 1484, y: 303 }, //서울20
    { num: 4, x: 1448, y: 322 }, //서울25
    { num: 5, x: 342, y: 550 }, //캘리42
    { num: 6, x: 1400, y: 395 }, //홍콩3
    { num: 7, x: 1530, y: 550 }, //오사카2
    { num: 8, x: 1340, y: 435 }, //홍콩9
  ],
  // Shard 18
  [
    { num: 1, x: 1706, y: 457 }, //도쿄11
    { num: 2, x: 1484, y: 284 }, //서울12
    { num: 3, x: 202, y: 474 }, //캘리9
    { num: 4, x: 1466, y: 322 }, //서울26
    { num: 5, x: 255, y: 569 }, //캘리43
    { num: 6, x: 1340, y: 415 }, //홍콩4
    { num: 7, x: 920, y: 395 }, //독일5
    { num: 8, x: 1360, y: 435 }, //홍콩10
  ],
  // Shard 19
  [
    { num: 1, x: 1724, y: 457 }, //도쿄12
    { num: 2, x: 1502, y: 284 }, //서울13
    { num: 3, x: 220, y: 474 }, //캘리10
    { num: 4, x: 1484, y: 322 }, //서울27
    { num: 5, x: 273, y: 569 }, //캘리44
    { num: 6, x: 396, y: 369 }, //캐나다13
    { num: 7, x: 986, y: 353 }, //독일6
    { num: 8, x: 940, y: 375 }, //독일15
  ],
  // Shard 20
  [
    { num: 1, x: 1635, y: 476 }, //도쿄12
    { num: 2, x: 1520, y: 284 }, //서울14
    { num: 3, x: 238, y: 474 }, //캘리11
    { num: 4, x: 1502, y: 322 }, //서울28
    { num: 5, x: 291, y: 569 }, //캘리45
    { num: 6, x: 414, y: 369 }, //캐나다14
    { num: 7, x: 342, y: 388 }, //캐나다17
    { num: 8, x: 880, y: 395 }, //독일16
  ],
  // Shard 21
  [
    { num: 1, x: 1653, y: 476 }, //도쿄13
    { num: 2, x: 1538, y: 284 }, //서울15
    { num: 3, x: 256, y: 474 }, //캘리12
    { num: 4, x: 254, y: 512 }, //캘리25
    { num: 5, x: 309, y: 569 }, //캘리46
    { num: 6, x: 305, y: 388 }, //캐나다15
    { num: 7, x: 360, y: 388 }, //캐나다18
    { num: 8, x: 968, y: 353 }, //독일17
  ],
  // Shard 22
  [
    { num: 1, x: 1672, y: 476 }, //도쿄14
    { num: 2, x: 1556, y: 284 }, //서울16
    { num: 3, x: 1205, y: 480 }, //싱가포르1
    { num: 4, x: 272, y: 512 }, //캘리26
    { num: 5, x: 327, y: 569 }, //캘리47
    { num: 6, x: 324, y: 388 }, //캐나다16
    { num: 7, x: 1400, y: 415 }, //홍콩7
    { num: 8, x: 960, y: 375 }, //독일18, 끝
  ],
  // Shard 23
  [
    { num: 1, x: 1690, y: 476 }, //도쿄15
    { num: 2, x: 1732, y: 514 }, //도쿄31
    { num: 3, x: 1224, y: 480 }, //싱가포르2
    { num: 4, x: 290, y: 512 }, //캘리27
    { num: 5, x: 345, y: 569 }, //캘리48, 끝
    { num: 6, x: 1485, y: 386 }, //서울41
    { num: 7, x: 1400, y: 415 }, //홍콩8
    { num: 8, x: 305, y: 428 }, //캐나다29
  ],
  // Shard 24
  [
    { num: 1, x: 184, y: 455 }, //캘리1
    { num: 2, x: 1605, y: 533 }, //도쿄31
    { num: 3, x: 1205, y: 500 }, //싱가포르3
    { num: 4, x: 308, y: 512 }, //캘리28
    { num: 5, x: 1262, y: 540 }, //싱가포르13
    { num: 6, x: 1505, y: 386 }, //서울42
    { num: 7, x: 1550, y: 550 }, //오사카3
    { num: 8, x: 324, y: 428 }, //캐나다30
  ],
  // Shard 25
  [
    { num: 1, x: 202, y: 455 }, //캘리2
    { num: 2, x: 1623, y: 533 }, //도쿄32
    { num: 3, x: 1224, y: 500 }, //싱가포르4
    { num: 4, x: 1520, y: 322 }, //서울29
    { num: 5, x: 1280, y: 540 }, //싱가포르14
    { num: 6, x: 1233, y: 600 }, //싱가포르29
    { num: 7, x: 1490, y: 570 }, //오사카4
    { num: 8, x: 342, y: 428 }, //캐나다31
  ],
  // Shard 26
  [
    { num: 1, x: 220, y: 455 }, //캘리3
    { num: 2, x: 1641, y: 533 }, //도쿄33
    { num: 3, x: 1243, y: 500 }, //싱가포르5
    { num: 4, x: 1430, y: 341 }, //서울30
    { num: 5, x: 1205, y: 560 }, //싱가포르15
    { num: 6, x: 1252, y: 600 }, //싱가포르30
    { num: 7, x: 880, y: 415 }, //독일7
    { num: 8, x: 360, y: 428 }, //캐나다32
  ],
  // Shard 27
  [
    { num: 1, x: 238, y: 455 }, //캘리4
    { num: 2, x: 1659, y: 533 }, //도쿄34
    { num: 3, x: 1205, y: 520 }, //싱가포르6
    { num: 4, x: 1448, y: 341 }, //서울31
    { num: 5, x: 1224, y: 560 }, //싱가포르16
    { num: 6, x: 1525, y: 386 }, //서울43
    { num: 7, x: 920, y: 375 }, //독일8
    { num: 8, x: 379, y: 428 }, //캐나다33
  ],
  // Shard 28
  [
    { num: 1, x: 256, y: 455 }, //캘리5
    { num: 2, x: 1677, y: 533 }, //도쿄35
    { num: 3, x: 1224, y: 520 }, //싱가포르7
    { num: 4, x: 1466, y: 341 }, //서울32
    { num: 5, x: 1243, y: 560 }, //싱가포르17
    { num: 6, x: 1485, y: 410 }, //서울44
    { num: 7, x: 378, y: 388 }, //캐나다19
    { num: 8, x: 398, y: 428 }, //캐나다34
  ],
  // Shard 29
  [
    { num: 1, x: 274, y: 455 }, //캘리6
    { num: 2, x: 1695, y: 533 }, //도쿄36
    { num: 3, x: 1243, y: 520 }, //싱가포르8
    { num: 4, x: 220, y: 531 }, //캘리29
    { num: 5, x: 1262, y: 560 }, //싱가포르18
    { num: 6, x: 1271, y: 600 }, //싱가포르31
    { num: 7, x: 396, y: 388 }, //캐나다20
    { num: 8, x: 416, y: 428 }, //캐나다35
  ],
  // Shard 30
  [
    { num: 1, x: 292, y: 455 }, //캘리7
    { num: 2, x: 1713, y: 533 }, //도쿄37
    { num: 3, x: 1262, y: 520 }, //싱가포르9
    { num: 4, x: 238, y: 531 }, //캘리30
    { num: 5, x: 1280, y: 560 }, //싱가포르19
    { num: 6, x: 1290, y: 600 }, //싱가포르32
    { num: 7, x: 1510, y: 570 }, //오사카5
    { num: 8, x: 435, y: 428 }, //캐나다36, 끝
  ],
  // Shard 31
  [
    { num: 1, x: 184, y: 474 }, //캘리8
    { num: 2, x: 1731, y: 533 }, //도쿄38
    { num: 3, x: 1205, y: 540 }, //싱가포르10
    { num: 4, x: 256, y: 531 }, //캘리31
    { num: 5, x: 1298, y: 560 }, //싱가포르20
    { num: 6, x: 1308, y: 600 }, //싱가포르33
    { num: 7, x: 1530, y: 570 }, //오사카6
    { num: 8, x: 1380, y: 435 }, //홍콩11
  ],
  // Shard 32
  [
    { num: 1, x: 1708, y: 476 }, //도쿄16
    { num: 2, x: 1605, y: 552 }, //도쿄39
    { num: 3, x: 1224, y: 540 }, //싱가포르11
    { num: 4, x: 274, y: 531 }, //캘리32
    { num: 5, x: 1205, y: 580 }, //싱가포르21
    { num: 6, x: 1326, y: 600 }, //싱가포르34
    { num: 7, x: 980, y: 375 }, //독일9
    { num: 8, x: 1350, y: 455 }, //홍콩12, 끝
  ],
];

const pinGroups: PinGroup[] = [
  { x: 348, y: 281, country: "ca", bgSvg: <svg className="absolute" style={{ left: "300px", top: "335px", width: "145px", height: "130px" }} viewBox="0 0 145 130" fill="none"><rect y="12" width="145" height="110" rx="20" fill="black" fillOpacity="0.15" /></svg> },
  { x: 220, y: 390, country: "us", bgSvg: <svg className="absolute" style={{ left: "160px", top: "455px", width: "300px", height: "300px" }} viewBox="0 0 240 280" fill="none"><path d="M119.336 40.7259C119.336 45.9826 121.406 51.0279 125.097 54.7705L175.011 105.377C182.745 113.219 182.684 125.837 174.875 133.604L143.906 164.399C136.085 172.176 123.445 172.154 115.651 164.349L5.84755 54.3844C2.10315 50.6345 3.91174e-05 45.5518 4.97217e-05 40.2526L9.02467e-05 20.001C0.00011235 8.95542 8.95422 0.00119695 19.9998 0.00102718L99.3363 -0.000192241C110.382 -0.000362019 119.337 8.95418 119.337 20.0001L119.336 40.7259Z" fill="black" fillOpacity="0.15" /></svg> },
  { x: 939, y: 289, country: "de", bgSvg: <svg className="absolute" style={{ left: "850px", top: "350px", width: "221px", height: "221px" }} viewBox="0 0 221 221" fill="none"><path d="M85.6089 98.8362C90.8782 98.8103 95.9245 96.706 99.6511 92.9804L158.503 34.1439C171.105 21.5453 162.182 -0.000140356 144.363 -0.000149462L78.5925 -0.00018307C73.2525 -0.000185799 68.1342 2.13532 64.3777 5.93067L5.82607 65.0883C-6.70654 77.7506 2.32337 99.2446 20.1389 99.1572L85.6089 98.8362Z" fill="black" fillOpacity="0.15" /></svg> },
  { x: 1195, y: 405, country: "sg", bgSvg: <svg className="absolute" style={{ left: "1106px", top: "475px", width: "340px", height: "200px" }} viewBox="0 0 143 187" fill="none"><path d="M0.000116313 20.0401C3.88011e-05 2.13797 21.7165 -6.74696 34.2646 6.02129L136.633 110.185C144.328 118.015 144.273 130.583 136.51 138.346L94.4596 180.397C86.5392 188.317 73.6588 188.189 65.8972 180.113L5.58022 117.351C2.00006 113.625 0.000500011 108.659 0.000477641 103.492L0.000116313 20.0401Z" fill="black" fillOpacity="0.15" /></svg> },
  { x: 1347, y: 330, country: "hk", bgSvg: <svg className="absolute" style={{ left: "1330px", top: "390px", width: "195px", height: "195px" }} viewBox="0 0 195 195" fill="none"><path d="M19.9292 0.216875C8.9112 0.255953 6.10965e-05 9.19878 8.89663e-05 20.2168L0.000244652 81.7656C0.000289842 99.6311 21.641 108.533 34.2116 95.8381L95.3739 34.0724C107.902 21.4207 98.8964 -0.0632039 81.0916 -5.4179e-05L19.9292 0.216875Z" fill="black" fillOpacity="0.15" /></svg> },
  { x: 1540, y: 350, country: "kr", bgSvg: <svg className="absolute" style={{ left: "1406px", top: "265px", width: "200px", height: "230px" }} viewBox="0 0 154 231" fill="none"><path d="M142.491 168.273C149.98 160.5 149.95 148.187 142.423 140.45L106.259 103.279C98.6193 95.4269 98.7188 82.8901 106.482 75.1601L147.646 34.1721C160.286 21.5852 151.372 -0.000242803 133.534 -0.000242024L46.2431 -0.000238208L20 -0.000237061C8.95432 -0.000236578 1.95283e-05 8.95407 2.00111e-05 19.9998L2.43805e-05 119.959C2.49935e-05 133.983 16.9233 141.04 26.8868 131.172C36.8502 121.304 53.7734 128.362 53.7735 142.385L53.7736 210.774C53.7737 228.772 75.6894 237.612 88.1768 224.65L142.491 168.273Z" fill="black" fillOpacity="0.15" /></svg> },
  { x: 1515, y: 470, country: "jp", bgSvg: <svg className="absolute" style={{ left: "1430px", top: "520px", width: "179px", height: "100px" }} viewBox="0 0 92 91" fill="none"><path d="M91.072 20.0401C91.072 2.27305 69.6346 -6.67324 57.005 5.82321L5.97312 56.317C-6.72888 68.8851 2.17054 90.5332 20.0394 90.5339L71.0712 90.5357C82.1172 90.5361 91.072 81.5817 91.072 70.5357V20.0401Z" fill="#D9D9D9" /></svg> },
  { x: 1653, y: 400, country: "jp", bgSvg: <svg className="absolute" style={{ left: "1571px", top: "400px", width: "209px", height: "200px" }} viewBox="0 0 126 179" fill="none"><path d="M20 178.466C8.95429 178.466 -5.06711e-07 169.512 -1.13177e-06 158.466L-3.8792e-06 109.915C-4.16914e-06 104.792 1.96644 99.8632 5.49371 96.1469L90.7968 6.27189C103.237 -6.83513 125.303 1.96944 125.303 20.0403L125.303 158.466C125.303 169.512 116.349 178.466 105.303 178.466L20 178.466Z" fill="black" fillOpacity="0.15" /></svg> },
];

// WebGL Shader Sources
const VERTEX_SHADER = `
  attribute vec2 a_from;
  attribute vec2 a_to;
  attribute float a_startTime;
  attribute float a_duration;
  attribute vec3 a_color;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  
  varying vec3 v_color;
  varying float v_alpha;
  
  void main() {
    float elapsed = u_time - a_startTime;
    float t = clamp(elapsed / a_duration, 0.0, 1.0);
    
    vec2 pos = mix(a_from, a_to, t);
    vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
    clipSpace.y = -clipSpace.y;
    
    gl_Position = vec4(clipSpace, 0.0, 1.0);
    gl_PointSize = 5.0;
    
    v_color = a_color;
    v_alpha = 1.0 - smoothstep(0.7, 1.0, t);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec3 v_color;
  varying float v_alpha;
  
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    if (length(coord) > 0.5) discard;
    gl_FragColor = vec4(v_color, v_alpha);
  }
`;

const COLOR_MAP: Record<string, [number, number, number]> = {
  "default": [1, 1, 1],
  "vote_message": [1, 0, 1],
  "shard_message": [0, 0.5, 1],
  "committee_change_message": [1, 0.65, 0],
};

const MAX_PARTICLES = 50000;
const FLOATS_PER_PARTICLE = 10;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

export interface WorldMapHandle {
  addParticle: (shardId: number, fromNodeId: number, toNodeId: number, category?: string) => void;
}

const WorldMap = forwardRef<WorldMapHandle, WorldMapProps>(({ showShardNumbers = false, activeTab = 1 }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<AnimParticle[]>([]);

  useImperativeHandle(ref, () => ({
    addParticle: (shardId, fromNodeId, toNodeId, category) => {
      if (!SHARDS[shardId]) return;
      const fromNode = SHARDS[shardId].find(n => n.num === fromNodeId);
      const toNode = SHARDS[shardId].find(n => n.num === toNodeId);
      if (fromNode && toNode) {
        const color = COLOR_MAP[category || "default"] || COLOR_MAP["default"];
        particlesRef.current.push({
          fromX: fromNode.x, fromY: fromNode.y,
          toX: toNode.x, toY: toNode.y,
          startTime: performance.now(),
          duration: 800,
          r: color[0], g: color[1], b: color[2],
        });
        if (particlesRef.current.length > MAX_PARTICLES) {
          particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES);
        }
      }
    }
  }));

  useEffect(() => {
    if (!containerRef.current || activeTab === 3) return;

    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "9999" });
    canvas.width = 1850;
    canvas.height = 1000;
    containerRef.current.appendChild(canvas);

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const loc = {
      a_from: gl.getAttribLocation(program, "a_from"),
      a_to: gl.getAttribLocation(program, "a_to"),
      a_startTime: gl.getAttribLocation(program, "a_startTime"),
      a_duration: gl.getAttribLocation(program, "a_duration"),
      a_color: gl.getAttribLocation(program, "a_color"),
      u_time: gl.getUniformLocation(program, "u_time")!,
      u_resolution: gl.getUniformLocation(program, "u_resolution")!,
    };

    const buffer = gl.createBuffer()!;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);

    let animId: number;
    const data = new Float32Array(MAX_PARTICLES * FLOATS_PER_PARTICLE);

    const render = () => {
      const now = performance.now();
      particlesRef.current = particlesRef.current.filter(p => now - p.startTime < p.duration);
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const particles = particlesRef.current;
      if (particles.length === 0) { animId = requestAnimationFrame(render); return; }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i], o = i * FLOATS_PER_PARTICLE;
        data[o] = p.fromX; data[o+1] = p.fromY;
        data[o+2] = p.toX; data[o+3] = p.toY;
        data[o+4] = p.startTime; data[o+5] = p.duration;
        data[o+6] = p.r; data[o+7] = p.g; data[o+8] = p.b;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, particles.length * FLOATS_PER_PARTICLE), gl.DYNAMIC_DRAW);
      gl.useProgram(program);
      gl.uniform1f(loc.u_time, now);
      gl.uniform2f(loc.u_resolution, canvas.width, canvas.height);

      const stride = FLOATS_PER_PARTICLE * 4;
      gl.enableVertexAttribArray(loc.a_from);
      gl.vertexAttribPointer(loc.a_from, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(loc.a_to);
      gl.vertexAttribPointer(loc.a_to, 2, gl.FLOAT, false, stride, 8);
      gl.enableVertexAttribArray(loc.a_startTime);
      gl.vertexAttribPointer(loc.a_startTime, 1, gl.FLOAT, false, stride, 16);
      gl.enableVertexAttribArray(loc.a_duration);
      gl.vertexAttribPointer(loc.a_duration, 1, gl.FLOAT, false, stride, 20);
      gl.enableVertexAttribArray(loc.a_color);
      gl.vertexAttribPointer(loc.a_color, 3, gl.FLOAT, false, stride, 24);

      gl.drawArrays(gl.POINTS, 0, particles.length);
      animId = requestAnimationFrame(render);
    };
    render();

    return () => { cancelAnimationFrame(animId); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buffer); canvas.remove(); };
  }, [activeTab]);

  return (
    <div className="relative w-full h-full bg-[#EEEEEE] flex items-center justify-center overflow-hidden">
      <div ref={containerRef} className="relative bg-[#EEEEEE] overflow-visible flex-shrink-0" style={{ width: "1850px", height: "1000px" }}>
        {/* Background SVGs - 기존 대륙 배경 SVG들 (생략, 기존 코드 그대로 유지) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 기존 대륙 SVG 코드 그대로 복사 */}
        </div>
        <div className="absolute inset-0">
          {pinGroups.map((g, i) => <React.Fragment key={i}>{g.bgSvg}</React.Fragment>)}
        </div>
        {pinGroups.map((g, i) => (
          <div key={i} className="absolute" style={{ left: `${g.x}px`, top: `${g.y}px`, zIndex: 10 }}>
            <LocationPin country={g.country} />
          </div>
        ))}
        {showShardNumbers && SHARDS.map((nodes, sid) => nodes.map((n, idx) => (
          <div key={`s-${sid}-${idx}`} className="absolute flex items-center justify-center"
            style={{ left: `${n.x}px`, top: `${n.y}px`, width: "17px", height: "17px", borderRadius: "50%", backgroundColor: "#000", zIndex: 15 }}>
            <span style={{ color: "#FFF", fontSize: "10px", fontWeight: 800 }}>{sid}</span>
          </div>
        )))}
      </div>
    </div>
  );
});

export default React.memo(WorldMap);