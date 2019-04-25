// https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/demo_util.js
// https://medium.com/tensorflow/move-mirror-an-ai-experiment-with-pose-estimation-in-the-browser-using-tensorflow-js-2f7b769f9b23
import * as posenet from "@tensorflow-models/posenet";
import similarity from "compute-cosine-similarity"; //Not used if using more accurate detection with score
import VPTreeFactory from "vptree";
import poseData from "./poseData.json";

console.log("Working with " + poseData.length + " poses!");

const confidenceLevel = 0.15;
let vptree;

export const processPose = pose => {
  const normalizedPose = normalizePose(pose);
  return findMostSimliarMatch(normalizedPose);
};

const normalizePose = pose => {
  const boundingBox = posenet.getBoundingBox(pose.keypoints);
  let normalizedArray = new Array(34);

  // move all points to top left corner
  for (let index in pose.keypoints) {
    normalizedArray[index * 2] = pose.keypoints[index].position.x - boundingBox.minX;
    normalizedArray[index * 2 + 1] = pose.keypoints[index].position.y - boundingBox.minY;
  }

  // normalize between 0 and 1
  const width = boundingBox.maxX - boundingBox.minX;
  const height = boundingBox.maxY - boundingBox.minY;

  normalizedArray = normalizedArray.map((point, index) => {
    if (index % 2 === 0) {
      return point / width
    } else {
      return point / height;
    }
  })

  // not needed if using compute-cosine-similiarty
  // const confidences = new Array(17);
  // let sumConfidences = 0;

  // for (let index in pose.keypoints) {

  //   // not needed if using compute-cosine-similiarty
  //   // sumConfidences += pose.keypoints[index].score;
  //   // confidences[index] = pose.keypoints[index].score;
  //   normalizedArray[index * 2] =
  //     pose.keypoints[index].position.x / boundingBox.maxX;
  //   normalizedArray[index * 2 + 1] =
  //     pose.keypoints[index].position.y / boundingBox.maxY;
  // }

  // not needed if using compute-cosine-similiarty
  // return [...normalizedArray, ...confidences, sumConfidences];
  return normalizedArray;
};

// not needed if using compute-cosine-similiarty
// const weightedDistanceMatching = (pose, punchPose) => {
//   const vector1PoseXY = pose.slice(0, 34);
//   const vector1Confidences = pose.slice(34, 51);
//   const vector1ConfidenceSum = pose.slice(51, 52);
//   const vector2PoseXY = punchPose.slice(0, 34);
//   const summation1 = 1 / vector1ConfidenceSum;
//   let summation2 = 0;
//   for (let i = 0; i < vector1PoseXY.length; i++) {
//     let tempConf = Math.floor(i / 2);
//     let tempSum =
//       vector1Confidences[tempConf] *
//       Math.abs(vector1PoseXY[i] - vector2PoseXY[i]);
//     summation2 = summation2 + tempSum;
//   }

//   return summation1 * summation2;
// };

const cosineDistanceMatching = (pose, punchPose) => {
  let cosineSimliary = similarity(pose.slice(0, 34), punchPose.slice(0, 34));
  let distance = 2 * (1 - cosineSimliary);
  return Math.sqrt(distance);
};

const buildVPTree = () => {
  vptree = VPTreeFactory.build(poseData, cosineDistanceMatching);
};

const findMostSimliarMatch = pose => {
  const nearestPose = vptree.search(pose);
  console.log(nearestPose[0].d);
  console.log(poseData[nearestPose[0].i][34]);
  console.log(poseData[nearestPose[0].i][35]);

  if (nearestPose[0].d < confidenceLevel) {
    return poseData[nearestPose[0].i][34];
  }
};

buildVPTree();
