import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import LocationPin from "./LocationPin";
import { Button } from "@/components/ui/button";

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
    { num: 1, x: 1136, y: 385 }, //서울1
    { num: 2, x: 1194, y: 490 }, //도쿄17
    { num: 3, x: 1523, y: 261 }, //도쿄41
    { num: 4, x: 998, y: 527 }, //싱가포르12
    { num: 5, x: 1136, y: 205 }, //서울33
    { num: 6, x: 998, y: 587 }, //싱가포르22
    { num: 7, x: 1136, y: 235 }, //서울45
    { num: 8, x: 431, y: 267 }, //독일10
  ],
  // Shard 1
  [
    { num: 1, x: 1107, y: 295 }, //서울 2
    { num: 2, x: 1448, y: 412 }, //도쿄18
    { num: 3, x: 1398, y: 413 }, //도쿄42
    { num: 4, x: 17, y: 447 }, //캘리13
    { num: 5, x: 1076, y: 205 }, //서울34
    { num: 6, x: 790, y: 591 }, //싱가포르23
    { num: 7, x: 1136, y: 355 }, //서울46, 끝
    { num: 8, x: 98, y: 285 }, //캐나다21
  ],
  // Shard 2
  [
    { num: 1, x: 1047, y: 235 }, //서울 3
    { num: 2, x: 1225, y: 460 }, //도쿄19
    { num: 3, x: 1398, y: 387 }, //도쿄43
    { num: 4, x: 118, y: 572 }, //캘리14
    { num: 5, x: 1135, y: 444 }, //서울35
    { num: 6, x: 1087, y: 587 }, //싱가포르24
    { num: 7, x: 998, y: 557 }, //싱가포르35
    { num: 8, x: 154, y: 225 }, //캐나다22
  ],
  // Shard 3
  [
    { num: 1, x: 1107, y: 355 }, //서울 4
    { num: 2, x: 1474, y: 412 }, //도쿄20
    { num: 3, x: 1523, y: 236 }, //도쿄44
    { num: 4, x: 17, y: 472 }, //캘리15
    { num: 5, x: 1047, y: 265 }, //서울36
    { num: 6, x: 968, y: 617 }, //싱가포르25
    { num: 7, x: 1028, y: 647 }, //싱가포르36
    { num: 8, x: 520, y: 237 }, //독일11
  ],
  // Shard 4
  [
    { num: 1, x: 1166, y: 175 }, //서울 5
    { num: 2, x: 1498, y: 362 }, //도쿄21
    { num: 3, x: 1474, y: 312 }, //도쿄45
    { num: 4, x: 92, y: 372 }, //캘리16
    { num: 5, x: 143, y: 522 }, //캘리33
    { num: 6, x: 1110, y: 575 }, //싱가포르26
    { num: 7, x: 938, y: 647 }, //싱가포르37
    { num: 8, x: 520, y: 297 }, //독일12
  ],
  // Shard 5
  [
    { num: 1, x: 1047, y: 175 }, //서울 6
    { num: 2, x: 1423, y: 337 }, //도쿄22
    { num: 3, x: 1474, y: 362 }, //도쿄46, 끝
    { num: 4, x: 1076, y: 265 }, //서울21
    { num: 5, x: 92, y: 497 }, //캘리34
    { num: 6, x: 818, y: 587 }, //싱가포르27
    { num: 7, x: 938, y: 707 }, //싱가포르38
    { num: 8, x: 266, y: 315 }, //캐나다23
  ],
  // Shard 6
  [
    { num: 1, x: 1198, y: 384 }, //서울 7
    { num: 2, x: 1498, y: 261 }, //도쿄23
    { num: 3, x: 182, y: 315 }, //캐나다1
    { num: 4, x: 1195, y: 330 }, //서울22
    { num: 5, x: 118, y: 447 }, //캘리35
    { num: 6, x: 1028, y: 587 }, //싱가포르28
    { num: 7, x: 848, y: 647 }, //싱가포르39
    { num: 8, x: 294, y: 255 }, //캐나다24
  ],
  // Shard 7
  [
    { num: 1, x: 1166, y: 205 }, //서울 8
    { num: 2, x: 1523, y: 337 }, //도쿄24
    { num: 3, x: 210, y: 315 }, //캐나다2
    { num: 4, x: 1196, y: 175 }, //서울23
    { num: 5, x: 42, y: 422 }, //캘리36
    { num: 6, x: 551, y: 267 }, //독일1
    { num: 7, x: 1087, y: 557 }, //싱가포르40
    { num: 8, x: 1523, y: 387 }, //오사카7
  ],
  // Shard 8
  [
    { num: 1, x: 1474, y: 261 }, //도쿄1
    { num: 2, x: 1474, y: 211 }, //도쿄25
    { num: 3, x: 210, y: 285 }, //캐나다3
    { num: 4, x: 1107, y: 325 }, //서울24
    { num: 5, x: 1047, y: 205 }, //서울37
    { num: 6, x: 551, y: 237 }, //독일2
    { num: 7, x: 848, y: 587 }, //싱가포르41
    { num: 8, x: 1523, y: 362 }, //오사카8
  ],
  // Shard 9
  [
    { num: 1, x: 1498, y: 236 }, //도쿄2
    { num: 2, x: 1423, y: 412 }, //도쿄25
    { num: 3, x: 294, y: 315 }, //캐나다4
    { num: 4, x: 42, y: 497 }, //캘리17
    { num: 5, x: 1136, y: 325 }, //서울38
    { num: 6, x: 490, y: 267 }, //독일3
    { num: 7, x: 968, y: 587 }, //싱가포르42
    { num: 8, x: 490, y: 297 }, //독일13
  ],
  // Shard 10
  [
    { num: 1, x: 1523, y: 286 }, //도쿄3
    { num: 2, x: 1498, y: 187 }, //도쿄26
    { num: 3, x: 182, y: 255 }, //캐나다5
    { num: 4, x: 93, y: 522 }, //캘리18
    { num: 5, x: 1136, y: 265 }, //서울39
    { num: 6, x: 551, y: 207 }, //독일4
    { num: 7, x: 938, y: 557 }, //싱가포르43
    { num: 8, x: 581, y: 214 }, //독일14
  ],
  // Shard 11
  [
    { num: 1, x: 1448, y: 236 }, //도쿄4
    { num: 2, x: 1498, y: 211 }, //도쿄27
    { num: 3, x: 322, y: 255 }, //캐나다6
    { num: 4, x: 144, y: 397 }, //캘리19
    { num: 5, x: 1136, y: 415 }, //서울40
    { num: 6, x: 294, y: 285 }, //캐나다9
    { num: 7, x: 908, y: 647 }, //싱가포르44
    { num: 8, x: 238, y: 255 }, //캐나다25
  ],
  // Shard 12
  [
    { num: 1, x: 1474, y: 286 }, //도쿄5
    { num: 2, x: 1474, y: 387 }, //도쿄28
    { num: 3, x: 210, y: 255 }, //캐나다7
    { num: 4, x: 92, y: 397 }, //캘리20
    { num: 5, x: 67, y: 472 }, //캘리37
    { num: 6, x: 126, y: 285 }, //캐나다10
    { num: 7, x: 1028, y: 617 }, //싱가포르45
    { num: 8, x: 266, y: 255 }, //캐나다26
  ],
  // Shard 13
  [
    { num: 1, x: 1254, y: 490 }, //도쿄6
    { num: 2, x: 1474, y: 187 }, //도쿄29
    { num: 3, x: 98, y: 255 }, //캐나다8
    { num: 4, x: 67, y: 397 }, //캘리21
    { num: 5, x: 118, y: 372 }, //캘리38
    { num: 6, x: 238, y: 225 }, //캐나다11
    { num: 7, x: 1028, y: 556 }, //싱가포르46, 끝
    { num: 8, x: 1523, y: 412 }, //오사카9
  ],
  // Shard 14
  [
    { num: 1, x: 1315, y: 430 }, //도쿄7
    { num: 2, x: 1474, y: 236 }, //도쿄30
    { num: 3, x: 1136, y: 295 }, //서울17
    { num: 4, x: 93, y: 572 }, //캘리22
    { num: 5, x: 118, y: 472 }, //캘리39
    { num: 6, x: 182, y: 225 }, //캐나다12
    { num: 7, x: 920, y: 386 }, //홍콩5
    { num: 8, x: 1448, y: 337 }, //오사카10, 끝
  ],
  // Shard 15
  [
    { num: 1, x: 1254, y: 430 }, //도쿄8
    { num: 2, x: 1107, y: 235 }, //서울9
    { num: 3, x: 1076, y: 295 }, //서울18
    { num: 4, x: 117, y: 397 }, //캘리23
    { num: 5, x: 144, y: 372 }, //캘리40
    { num: 6, x: 950, y: 386 }, //홍콩1
    { num: 7, x: 1005, y: 330 }, //홍콩6
    { num: 8, x: 322, y: 315 }, //캐나다27
  ],
  // Shard 16
  [
    { num: 1, x: 1523, y: 312 }, //도쿄9
    { num: 2, x: 1196, y: 357 }, //서울10
    { num: 3, x: 1107, y: 205 }, //서울19
    { num: 4, x: 42, y: 372 }, //캘리24
    { num: 5, x: 143, y: 447 }, //캘리41
    { num: 6, x: 980, y: 356 }, //홍콩2
    { num: 7, x: 1498, y: 312 }, //오사카1
    { num: 8, x: 322, y: 225 }, //캐나다28
  ],
  // Shard 17
  [
    { num: 1, x: 1224, y: 490 }, //도쿄10
    { num: 2, x: 1107, y: 415 }, //서울11
    { num: 3, x: 1166, y: 235 }, //서울20
    { num: 4, x: 1196, y: 235 }, //서울25
    { num: 5, x: 143, y: 422 }, //캘리42
    { num: 6, x: 890, y: 356 }, //홍콩3
    { num: 7, x: 1398, y: 362 }, //오사카2
    { num: 8, x: 950, y: 356 }, //홍콩9
  ],
  // Shard 18
  [
    { num: 1, x: 1423, y: 362 }, //도쿄11
    { num: 2, x: 1076, y: 235 }, //서울12
    { num: 3, x: 42, y: 397 }, //캘리9
    { num: 4, x: 1166, y: 354 }, //서울26
    { num: 5, x: 67, y: 497 }, //캘리43
    { num: 6, x: 890, y: 446 }, //홍콩4
    { num: 7, x: 461, y: 237 }, //독일5
    { num: 8, x: 890, y: 416 }, //홍콩10 
  ],
  // Shard 19
  [
    { num: 1, x: 1254, y: 460 }, //도쿄12
    { num: 2, x: 1076, y: 175 }, //서울13
    { num: 3, x: 17, y: 497 }, //캘리10
    { num: 4, x: 1107, y: 265 }, //서울27
    { num: 5, x: 92, y: 447 }, //캘리44
    { num: 6, x: 266, y: 225 }, //캐나다13
    { num: 7, x: 520, y: 267 }, //독일6
    { num: 8, x: 581, y: 242 }, //독일15
  ],
  // Shard 20
  [
    { num: 1, x: 1448, y: 387 }, //도쿄12
    { num: 2, x: 1107, y: 385 }, //서울14
    { num: 3, x: 67, y: 372 }, //캘리11
    { num: 4, x: 1225, y: 175 }, //서울28
    { num: 5, x: 42, y: 522 }, //캘리45
    { num: 6, x: 154, y: 285 }, //캐나다14
    { num: 7, x: 154, y: 315 }, //캐나다17
    { num: 8, x: 490, y: 237 }, //독일16
  ],
  // Shard 21
  [
    { num: 1, x: 1523, y: 187 }, //도쿄13
    { num: 2, x: 1166, y: 294 }, //서울15
    { num: 3, x: 92, y: 472 }, //캘리12
    { num: 4, x: 143, y: 472 }, //캘리25
    { num: 5, x: 118, y: 522 }, //캘리46
    { num: 6, x: 98, y: 315 }, //캐나다15
    { num: 7, x: 126, y: 255 }, //캐나다18
    { num: 8, x: 610, y: 215 }, //독일17
  ],
  // Shard 22
  [
    { num: 1, x: 1523, y: 211 }, //도쿄14
    { num: 2, x: 1166, y: 324 }, //서울16
    { num: 3, x: 968, y: 527 }, //싱가포르1
    { num: 4, x: 143, y: 547 }, //캘리26
    { num: 5, x: 93, y: 547 }, //캘리47
    { num: 6, x: 126, y: 225 }, //캐나다16
    { num: 7, x: 920, y: 416 }, //홍콩7
    { num: 8, x: 581, y: 184 }, //독일18, 끝
  ],
  // Shard 23
  [
    { num: 1, x: 1448, y: 287 }, //도쿄15
    { num: 2, x: 1423, y: 387 }, //도쿄31
    { num: 3, x: 968, y: 707 }, //싱가포르2
    { num: 4, x: 117, y: 422 }, //캘리27
    { num: 5, x: 118, y: 547 }, //캘리48, 끝
    { num: 6, x: 1166, y: 384 }, //서울41
    { num: 7, x: 890, y: 386 }, //홍콩8
    { num: 8, x: 294, y: 225 }, //캐나다29
  ],
  // Shard 24
  [
    { num: 1, x: 67, y: 447 }, //캘리1
    { num: 2, x: 1314, y: 460 }, //도쿄32
    { num: 3, x: 878, y: 617 }, //싱가포르3
    { num: 4, x: 118, y: 497 }, //캘리28
    { num: 5, x: 1059, y: 617 }, //싱가포르13
    { num: 6, x: 1047, y: 295 }, //서울42
    { num: 7, x: 1498, y: 387 }, //오사카3
    { num: 8, x: 238, y: 285 }, //캐나다30
  ],
  // Shard 25
  [
    { num: 1, x: 42, y: 447 }, //캘리2
    { num: 2, x: 1448, y: 211 }, //도쿄33
    { num: 3, x: 826, y: 561 }, //싱가포르4
    { num: 4, x: 1107, y: 445 }, //서울29
    { num: 5, x: 878, y: 590 }, //싱가포르14
    { num: 6, x: 1059, y: 528 }, //싱가포르29
    { num: 7, x: 1284, y: 490 }, //오사카4
    { num: 8, x: 98, y: 225 }, //캐나다31
  ],
  // Shard 26
  [
    { num: 1, x: 67, y: 522 }, //캘리3
    { num: 2, x: 1448, y: 261 }, //도쿄34
    { num: 3, x: 848, y: 617 }, //싱가포르5
    { num: 4, x: 1220, y: 366 }, //서울30
    { num: 5, x: 998, y: 617 }, //싱가포르15
    { num: 6, x: 1059, y: 556 }, //싱가포르30
    { num: 7, x: 490, y: 327 }, //독일7
    { num: 8, x: 126, y: 315 }, //캐나다32
  ],
  // Shard 27
  [
    { num: 1, x: 17, y: 397 }, //캘리4
    { num: 2, x: 1284, y: 460 }, //도쿄35
    { num: 3, x: 878, y: 647 }, //싱가포르6
    { num: 4, x: 1166, y: 413 }, //서울31
    { num: 5, x: 998, y: 647 }, //싱가포르16
    { num: 6, x: 1106, y: 474 }, //서울43
    { num: 7, x: 461, y: 267 }, //독일8
    { num: 8, x: 322, y: 285 }, //캐나다33
  ],
  // Shard 28
  [
    { num: 1, x: 42, y: 472 }, //캘리5
    { num: 2, x: 1498, y: 286 }, //도쿄36
    { num: 3, x: 908, y: 587 }, //싱가포르7
    { num: 4, x: 1196, y: 205 }, //서울32
    { num: 5, x: 908, y: 617 }, //싱가포르17
    { num: 6, x: 1166, y: 265 }, //서울44
    { num: 7, x: 238, y: 315 }, //캐나다19
    { num: 8, x: 210, y: 225 }, //캐나다34
  ],
  // Shard 29
  [
    { num: 1, x: 143, y: 572 }, //캘리6
    { num: 2, x: 1498, y: 337 }, //도쿄37
    { num: 3, x: 938, y: 617 }, //싱가포르8
    { num: 4, x: 67, y: 547 }, //캘리29
    { num: 5, x: 998, y: 677 }, //싱가포르18
    { num: 6, x: 968, y: 677 }, //싱가포르31
    { num: 7, x: 182, y: 285 }, //캐나다20
    { num: 8, x: 154, y: 255 }, //캐나다35
  ],
  // Shard 30
  [
    { num: 1, x: 17, y: 422 }, //캘리7
    { num: 2, x: 1285, y: 430 }, //도쿄38
    { num: 3, x: 968, y: 647 }, //싱가포르9
    { num: 4, x: 67, y: 422 }, //캘리30
    { num: 5, x: 1028, y: 527 }, //싱가포르19
    { num: 6, x: 908, y: 677 }, //싱가포르32
    { num: 7, x: 1448, y: 362 }, //오사카5
    { num: 8, x: 266, y: 285 }, //캐나다36, 끝
  ],
  // Shard 31
  [
    { num: 1, x: 143, y: 497 }, //캘리8
    { num: 2, x: 1448, y: 312 }, //도쿄39
    { num: 3, x: 938, y: 677 }, //싱가포르10
    { num: 4, x: 92, y: 422 }, //캘리31
    { num: 5, x: 968, y: 557 }, //싱가포르20
    { num: 6, x: 818, y: 617 }, //싱가포르33
    { num: 7, x: 1498, y: 412 }, //오사카6
    { num: 8, x: 950, y: 326 }, //홍콩11
  ],
  // Shard 32
  [
    { num: 1, x: 1474, y: 337 }, //도쿄16
    { num: 2, x: 1448, y: 187 }, //도쿄40
    { num: 3, x: 938, y: 587 }, //싱가포르11
    { num: 4, x: 17, y: 372 }, //캘리32
    { num: 5, x: 868, y: 671 }, //싱가포르21
    { num: 6, x: 1059, y: 587}, //싱가포르34
    { num: 7, x: 551, y: 177 }, //독일9
    { num: 8, x: 980, y: 326 }, //홍콩12, 끝
  ],
];

