// https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/demo_util.js
// https://medium.com/tensorflow/move-mirror-an-ai-experiment-with-pose-estimation-in-the-browser-using-tensorflow-js-2f7b769f9b23
import * as posenet from "@tensorflow-models/posenet";
import similarity from "compute-cosine-similarity"; //Not used if using more accurate detection with score
import VPTreeFactory from "vptree";
import poseData from "./poseData.json";

console.log("Working with " + poseData.length + " poses!");

const pointRadius = 3;
const confidenceLevel = 0.14;
let vptree;

function toTuple({ x, y }) {
  return [x, y];
}

export const processPose = pose => {
  const normalizedPose = normalizePose(pose);
  return findMostSimliarMatch(normalizedPose);
};

const normalizePose = pose => {
  const boundingBox = posenet.getBoundingBox(pose.keypoints);
  const normalizedArray = new Array(34);
  // const confidences = new Array(17);
  // let sumConfidences = 0;

  for (let index in pose.keypoints) {
    // sumConfidences += pose.keypoints[index].score;
    // confidences[index] = pose.keypoints[index].score;
    normalizedArray[index * 2] =
      pose.keypoints[index].position.x / boundingBox.maxX;
    normalizedArray[index * 2 + 1] =
      pose.keypoints[index].position.y / boundingBox.maxY;
  }

  // return [...normalizedArray, ...confidences, sumConfidences];
  return normalizedArray;
};

const weightedDistanceMatching = (pose, punchPose) => {
  const vector1PoseXY = pose.slice(0, 34);
  const vector1Confidences = pose.slice(34, 51);
  const vector1ConfidenceSum = pose.slice(51, 52);
  const vector2PoseXY = punchPose.slice(0, 34);
  const summation1 = 1 / vector1ConfidenceSum;
  let summation2 = 0;
  for (let i = 0; i < vector1PoseXY.length; i++) {
    let tempConf = Math.floor(i / 2);
    let tempSum =
      vector1Confidences[tempConf] *
      Math.abs(vector1PoseXY[i] - vector2PoseXY[i]);
    summation2 = summation2 + tempSum;
  }

  return summation1 * summation2;
};

// No longer used since using more accurate detection using keypoint weights
const cosineDistanceMatching = (pose, punchPose) => {
  let cosineSimliary = similarity(pose.slice(0, 34), punchPose.slice(0, 34));
  let distance = 2 * (1 - cosineSimliary);
  return Math.sqrt(distance);
};

const buildVPTree = () => {
  vptree = VPTreeFactory.build(poseData, cosineDistanceMatching);
};

const findMostSimliarMatch = pose => {
  // const top3Matches = vptree.search(pose, 3);

  const nearestPose = vptree.search(pose);
  // console.log(nearestPose[0].d);
  // console.log(poseData[nearestPose[0].i][34]);

  if (nearestPose[0].d < confidenceLevel) {
    // for (let match of top3Matches) {
    //   console.log(poseData[match.i][34]);
    //   console.log(match.d);
    // }
    return poseData[nearestPose[0].i][34];
  }
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
        canvasContext.fillStyle = skeletonColor;
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

buildVPTree();
