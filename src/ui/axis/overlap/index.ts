import { type DisplayObject, Text } from '../../../shapes';
import type { AxisStyleProps, LabelOverlapCfg } from '../types';
import { isInOffscreenGroup } from '../../../util';
import ellipsis, { type Utils as EllipsisUtils } from './autoEllipsis';
import hide, { type Utils as HideUtils } from './autoHide';
import rotate, { type Utils as RotateUtils } from './autoRotate';
import wrap, { type Utils as WrapUtils } from './autoWrap';

export type OverlapCallback = (labels: Text[], overlapCfg: any, cfg: AxisStyleProps, utils: any) => any;

export type OverlapUtilsType = EllipsisUtils & HideUtils & RotateUtils & WrapUtils;

export const OverlapUtils = new Map<string, any>([
  ['hide', hide],
  ['rotate', rotate],
  ['ellipsis', ellipsis],
  ['wrap', wrap],
]);

export function canProcessOverlap(
  labels: DisplayObject[],
  attr: Required<AxisStyleProps>,
  type: LabelOverlapCfg['type']
) {
  if (attr.labelOverlap.length < 1) return false;
  if (type === 'hide') return !isInOffscreenGroup(labels[0]);
  if (type === 'rotate') return !labels.some((label) => !!label.attr('transform')?.includes('rotate'));
  if (type === 'ellipsis' || type === 'wrap') return labels.filter((item) => item.querySelector('text')).length > 1;
  return true;
}

export function processOverlap(labels: DisplayObject[], attr: Required<AxisStyleProps>, utils: OverlapUtilsType) {
  const { labelOverlap = [] } = attr;
  if (!labelOverlap.length) return;
  labelOverlap.forEach((overlapCfg) => {
    const { type } = overlapCfg;
    const util = OverlapUtils.get(type);
    if (canProcessOverlap(labels, attr, type)) util?.(labels as any[], overlapCfg, attr, utils);
  });
}