const pinGroups: PinGroup[] = [
  {
    x: 196,
    y: 145,
    country: "ca", //canada
    bgSvg: (
      <svg
        className="absolute"
        style={{
          left: "90.89px",
          top: "203.2px",
          width: "258.24px",
          height: "148.61px",
        }}
        fill="none"
      >
        <rect
          width="258"
          height="149"
          rx="20"
          fill="black"
          fillOpacity="0.15"
        />
      </svg>
    ),
  },
  {
    x: 40,
    y: 298,
    country: "us",
    bgSvg: (
        <svg
          className="absolute"
          style={{
            left: "-64.63px",
            top: "283.88px",
            width: "353px",
            height: "353px",
          }}
          viewBox="0 0 353 353"
          fill="none"
        >
          <path
            d="M80.4946 235.119C76.7288 231.367 74.6122 226.269 74.6122 220.953L74.6126 100.032C74.6127 88.9864 83.5668 80.0323 94.6123 80.0321L214.688 80.0303C225.729 80.0301 234.681 88.9764 234.688 100.017L234.819 296.402C234.827 307.453 225.87 316.415 214.819 316.415L170.336 316.415C165.044 316.415 159.967 314.318 156.218 310.582L80.4946 235.119Z"
            fill="black"
            fillOpacity="0.15"
          />
        </svg>
    ),
  },
  {
    x: 494,
    y: 167,
    country: "de",
    bgSvg: (
        <svg
          className="absolute"
          style={{
            left: "413.62px",
            top: "136.04px",
            width: "230px",
            height: "230px",
          }}
          viewBox="0 0 231 231"
          fill="none"
        >
          <path
            d="M73.025 213.009C80.7506 220.586 93.1014 220.644 100.898 213.14L215.411 102.928C223.493 95.1493 223.599 82.2461 215.645 74.3364L155.369 14.394C147.556 6.62411 134.93 6.63744 127.134 14.4238L14.2991 127.109C6.42605 134.971 6.48383 147.748 14.4277 155.539L73.025 213.009Z"
            fill="black"
            fillOpacity="0.15"
          />
        </svg>
    ),
  },
  {
    x: 891,
    y: 510,
    country: "sg",
    bgSvg: (
        <svg
          className="absolute"
          style={{
            left: "780px",
            top: "418px",
            width: "356px",
            height: "356px",
          }}
          viewBox="0 0 356 356"
          fill="none"
        >
          <path
            d="M340.679 154.787C348.583 162.673 348.5 175.503 340.495 183.285L193.391 326.295C185.511 333.956 172.928 333.824 165.211 326L117.609 277.74C113.983 274.064 108.118 273.858 104.242 277.27C100.387 280.666 94.5559 280.481 90.9229 276.848L14.6368 200.561C6.63598 192.56 6.85995 179.521 15.1308 171.799L46.8803 142.159C54.7782 134.786 67.1042 135.019 74.7184 142.684L95.3575 163.464C96.7019 164.817 98.2329 165.971 99.9042 166.891L104.071 169.184C105.71 170.087 107.468 170.754 109.293 171.168L112.395 171.871C115.458 172.565 118.641 172.529 121.688 171.764L123.825 171.227C125.628 170.774 127.358 170.072 128.967 169.142L132.984 166.819C134.493 165.946 135.881 164.88 137.113 163.648L190.287 110.474C194.038 106.723 199.125 104.616 204.43 104.616L282.126 104.618C287.422 104.618 292.502 106.719 296.251 110.46L340.679 154.787Z"
            fill="black"
            fillOpacity="0.15"
          />
        </svg>
    ),
  },
  {
    x: 901,
    y: 293,
    country: "hk",
    bgSvg: (
        <svg
          className="absolute"
          style={{
            left: "788px",
            top: "230px",
            width: "270px",
            height: "270px",
          }}
          viewBox="0 0 270 270"
          fill="none"
        >
          <path
            d="M109.558 90.2218C98.5254 90.2405 89.5917 99.1893 89.5918 110.222L89.5921 221.291C89.5921 239.09 111.095 248.022 123.706 235.461L235.408 124.203C248.058 111.603 239.114 90.0021 221.26 90.0324L109.558 90.2218Z"
            fill="black"
            fillOpacity="0.15"
          />
        </svg>
    ),
  },
  {
    x: 1112,
    y:131,
    country: "kr",
    bgSvg: (
        <svg
          className="absolute"
          style={{
            left: "1032.24px",
            top: "164.11px",
            width: "249px",
            height: "354px",
          }}
          viewBox="0 0 249 354"
          fill="none"
        >
          <path
            d="M63.9119 307.631C63.9121 325.141 84.8202 334.197 97.5927 322.219L196.484 229.483C204.388 222.071 204.952 209.713 197.756 201.612L152.877 151.09C145.619 142.919 146.264 130.435 154.325 123.055L185.511 94.507C191.909 88.6497 192.77 78.8738 187.494 71.9883C182.032 64.8603 183.171 54.6917 190.074 48.9485L206.39 35.3748C220.776 23.4062 212.313 -2.89178e-05 193.599 -2.80998e-05L19.9997 -2.05116e-05C8.95407 -2.00288e-05 -0.000228697 8.95427 -0.000258732 19.9999L-0.000497425 144.625C-0.000527346 158.266 15.7958 165.831 26.4233 157.28C32.7191 152.215 41.7809 152.548 47.6879 158.062L57.5572 167.274C61.6094 171.056 63.9101 176.351 63.9102 181.894L63.9119 307.631Z"
            fill="black"
            fillOpacity="0.15"
          />
        </svg>
    ),
  },
  {
    x: 1343,
    y: 371,
    country: "jp",
    bgSvg: (
        <svg
          className="absolute"
          style={{
            left: "1152.88px",
            top: "164.9px",
            width: "392px",
            height: "362px",
          }}
          viewBox="0 0 392 362"
          fill="none"
        >
          <path
            d="M371.676 0.00108746C382.721 0.00122847 391.676 8.95547 391.676 20.001L391.676 256.068C391.676 267.113 382.722 276.068 371.676 276.068L237.693 276.067C232.389 276.067 227.301 278.174 223.551 281.925L149.983 355.493C146.232 359.243 141.145 361.351 135.84 361.351L48.2842 361.35C30.4661 361.35 21.5428 339.808 34.1421 327.208L108.529 252.821C112.28 249.071 117.367 246.964 122.671 246.964L191.254 246.964C196.726 246.964 201.959 244.721 205.734 240.759L281.329 161.412C284.872 157.693 286.848 152.753 286.848 147.617L286.849 20.0002C286.849 8.95446 295.803 0.000118892 306.849 0.000259899L371.676 0.00108746Z"
            fill="black"
            fillOpacity="0.15"
          />
        </svg>
    ),
  },
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
    gl_PointSize = 7.0;
    
    v_color = a_color;
    v_alpha = 1.0;
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
  "default": [1, 1, 1],                    // #FFFFFF (흰색)
  "vote_message": [1, 0.5098, 0.8706],    // #FF82DE (마젠타)
  "shard_message": [0, 0, 1],              // #0000FF (파란색) ← 수정됨
  "committee_change_message": [1, 0.65, 0], // #FFA500 (주황색)
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
  addParticle: (fromShardId: number, toShardId: number, fromNodeId: number, toNodeId: number, category?: string) => void;
}

