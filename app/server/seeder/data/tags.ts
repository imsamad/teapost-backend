import Tag from '../../src/models/Tag';
import 'colors';
const tags = [
  {
    _id: '6221bf0044eaf2d6fc67b995',
    title: 'politics',
  },
  {
    _id: '6221bf8144eaf2d6fc67b9ed',
    title: 'psychology',
  },
  {
    _id: '6221c01544eaf2d6fc67ba46',
    title: 'defense',
  },
  {
    _id: '6221c0a144eaf2d6fc67baaa',
    title: 'geopolitics',
  },
  {
    _id: '6221c15c44eaf2d6fc67bb1b',
    title: 'society',
  },
  {
    _id: '6221c1ce44eaf2d6fc67bb5e',
    title: 'leadership',
  },
  {
    _id: '6221c26a44eaf2d6fc67bbc8',
    title: 'health',
  },
  { _id: '627a0d23fc13ae266e0000fa', title: 'access' },
  { _id: '627a0d23fc13ae266e0000fb', title: 'Integrated' },
  { _id: '627a0d23fc13ae266e0000fd', title: 'empowering' },
  { _id: '627a0d23fc13ae266e0000fe', title: 'disintermediate' },
  { _id: '627a0d23fc13ae266e0000ff', title: 'homogeneous' },
  { _id: '627a0d23fc13ae266e000100', title: 'motivating' },
  { _id: '627a0d23fc13ae266e000101', title: 'transitional' },
  { _id: '627a0d23fc13ae266e000102', title: 'Function-based' },
  { _id: '627a0d23fc13ae266e000104', title: 'migration' },
  { _id: '627a0d23fc13ae266e000105', title: 'productivity' },
  { _id: '627a0d23fc13ae266e000106', title: 'time-frame' },
  { _id: '627a0d23fc13ae266e000107', title: 'intangible' },
  { _id: '627a0d23fc13ae266e000108', title: 'Diverse' },
  { _id: '627a0d23fc13ae266e000109', title: 'frame' },
  { _id: '627a0d23fc13ae266e00010a', title: 'asymmetric' },
  { _id: '627a0d23fc13ae266e00010b', title: 'moderator' },
  { _id: '627a0d23fc13ae266e00010c', title: 'object-oriented' },
  { _id: '627a0d23fc13ae266e00010d', title: 'hierarchy' },
  { _id: '627a0d23fc13ae266e00010e', title: 'well-modulated' },
  { _id: '627a0d23fc13ae266e00010f', title: 'explicit' },
  { _id: '627a0d23fc13ae266e000110', title: 'Grass-roots' },
  { _id: '627a0d23fc13ae266e000111', title: 'Balanced' },
  { _id: '627a0d23fc13ae266e000112', title: 'Seamless' },
  { _id: '627a0d23fc13ae266e000113', title: 'model' },
  { _id: '627a0d23fc13ae266e000114', title: 'Operative' },
  { _id: '627a0d23fc13ae266e000116', title: 'Centralized' },
  { _id: '627a0d23fc13ae266e000117', title: 'forecast' },
  { _id: '627a0d23fc13ae266e000118', title: 'heuristic' },
  { _id: '627a0d23fc13ae266e000119', title: 'Front-line' },
  { _id: '627a0d23fc13ae266e00011a', title: 'cohesive' },
  { _id: '627a0d23fc13ae266e00011b', title: 'Re-contextualized' },
  {
    _id: '627a0d23fc13ae266e00011c',
    title: 'AI',
  },
  { _id: '627a0d23fc13ae266e00011d', title: 'bifurcated' },
  { _id: '627a0d23fc13ae266e00011e', title: 'tertiary' },
  { _id: '627a0d23fc13ae266e00011f', title: 'responsive' },
  { _id: '627a0d23fc13ae266e000120', title: 'Digitized' },
  { _id: '627a0d23fc13ae266e000121', title: 'Sharable' },
  { _id: '627a0d23fc13ae266e000122', title: 'Cross-group' },
  { _id: '627a0d23fc13ae266e000123', title: 'UI' },
  { _id: '627a0d23fc13ae266e000124', title: 'Robust' },
  { _id: '627a0d23fc13ae266e000126', title: 'strategy' },
  { _id: '627a0d23fc13ae266e000128', title: '3rd-gen' },
  { _id: '627a0d23fc13ae266e000129', title: 'static' },
  { _id: '627a0d23fc13ae266e00012a', title: 'User-friendly' },
  { _id: '627a0d23fc13ae266e00012b', title: 'Optional' },
];

export const generateTags = async (length?: number) => {
  console.time('):- Tags generated '.green.italic);
  const tagsCreated = await Tag.create(tags.slice(0, length));
  console.timeEnd('):- Tags generated '.green.italic);
  return tagsCreated;
};

export default tags;
