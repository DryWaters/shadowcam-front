// https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/demo_util.js
// https://medium.com/tensorflow/move-mirror-an-ai-experiment-with-pose-estimation-in-the-browser-using-tensorflow-js-2f7b769f9b23
import * as posenet from "@tensorflow-models/posenet";
import similarity from "compute-cosine-similarity";

const pointRadius = 3;
const leftPunchPose = [
  215.54674287683824, 89.91494981601495,
  216.54583524816175, 79.42030975395431,
  202.88325482536766, 86.45254661412567,
  225.54495634191176, 84.14411762686731,
  184.76408547794117, 94.50599496100617,
  244.83500114889705, 124.68320930360282,
  171.75318818933823, 138.04072214136644,
  294.80394071691177, 117.58656909050967,
  148.32115119485294, 195.58785973198596,
  330.67972196691176, 97.48374684204747,
  173.65669232536766, 199.56651952438492,
  243.30484260110293, 251.03031634446398,
  194.2647173713235, 251.7403064586995,
  239.83430032169116, 328.04817937170475,
  186.77493681066176, 332.6275881480668,
  230.17151884191176, 388.367098253515,
  171.06736557904412, 408.41052010105454
];

const rightPunchPose = [
  275.31948529411767, 85.43850917179263,
  277.04069393382355, 77.76424682831723,
  267.94951171875, 78.21295927614236,
  270.45258501838236, 81.35795392135326,
  241.44052734375, 82.99016057502197,
  258.8570197610294, 121.48280460511864,
  230.79928193933824, 123.58467946781636,
  299.20260799632354, 124.40683696726714,
  296.9756663602941, 126.64314792948156,
  356.3537109375, 119.86709138840071,
  359.05088465073527, 119.95602036192884,
  252.18986098345587, 243.77502334138842,
  235.73432329963234, 245.2484141586116,
  242.82832031249998, 334.0185632688928,
  240.41393037683824, 333.1117160039543,
  237.03251953125, 408.1865457491213,
  220.8740176930147, 419.91638290861164
];

function toTuple({ x, y }) {
  return [x, y];
}

export const processPose = pose => {
  // console.log(normalizePose(pose));
  const leftMatch = cosineDistanceMatching(normalizePose(pose), leftPunchPose);
  const rightMatch = cosineDistanceMatching(
    normalizePose(pose),
    rightPunchPose
  );
  return { left: leftMatch, right: rightMatch };
};

const normalizePose = pose => {
  let normalPose = pose.keypoints;
  return normalPose.map(pose => [pose.position.x, pose.position.y]).flat();
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
        canvasContext.fillStyle = 'blue';
      } else {
        canvasContext.fillStyle = '#fff';
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