const WorldMap = forwardRef<WorldMapHandle, WorldMapProps>(({ showShardNumbers = false, activeTab = 1 }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<AnimParticle[]>([]);

  const [speed, setSpeed] = React.useState(1.0);
  const speedRef = useRef(1.0);
  const virtualTimeRef = useRef(0.0);
  const lastFrameTimeRef = useRef(performance.now());

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const CIRCLE_RADIUS = 11.5; // 23px / 2

  useImperativeHandle(ref, () => ({
    addParticle: (fromShardId, toShardId, fromNodeId, toNodeId, category) => {
      const fromNode = SHARDS[fromShardId]?.find(n => n.num === fromNodeId);
      const toNode = SHARDS[toShardId]?.find(n => n.num === toNodeId);
      if (fromNode && toNode) {
        const color = COLOR_MAP[category || "default"] || COLOR_MAP["default"];
        const duration = 50;
        particlesRef.current.push({
          fromX: fromNode.x + CIRCLE_RADIUS,  // 중앙 보정
          fromY: fromNode.y + CIRCLE_RADIUS,  // 중앙 보정
          toX: toNode.x + CIRCLE_RADIUS,      // 중앙 보정
          toY: toNode.y + CIRCLE_RADIUS,      // 중앙 보정
          startTime: virtualTimeRef.current,
          duration,
          r: color[0], g: color[1], b: color[2],
        });
        if (particlesRef.current.length > MAX_PARTICLES) {
          particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES);
        }
      }
    }
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Canvas Overlay
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";

    canvas.width = 1566;
    canvas.height = 732;

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
      a_from: gl.getAttribLocation(program, "a_from"),      a_to: gl.getAttribLocation(program, "a_to"),
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

    lastFrameTimeRef.current = performance.now();

    const render = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      virtualTimeRef.current += delta * speedRef.current;
      const vTime = virtualTimeRef.current;

      particlesRef.current = particlesRef.current.filter(p => vTime - p.startTime < p.duration);
      
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
      gl.uniform1f(loc.u_time, vTime);
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
    <div className="relative w-full h-full bg-[#CDE0EB] flex items-center justify-center overflow-hidden">
      {(activeTab === 3 || activeTab === 1) && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "1000px",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#E9E9EA",
            padding: "8px",
            border: "1px solid #000",
          }}
        >
          <span style={{ fontWeight: "600", color: "#000", marginRight: "4px" }}>Speed:</span>
          {[1.0, 0.5, 0.2, 0.1].map((s) => (
             <Button
               key={s}
               size="sm"
               variant={speed === s ? "default" : "outline"}
               onClick={() => setSpeed(s)}
               className="h-7 px-2 text-xs"
             >
               {s}x
             </Button>
          ))}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative bg-[#CDE0EB] overflow-visible flex-shrink-0"
        style={{ width: "1566px", height: "732px" }}
      >
        {/* Background continent shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute opacity-100" //asia
            style={{
              left: "380px",
              top: "-10px",
              width: "1319px",
              height: "736px",
            }}
            fill="none"
          >
            <path
              d="M659.396 358.123L674.169 346.069C687.232 335.41 706.813 344.705 706.813 361.565V499.603C706.813 517.074 727.639 526.146 740.433 514.249L858.504 404.448C866.59 396.929 867.052 384.279 859.537 376.19L814.497 327.712C806.828 319.458 807.487 306.501 815.955 299.068L848.413 270.576C854.526 265.21 855.45 256.031 850.529 249.554C845.554 243.006 846.56 233.712 852.821 228.38L1011.54 93.2129C1015.16 90.1318 1019.76 88.4397 1024.51 88.4397H1095.13C1100.12 88.4397 1104.94 90.3086 1108.62 93.6789L1160.79 141.369C1168.06 148.02 1179.1 148.379 1186.79 142.216L1311.77 42.0741C1316.51 38.2784 1319.26 32.5366 1319.26 26.4662V20C1319.26 8.95432 1310.31 0 1299.26 0H523.619C518.315 0 513.228 2.10715 509.477 5.85788L460.609 54.726C456.858 58.4768 451.771 60.5839 446.467 60.5839H260.387C255.088 60.5839 250.006 62.6867 246.256 66.4304L37.4423 274.909C29.5439 282.794 29.6281 295.619 37.6294 303.4L106.137 370.024C113.884 377.558 126.214 377.576 133.983 370.064L200.905 305.356C204.634 301.75 209.619 299.734 214.807 299.734H241.652C252.698 299.734 261.652 308.689 261.652 319.734V322.228C261.652 333.273 252.698 342.228 241.652 342.228H221.769C210.723 342.228 201.769 351.182 201.769 362.228V364.721C201.769 375.767 192.814 384.721 181.769 384.721H150.308C144.922 384.721 139.763 386.894 136 390.747L100.852 426.736C97.0887 430.59 91.93 432.762 86.5437 432.762H38.2736C32.9692 432.762 27.8822 434.869 24.1314 438.62L5.85786 456.894C2.10714 460.644 0 465.731 0 471.036V513.094C0 517.947 1.76392 522.633 4.96312 526.281L40.2382 566.505C44.0356 570.836 49.5156 573.318 55.275 573.318H111.565C122.61 573.318 131.565 582.273 131.565 593.318L131.565 632.119C131.565 636.244 132.84 640.269 135.217 643.64L169.506 692.296C171.343 694.903 172.329 698.015 172.329 701.204C172.329 714.751 188.511 721.75 198.383 712.473L264.442 650.391C271.72 643.552 272.836 632.392 267.059 624.246L251.461 602.257C245.354 593.646 246.99 581.772 255.198 575.135L305.953 534.089C310.648 530.292 313.377 524.576 313.377 518.538V508.062C313.377 497.016 304.422 488.062 293.377 488.062H292.926C287.159 488.062 281.673 485.573 277.875 481.233L258.921 459.573C251.78 451.413 252.442 439.049 260.414 431.698L269.732 423.107C277.621 415.833 289.844 416.081 297.431 423.669L338.234 464.472C345.835 472.072 358.083 472.306 365.968 465.002L387.235 445.301C395.593 437.559 395.805 424.409 387.701 416.402L371.665 400.558C366.405 395.36 366.803 386.751 372.521 382.062C377.373 378.082 384.427 378.332 388.985 382.645L501.203 488.83C509.07 496.274 521.434 496.103 529.092 488.444L659.396 358.123Z"
              fill="white"
            />
          </svg>
          <svg
            className="absolute opacity-100"
            style={{
              left: "313.51px",
              top: "-66.38px",
              width: "279.56px",
              height: "272.28px",
            }}
            viewBox="0 0 280 273"
            fill="none"
          >
            <path
              d="M273.707 112.648L148.225 238.133C135.626 250.732 114.083 241.809 114.083 223.991L114.083 142.459C114.083 131.413 105.128 122.459 94.0826 122.459H20C8.9543 122.459 0 113.504 0 102.459V20C0 8.9543 8.95434 0 20 0H259.565C270.611 0 279.565 8.95429 279.565 20L279.565 98.5056C279.565 103.81 277.458 108.897 273.707 112.648Z"
              fill="white"
            />
          </svg>
          <svg
            className="absolute opacity-100" //US
            style={{  
              left: "-170px",
              top: "133px",
              width: "617px",
              height: "559px",
            }}
            fill="none"
          >
            <path
              d="M69.949 33.0493L15.1766 82.2084C6.84294 89.688 6.27353 102.552 13.9137 110.738L29.7773 127.737C37.2634 135.758 49.8146 136.251 57.9063 128.84L85.9176 103.188C89.6054 99.8111 94.4245 97.9379 99.425 97.9379H145.927C156.973 97.9379 165.927 106.892 165.927 117.938V122.221C165.927 133.267 174.881 142.221 185.927 142.221H203.46C222.096 142.221 230.604 165.465 216.371 177.496L173.016 214.142C168.52 217.942 165.927 223.529 165.927 229.416V373.803C165.927 379.153 168.07 384.28 171.878 388.038L331.53 545.598C339.328 553.294 351.867 553.283 359.652 545.573L384.003 521.456C391.835 513.699 391.914 501.067 384.179 493.212L351.353 459.881C347.668 456.139 345.603 451.099 345.603 445.847V379.287C345.603 368.242 354.557 359.287 365.603 359.287H398.173H439.158C449.333 359.287 457.582 351.039 457.582 340.864C457.582 330.689 465.83 322.44 476.005 322.44H501.102C506.196 322.44 511.097 320.497 514.807 317.006L602.766 234.243C610.881 226.607 611.192 213.813 603.457 205.793L555.049 155.602C547.774 148.059 547.555 136.18 554.547 128.374L582.129 97.5794C589.212 89.6725 588.883 77.6101 581.381 70.1004L517.209 5.86491C513.458 2.10987 508.368 0 503.06 0H380.425C374.892 0 369.606 2.29243 365.824 6.33202L351.53 21.6016C347.749 25.6412 342.463 27.9336 336.929 27.9336H83.3078C78.3765 27.9336 73.619 29.7555 69.949 33.0493Z"
              fill="white"
            />
          </svg>
          
          <svg
            className="absolute opacity-100"  //JP
            style={{
              left: "1132.26px",
              top: "78.97px",
              width: "422.93px",
              height: "452.96px",
            }}
            fill="none"
          >
            <path
              d="M35.7314 418.266L126.242 331.342C129.967 327.765 134.931 325.767 140.095 325.767L202.232 325.767C207.699 325.767 212.928 323.529 216.702 319.574L291.789 240.882C295.339 237.162 297.319 232.217 297.319 227.075V119.704C297.319 109.284 289.319 100.609 278.933 99.7688L273.339 99.3161C256.007 97.9135 248.598 76.589 261.325 64.7419L316.48 13.4021C324.47 5.96453 336.948 6.30769 344.518 14.1731L417.344 89.8482C420.93 93.5744 422.933 98.5449 422.933 103.716V352.549C422.933 363.595 413.979 372.549 402.933 372.549L258.356 372.55C253.027 372.55 247.919 374.676 244.164 378.457L176.07 447.032C172.305 450.824 167.178 452.951 161.834 452.94L49.5405 452.691C31.5483 452.651 22.7544 430.728 35.7314 418.266Z"
              fill="white"
            />
          </svg>

          <svg
            className="absolute opacity-100"  //jp아래
            style={{
              left: "1058.44px",
              top: "652.75px",
              width: "363.39px",
              height: "309.35px",
            }}
            fill="none"
          >
            <path
              d="M90.0047 5.85785L5.85787 90.0047C2.10714 93.7554 0 98.8425 0 104.147V183.038C0 200.856 21.5429 209.779 34.1421 197.18L63.8855 167.437C71.696 159.626 84.3593 159.626 92.1698 167.437L219.94 295.207C227.751 303.018 240.414 303.018 248.225 295.207L357.527 185.905C361.278 182.154 363.385 177.067 363.385 171.763V70.7061C363.385 65.4018 361.278 60.3147 357.527 56.564L306.821 5.85786C303.071 2.10714 297.983 0 292.679 0H104.147C98.8425 0 93.7555 2.10713 90.0047 5.85785Z"
              fill="white"
            />
          </svg>

          <svg
            className="absolute opacity-100" //US 아래
            style={{
              left: "227.06px",
              top: "622.37px",
              width: "364.07px",
              height: "473.1px",
            }}
            fill="none"
          >
            <path
              d="M65.6872 423.897L65.6873 271.032C65.6873 265.728 63.5801 260.641 59.8294 256.89L5.85803 202.919C2.10733 199.168 0.000194091 194.081 0.000171772 188.776L0 147.953L0.000161584 73.9711C0.000173169 68.6667 2.10733 63.5796 5.85806 59.8289L59.8294 5.85783C63.5801 2.10712 68.6672 0 73.9715 0H189.101C194.405 0 199.492 2.10713 203.243 5.85786L350.113 152.728C357.85 160.465 357.933 172.984 350.3 180.823L100.016 437.85C87.4957 450.707 65.6872 441.843 65.6872 423.897Z"
              fill="white"
            />
          </svg>
          <svg
            className="absolute opacity-100"
            style={{
              left: "731.16px",
              top: "351.88px",
              width: "433px",
              height: "433px",
            }}
            viewBox="0 0 433 433"
            fill="none"
          >
            <path
              d="M55.6213 233.325L50.7383 238.209C42.9278 246.019 42.9279 258.682 50.7383 266.493L137.997 353.752C141.467 357.222 147.094 357.222 150.564 353.752C154.034 350.281 159.661 350.281 163.131 353.752L212.032 402.653C219.742 410.363 232.207 410.476 240.056 402.908L418.115 231.218C426.181 223.441 426.285 210.557 418.347 202.65L386.796 171.226C383.048 167.493 377.973 165.397 372.682 165.397L247.012 165.397C241.699 165.397 236.604 167.511 232.852 171.272L176.106 228.157C168.414 235.868 155.968 236.007 148.106 228.47L122.14 203.58C114.301 196.064 113.891 183.667 121.217 175.65L132.626 163.165C140.096 154.991 139.502 142.304 131.303 134.863L118.985 123.684C111.084 116.514 98.9464 116.808 91.4022 124.352L67.337 148.417C63.5863 152.168 61.4792 157.255 61.4792 162.56L61.4792 219.183C61.4792 224.488 59.3721 229.575 55.6213 233.325Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="absolute inset-0">
          {pinGroups.map((g, i) => <React.Fragment key={i}>{g.bgSvg}</React.Fragment>)}
        </div>
        {pinGroups.map((g, i) => (
          <div key={i} className="absolute" style={{ left: `${g.x}px`, top: `${g.y}px`, zIndex: 10 }}>
            <LocationPin country={g.country} />
          </div>
        ))}

        {/* 33개 샤드 번호 표시 (절대좌표) */}
        {showShardNumbers &&
          SHARDS.map((nodes, shardId) => {
            // Tab 3: Only show 7
            if (activeTab === 3 && shardId !== 7) return null;
            
            return nodes.map((node, idx) => (
              <div
                key={`shard-${shardId}-${idx}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: "23px",
                  height: "23px",
                  borderRadius: "50%",
                  backgroundColor: "#000",
                  //zIndex: 10005,
                }}
              >
                <span
                  style={{
                    color: "#FFF",
                    fontSize: "13px",
                    fontWeight: "800",
                    lineHeight: "13px",
                    letterSpacing: "-0.3px",
                    fontFamily:
                      "Outfit, -apple-system, Roboto, Helvetica, sans-serif",

                  }}
                >
                  {shardId}
                </span>
              </div>
            ))
          })}
      </div>
    </div>
  );
});

export default React.memo(WorldMap);