import h1 from '../../assets/h1.png';
import h2 from '../../assets/h2.png';
import h3 from '../../assets/h3.png';
import text from '../../assets/text.png';
import BulletList from '../../assets/bullet_list.png';
import ToDoList from '../../assets/to_do_list.png';
import NumberList from '../../assets/numbered_list.png';

const BasicBlocks = [
  {
    icon: text, Heading: 'Text', Description: 'Just Start Writing with plain text', value: 'text',
  },
  {
    icon: ToDoList, Heading: 'To-do list', Description: 'Track tasks with a todo list', value: 'to_do_list',
  },
  {
    icon: h1, Heading: 'Heading 1', Description: 'Big Section Heading', value: 'heading_1',
  },
  {
    icon: h2, Heading: 'Heading 2', Description: 'Medium Section Heading', value: 'heading_2',
  },
  {
    icon: h3, Heading: 'Heading 3', Description: 'Small Section Heading', value: 'heading_3',
  },
  {
    icon: BulletList, Heading: 'Bulleted List', Description: 'Create a Simple Bulleted List', value: 'bullet_list',
  },
  {
    icon: NumberList, Heading: 'Numbered List', Description: 'Create a List with Numbering', value: 'number_list',
  },
];

const BlockColors = [
  { color: '#37352F', Heading: 'Default' },
  { color: '#787774', Heading: 'Gray' },
  { color: '#9F6B53', Heading: 'Brown' },
  { color: '#D9730D', Heading: 'Orange' },
  { color: '#CB912F', Heading: 'Yellow' },
  { color: '#448361', Heading: 'Green' },
  { color: '#337EA9', Heading: 'Blue' },
  { color: '#9065B0', Heading: 'Purple' },
  { color: '#C14C8A', Heading: 'Pink' },
  { color: '#D44C47', Heading: 'Red' },
];

const BlockBackground = [
  { background: '#FFFFFF', Heading: 'Default Background' },
  { background: '#F1F1EF', Heading: 'Gray Background' },
  { background: '#F4EEEE', Heading: 'Brown Background' },
  { background: '#FBECDD', Heading: 'Orange Background' },
  { background: '#FBF3DB', Heading: 'Yellow Background' },
  { background: '#EDF3EC', Heading: 'Green Background' },
  { background: '#E7F3F8', Heading: 'Blue Background' },
  { background: '#F4F0F7CC', Heading: 'Purple Background' },
  { background: '#F9EEF3CC', Heading: 'Pink Background' },
  { background: '#FDEBEC', Heading: 'Red Background' },
];

export default { BasicBlocks, BlockColors, BlockBackground };
