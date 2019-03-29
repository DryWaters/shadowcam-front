// https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/demo_util.js
// https://medium.com/tensorflow/move-mirror-an-ai-experiment-with-pose-estimation-in-the-browser-using-tensorflow-js-2f7b769f9b23
import * as posenet from "@tensorflow-models/posenet";
import similarity from "compute-cosine-similarity";

const pointRadius = 3;

const rightPunchPose = [
  0.7511041184552876,
  0.22171357411739392,
  0.7561281345386117,
  0.18736150711565103,
  0.7318283049481886,
  0.19741954924465124,
  0.7408462095236801,
  0.20267836548355625,
  0.6619536630291802,
  0.21006501712903475,
  0.6742728384999104,
  0.2947834135880367,
  0.643560157202066,
  0.28669222171629816,
  0.794565599596234,
  0.29172160726099805,
  0.8060906981549777,
  0.28999088262371725,
  1,
  0.26085345302402696,
  0.9907114563424775,
  0.26270831194410055,
  0.679772232737636,
  0.6000902913370807,
  0.6152217371485272,
  0.5947170474985992,
  0.6698454420252251,
  0.803471662393424,
  0.6057046673064914,
  0.810849432231928,
  0.6743869600022137,
  0.9596757522756226,
  0.5402059235734651,
  1
];

const leftPunchPose = [
  0.689359754804897,
  0.20155548974804813,
  0.6988135972361454,
  0.18483253461711746,
  0.6558486933600791,
  0.18490401386105834,
  0.7249064330249875,
  0.18469564475929623,
  0.6069284641305341,
  0.2052893872335228,
  0.7707806082474745,
  0.2949893856587517,
  0.5534513173128672,
  0.3169787017971211,
  0.874383889146913,
  0.3061108992211797,
  0.4871992873006072,
  0.4520766045477085,
  1,
  0.2609495946500801,
  0.5767280060548258,
  0.4464982276143408,
  0.7278021804325744,
  0.6059643110779769,
  0.6034334803340811,
  0.5993753151942749,
  0.74002684644002,
  0.8191110378778538,
  0.5803852365048554,
  0.8205946258824,
  0.7084121823641014,
  0.9687124479509347,
  0.5588649134768446,
  1
];

function toTuple({ x, y }) {
  return [x, y];
}

export const processPose = pose => {
  const normalizedPose = normalizePose(pose);
  const leftMatch = cosineDistanceMatching(normalizedPose, leftPunchPose);
  const rightMatch = cosineDistanceMatching(normalizedPose, rightPunchPose);
  
  return { left: leftMatch, right: rightMatch };
};

const normalizePose = pose => {
  const boundingBox = posenet.getBoundingBox(pose.keypoints);
  const flatPoseArray = pose.keypoints
    .map(pose => [pose.position.x, pose.position.y])
    .flat();
  const normalizedArray = flatPoseArray.map((number, index) => {
    if (index % 2 === 0) {
      return number / boundingBox.maxX;
    } else {
      return number / boundingBox.maxY;
    }
  });
  return normalizedArray;
};

const cosineDistanceMatching = (pose, punchPose) => {
  let cosineSimliary = similarity(pose, punchPose);
  let distance = 2 * (1 - cosineSimliary);
  return Math.sqrt(distance);
};

export function drawKeyPoints(
  keypoints,
  minConfidence,
  skeletonColor,
  canvasContext,
  scale = 1
) {
  keypoints.forEach(keypoint => {
    if (keypoint.score >= minConfidence) {
      const { x, y } = keypoint.position;
      canvasContext.beginPath();
      canvasContext.arc(x * scale, y * scale, pointRadius, 0, 2 * Math.PI);

      if (keypoint.part === "rightWrist") {
        canvasContext.fillStyle = "blue";
      } else {
        canvasContext.fillStyle = "#fff";
      }
      canvasContext.fill();
    }
  });
}

function drawSegment(
  [firstX, firstY],
  [nextX, nextY],
  color,
  lineWidth,
  scale,
  canvasContext
) {
  canvasContext.beginPath();
  canvasContext.moveTo(firstX * scale, firstY * scale);
  canvasContext.lineTo(nextX * scale, nextY * scale);
  canvasContext.lineWidth = lineWidth;
  canvasContext.strokeStyle = color;
  canvasContext.stroke();
}

export function drawBoundingBox(keypoints, ctx, color) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(
    boundingBox.minX,
    boundingBox.minY,
    boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY
  );

  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawSkeleton(
  keypoints,
  minConfidence,
  color,
  lineWidth,
  canvasContext,
  scale = 1
) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach(keypoints => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      lineWidth,
      scale,
      canvasContext
    );
  });
}
