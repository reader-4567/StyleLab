import { LAYOUT_GUIDES } from './guides/layoutGuides.js';
import { VISUAL_GUIDES } from './guides/visualGuides.js';
import { MOTION_GUIDES } from './guides/motionGuides.js';

export const LEARNING_GUIDES = {
  ...LAYOUT_GUIDES,
  ...VISUAL_GUIDES,
  ...MOTION_GUIDES,
};

export function getModuleLearningGuide(playgroundId) {
  return LEARNING_GUIDES[playgroundId] || LEARNING_GUIDES.flexbox;
}

export function getPropertyGuide(playgroundId, propertyId) {
  const guide = getModuleLearningGuide(playgroundId);
  if (!guide) return null;
  return guide.properties.find((p) => p.id === propertyId) || guide.properties[0] || null;
}
