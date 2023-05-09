# Notion-Clone-Frontend

Description -
This appication is an attempt to clone the functionalites of the Notion's web version.

Live Demo - https://notion-clonee.netlify.app/

Video Demo - https://www.linkedin.com/posts/samyak-jain-835a66194_frontend-react-nodejs-activity-7061741537906278400-WU9n?utm_source=share&utm_medium=member_desktop

Backend Here - https://github.com/samyak112/Notion-Clone-Backend

Note:- 
1. Features are listed at the bottom

2. Unsplash only allows 50 requests per hour on free pack so you might not be able to see the cover photo

# Previews:

![image](https://github.com/samyak112/Notion-Clone-Frontend/assets/73217093/906686e9-a380-4692-98ae-5d8cbbf3b5d2)



# Technologies Used

Front end-
1. React.js
2. CSS
3. React MUI

Back-end -
1. Node.js
2. Express

Database - 
1. Mongodb

Linting Tool - 
1. EsLint

# Current Features:- 
- [x] Login System
- [x] Dashboard with Explorer and Editor 
- [x] Smart Rendering System which Re Renders the block only if there is any edit made actually for eg. if the block's initial text was 'hello' and the user type something and then went back to 'hello' again then the block wont be re rendered. 
- [x] Uses a Blend of BFS and DFS algorithms to search throught the tree for fast updates and deletions on the frontend
- [x] Notion like File Structure which uses tree data structure
- [x] All the files and subfiles are fully editable which include renaming , deleting, adding
- [x] Redirects User to the last Edited File automatically , irrespective of if someone deleted something from local storage or working on a new device you'll be redirected to the last edited file and if new user then user will be redirected to 'Get Started' File 
- [x] Change File Icon and FileName in Realtime in both Explorer and Editor
- [x] Add Cover Photo and Repsoition it
- [x] Multiple Features to edit Block which includes :-
  - [x] Bullet Points
  - [x] Numbered Points
  - [x] TO-Do List
  - [x] Heading
- [x] Re Order Blocks Using Drag and Drop
