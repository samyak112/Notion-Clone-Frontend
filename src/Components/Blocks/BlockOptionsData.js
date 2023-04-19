import h1 from '../../assets/h1.png';
import h2 from '../../assets/h2.png';
import h3 from '../../assets/h3.png';
import text from '../../assets/text.png';
import BulletList from '../../assets/bullet_list.png';
import ToDoList from '../../assets/to_do_list.png';
import NumberList from '../../assets/numbered_list.png';

const BasicBlocks = [
  {
    id: 1,
    icon: text,
    Heading: 'Text',
    Description: 'Just Start Writing with plain text',
    value: 'text',
  },
  {
    id: 2,
    icon: ToDoList,
    Heading: 'To-do list',
    Description: 'Track tasks with a todo list',
    value: 'to_do_list',
  },
  {
    id: 3,
    icon: h1,
    Heading: 'Heading 1',
    Description: 'Big Section Heading',
    value: 'heading_1',
  },
  {
    id: 4,
    icon: h2,
    Heading: 'Heading 2',
    Description: 'Medium Section Heading',
    value: 'heading_2',
  },
  {
    id: 5,
    icon: h3,
    Heading: 'Heading 3',
    Description: 'Small Section Heading',
    value: 'heading_3',
  },
  {
    id: 6,
    icon: BulletList,
    Heading: 'Bulleted List',
    Description: 'Create a Simple Bulleted List',
    value: 'bullet_list',
  },
  {
    id: 7,
    icon: NumberList,
    Heading: 'Numbered List',
    Description: 'Create a List with Numbering',
    value: 'number_list',
  },
];

const BlockColors = [
  { id: 1, color: '#37352F', Heading: 'Default' },
  { id: 2, color: '#787774', Heading: 'Gray' },
  { id: 3, color: '#9F6B53', Heading: 'Brown' },
  { id: 4, color: '#D9730D', Heading: 'Orange' },
  { id: 5, color: '#CB912F', Heading: 'Yellow' },
  { id: 6, color: '#448361', Heading: 'Green' },
  { id: 7, color: '#337EA9', Heading: 'Blue' },
  { id: 8, color: '#9065B0', Heading: 'Purple' },
  { id: 9, color: '#C14C8A', Heading: 'Pink' },
  { id: 10, color: '#D44C47', Heading: 'Red' },
];

const BlockBackground = [
  { id: 1, background: '#FFFFFF', Heading: 'Default Background' },
  { id: 2, background: '#F1F1EF', Heading: 'Gray Background' },
  { id: 3, background: '#F4EEEE', Heading: 'Brown Background' },
  { id: 4, background: '#FBECDD', Heading: 'Orange Background' },
  { id: 5, background: '#FBF3DB', Heading: 'Yellow Background' },
  { id: 6, background: '#EDF3EC', Heading: 'Green Background' },
  { id: 7, background: '#E7F3F8', Heading: 'Blue Background' },
  { id: 8, background: '#F4F0F7CC', Heading: 'Purple Background' },
  { id: 9, background: '#F9EEF3CC', Heading: 'Pink Background' },
  { id: 10, background: '#FDEBEC', Heading: 'Red Background' },
];

export default { BasicBlocks, BlockColors, BlockBackground };
