import React from 'react';
import { Course, Lesson, Badge } from './types';
import { BrainIcon, CodeIcon, RobotIcon, ImageIcon, SpeechIcon, PuzzleIcon, ChartIcon, NetworkIcon, ShieldIcon, GhostIcon, WorldIcon, BrushIcon, GlobeIcon, DatabaseIcon, GamepadIcon, CuteBotIcon, WiseBotIcon, SuperBotIcon, StarIcon, TrophyIcon, GraduationCapIcon } from './components/Icons';
import { slugify } from './utils/slugify';

export const AVATAR_OPTIONS = [
  { id: 'default', name: 'Robo', Icon: RobotIcon },
  { id: 'cute', name: 'Sparky', Icon: CuteBotIcon },
  { id: 'wise', name: 'Professor', Icon: WiseBotIcon },
  { id: 'super', name: 'Bolt', Icon: SuperBotIcon },
];

export const BADGES: Badge[] = [
  {
    id: 'first-course-complete',
    name: 'Course Completer',
    description: 'Finish all the missions in your very first course!',
    Icon: TrophyIcon,
    condition: ({ progress, courses }) => {
      return Object.keys(progress).some(courseId => {
        const course = courses.find(c => c.id === courseId);
        return course ? progress[courseId].size === course.lessons.length && course.lessons.length > 0 : false;
      });
    },
  },
  {
    id: 'star-collector-100',
    name: 'Star Collector',
    description: 'Earn a total of 100 stars from completing missions.',
    Icon: StarIcon,
    condition: ({ totalStars }) => totalStars >= 100,
  },
  {
    id: 'beginner-graduate',
    name: 'Beginner Graduate',
    description: 'Complete all available "Beginner" level courses.',
    Icon: GraduationCapIcon,
    condition: ({ progress, courses }) => {
      const beginnerCourses = courses.filter(c => c.difficulty === 'Beginner');
      if (beginnerCourses.length === 0) return false;
      return beginnerCourses.every(c => {
        const courseProgress = progress[c.id];
        return courseProgress && c.lessons.length > 0 && courseProgress.size === c.lessons.length;
      });
    },
  },
  {
    id: 'completed-what-is-ai',
    name: 'AI Apprentice',
    description: "Completed the 'What is AI?' course and took your first step into a larger world!",
    Icon: BrainIcon,
    condition: ({ progress, courses }) => {
      const courseId = 'c1';
      const course = courses.find(c => c.id === courseId);
      if (!course || course.lessons.length === 0) return false;
      const courseProgress = progress[courseId];
      return courseProgress ? courseProgress.size === course.lessons.length : false;
    },
  },
];


const rawCourses: Omit<Course, 'slug'>[] = [
  {
    id: 'c0',
    title: 'Welcome to the Academy!',
    description: 'Start your adventure here! Learn how the academy works, complete your first challenges, and earn your first stars to begin your journey.',
    Icon: GraduationCapIcon,
    color: 'from-yellow-400 to-amber-500',
    shadowColor: 'shadow-yellow-300/50',
    difficulty: 'Beginner',
    lessons: [
      { id: 'c0-1', title: 'Your First Mission!', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: "Welcome, Explorer! In this academy, you'll complete missions in different courses to learn about AI. Each mission you finish earns you stars. To complete this first mission, just type 'Ready' in the box below to show you're ready for adventure!", keywords: ['ready'], placeholder: "Type 'Ready' here" } },
      { id: 'c0-2', title: 'Earning Stars & Badges', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: "Stars show your progress on your journey to becoming an AI Expert! You can see your total stars at the top of the screen. As you collect stars and complete courses, you'll also earn cool achievement badges! What do you earn for completing missions?", keywords: ['stars'], placeholder: "What do you earn?" } },
      { id: 'c0-3', title: 'Meet Your AI Helper', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: "Sometimes, missions can be tricky. When you're inside a course, you'll see the AI Helper Bot. It can give you fun facts, simple explanations, or even a hint if you're stuck! What is the bot called?", keywords: ['helper', 'ai helper'], placeholder: "The bot is called..." } },
      { id: 'c0-4', title: 'Choose Your Path', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: "After this, you can choose any course you want from the dashboard. Each one has a different topic, from coding to art. You are in control of your learning adventure! Are you excited to start?", keywords: ['yes', 'excited'], placeholder: "Are you excited?" } },
    ]
  },
  {
    id: 'c1',
    title: 'What is AI?',
    description: 'Start your adventure here! Find out what AI really is, where you can find it, and how it works like a computer\'s brain.',
    Icon: BrainIcon,
    color: 'from-sky-400 to-blue-500',
    shadowColor: 'shadow-sky-300/50',
    difficulty: 'Beginner',
    lessons: [
      { id: 'l1-1', title: 'Meet AI', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'AI is like a computer brain that can learn things, just like you! It helps computers think and solve problems.' } },
      { id: 'l1-2', title: 'Spot the AI', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'Can you name something in your house that might use AI?', keywords: ['alexa', 'siri', 'google', 'speaker', 'phone', 'game', 'tv'], placeholder: 'e.g., a smart speaker' } },
      { id: 'l1-3', title: 'Types of AI', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'Some AI is simple, like a calculator that only does math. Some is complex, like a robot that can talk and learn new things!' } },
      { id: 'l1-4', title: 'AI Friend', type: 'tip', starsAwarded: 10, missionType: 'info', missionData: { text: 'Think of AI as a helpful friend that can answer questions, play games, and even help create art.' } },
      { id: 'l1-5', title: 'AI Quiz!', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'What does "AI" stand for?', options: ['Awesome Inventor', 'Artificial Intelligence', 'Always Imagining'], correctAnswerIndex: 1 } },
      { id: 'l1-6', title: 'Learning Machines', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'Machine Learning is the main way AI learns. It\'s like how you learn by practicing something over and over.' } },
      { id: 'l1-7', title: 'Draw an AI', type: 'drawing_challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'What does an AI look like to you? Describe your drawing!', keywords: ['robot', 'brain', 'computer', 'light', 'friend'], placeholder: 'e.g., a friendly robot' } },
      { id: 'l1-8', title: 'Logic Puzzle', type: 'logic_puzzle', starsAwarded: 10, missionType: 'logic_puzzle', missionData: { puzzle: 'I can show you the whole world, but I have no houses or trees. You can see rivers, but no fish swim in my water. What am I?', correctAnswer: 'A map', placeholder: 'What could it be?' } },
      { id: 'l1-9', title: 'AI in Disguise', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Oh no, it might be raining! Let\'s help our robot friend decide if it needs an umbrella. Complete the code to check the weather!', codeBefore: 'if (weather === "rainy") {', codeAfter: '}', options: ['bring_umbrella();', 'wear_sunglasses();', 'eat_ice_cream();'], correctAnswerIndex: 0 } },
      { id: 'l1-10', title: 'Final Exam', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'Which of these is a good use for AI?', options: ['Playing games with you', 'Helping doctors', 'Driving cars safely', 'All of the above'], correctAnswerIndex: 3 } },
      { id: 'l1-11', title: 'AI Greeting', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Your friendly AI sees someone new! Let\'s teach it to be polite. Finish the code so it says "Hello!" when it spots a person.', codeBefore: 'if (sees_person) {', codeAfter: '}', options: ['say("Hello!");', 'run_away();', 'do_nothing();'], correctAnswerIndex: 0 } },
    ],
  },
  {
    id: 'c2',
    title: 'Block Coding Basics',
    description: 'Become a coder! Learn to give computers instructions by snapping colorful blocks together. It\'s like building with digital LEGOs to make amazing things happen!',
    Icon: CodeIcon,
    color: 'from-orange-400 to-red-500',
    shadowColor: 'shadow-orange-300/50',
    difficulty: 'Beginner',
    lessons: [
        { id: 'l2-1', title: 'First Commands', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'In coding, a command is a single instruction for the computer. Like "Walk Forward" or "Jump".' } },
        { id: 'l2-2', title: 'Make a Sequence', type: 'challenge', starsAwarded: 10, missionType: 'drag_drop_order', missionData: { prompt: 'To make the robot dance, put these blocks in the correct order:', items: [{id: 'i1', content: 'Turn Right'},{id: 'i2', content: 'Step Forward'},{id: 'i3', content: 'Turn Left'},{id: 'i4', content: 'Step Backward'}], correctOrder: ['i2', 'i1', 'i4', 'i3']} },
        { id: 'l2-3', title: 'What is a Loop?', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'A loop tells the computer to repeat an action. Instead of saying "Step" 5 times, you can say "Repeat Step 5 times"!' } },
        { id: 'l2-4', title: 'Loop Quiz', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'If you want a cat to meow 3 times, what is the best block to use?', options: ['A "Meow" block', 'Three "Meow" blocks', 'A "Repeat 3 times" loop with a "Meow" block inside'], correctAnswerIndex: 2 } },
        { id: 'l2-5', title: 'The "If" Block', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'An "If" block checks if something is true. For example: IF you see a wall, THEN turn left.' } },
        { id: 'l2-6', title: 'Fill in the Code', type: 'challenge', starsAwarded: 15, missionType: 'fill_in_the_blanks', missionData: { prompt: 'Complete the code to make the sprite say "Hello!" when the program starts.', parts: ['When Green Flag Clicked, ', {id:'b1', correctValue:'say'}, ' "Hello!" for 2 seconds.'], options: ['say', 'think', 'hide']}},
        { id: 'l2-7', title: 'Number Pattern Puzzle', type: 'logic_puzzle', starsAwarded: 10, missionType: 'logic_puzzle', missionData: { puzzle: 'I\'m a number pattern that loves to double! I go 1, then 2, then 4, then 8... Can you guess what number I\'ll be next?', correctAnswer: '16', placeholder: 'Next number is...' } },
        { id: 'l2-8', title: 'Score Quiz', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'You collected a coin! What should your code do to the "Score" variable?', options: ['Add 1 to Score', 'Empty the Score box', 'Subtract 1 from Score'], correctAnswerIndex: 0 } },
        { id: 'l2-9', title: 'Coding Game', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'This little character loves to jump! Let\'s use a loop to make it jump exactly 5 times in a row. Fill in the missing block!', codeBefore: 'repeat (5) {', codeAfter: '}', options: ['sleep();', 'jump();', 'turn_around();'], correctAnswerIndex: 1 } },
        { id: 'l2-10', title: 'Final Challenge', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'What block would you use to start your game?', keywords: ['when green flag clicked', 'start', 'when start', 'flag'], placeholder: 'e.g., When _____ is clicked' } },
        { id: 'l2-11', title: 'Add to Score', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Hooray! You just found a giant treasure coin worth 10 points! Let\'s add it to your score. Finish the code to add 10 to the score.', codeBefore: 'score = score +', codeAfter: ';', options: ['5', '10', '100'], correctAnswerIndex: 1 } },
    ],
  },
    {
    id: 'c3',
    title: 'Building Your First Robot',
    description: 'It\'s time to build your own robot! Learn about sensors, motors, and batteries, then program your creation to dance, explore, and complete fun missions.',
    Icon: RobotIcon,
    color: 'from-slate-500 to-slate-700',
    shadowColor: 'shadow-slate-400/50',
    difficulty: 'Beginner',
    lessons: [
      { id: 'c3-1', title: 'Parts of a Robot', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'A robot has a body, sensors to see and hear (like eyes and ears), and a computer brain to think!' } },
      { id: 'c3-2', title: 'Power Up!', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'Which part gives a robot energy?', options: ['Motor', 'Sensor', 'Battery'], correctAnswerIndex: 2 } },
      { id: 'c3-3', title: 'Robot Senses', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'Sensors help a robot understand the world. A touch sensor can feel when it bumps into something.' } },
      { id: 'c3-4', title: 'Assemble the Robot!', type: 'challenge', starsAwarded: 15, missionType: 'jigsaw_puzzle', missionData: { prompt: 'A robot needs to be assembled correctly to work! Put the parts in order from bottom to top.', image: '', pieces: [{id: 'p1', content: 'Wheels (Base)'}, {id: 'p2', content: 'Body (Chassis)'}, {id: 'p3', content: 'Arms (Manipulators)'}, {id: 'p4', content: 'Head (Sensors)'}], correctOrder: ['p1', 'p2', 'p3', 'p4']}},
      { id: 'c3-5', title: 'Follow the Line', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'What kind of sensor would a robot use to follow a black line on the floor?', keywords: ['light', 'color', 'line'], placeholder: 'A ____ sensor' } },
      { id: 'c3-6', title: 'Robot Coding Game', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Let\'s program our robot to explore a room! It needs to keep moving forward, but stop right before it bumps into a wall. Complete the \'while\' loop to make it happen.', codeBefore: 'while (distance_to_wall > 0) {', codeAfter: '}', options: ['move_backward();', 'stop();', 'move_forward();'], correctAnswerIndex: 2 } },
      { id: 'c3-7', title: 'Motors', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'Motors are like the robot\'s muscles. They spin the wheels and move the arms.' } },
      { id: 'c3-8', title: 'Robot Dance Party', type: 'challenge', starsAwarded: 10, missionType: 'drag_drop_order', missionData: { prompt: 'Program a simple dance:', items: [{id: 'd1', content: 'Turn Left'}, {id: 'd2', content: 'Arms Up'}, {id: 'd3', content: 'Turn Right'}, {id: 'd4', content: 'Arms Down'}], correctOrder: ['d2', 'd1', 'd4', 'd3']}},
      { id: 'c3-9', title: 'Robot Quiz', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'What is the "brain" of the robot?', options: ['The battery', 'The computer', 'The wheels'], correctAnswerIndex: 1 } },
      { id: 'c3-10', title: 'Final Project Idea', type: 'tip', starsAwarded: 10, missionType: 'info', missionData: { text: 'Think about a helpful robot you could build. Maybe one that waters plants or helps clean your room!' } },
      { id: 'c3-11', title: 'Sensor Check', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Our robot has a sensor on its bumper! Let\'s teach it to stop its motors the moment it gently touches something. Complete the \'if\' statement.', codeBefore: 'if (touch_sensor.isPressed()) {', codeAfter: '}', options: ['move_forward();', 'turn_left();', 'stop_motors();'], correctAnswerIndex: 2 } },
    ],
  },
  {
    id: 'c4',
    title: 'AI and Art',
    description: 'Unleash your inner artist! Discover how you can use AI to draw incredible pictures, write cool poems, and even compose your own music just by using your words.',
    Icon: ImageIcon,
    color: 'from-purple-400 to-indigo-500',
    shadowColor: 'shadow-purple-300/50',
    difficulty: 'Beginner',
    lessons: [
      { id: 'c4-1', title: 'What is Generative AI?', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'Generative AI is a type of AI that can create brand new things, like poems, pictures, and music!' } },
      { id: 'c4-2', title: 'Drawing with Words', type: 'drawing_challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'Write a short, fun description for an AI to draw!', keywords: ['dog', 'cat', 'hat', 'space', 'moon'], placeholder: 'A cat wearing a party hat' } },
      { id: 'c4-3', title: 'Art Style Quiz', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'If you want a picture to look like a cartoon, you can tell the AI to use a _____ style.', options: ['photo', 'cartoon', 'sleepy'], correctAnswerIndex: 1 } },
      { id: 'c4-4', title: 'AI Music', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'AI can learn music patterns and compose its own songs. It can make happy, sad, or exciting tunes.' } },
      { id: 'c4-5', title: 'Logic Puzzle', type: 'logic_puzzle', starsAwarded: 10, missionType: 'logic_puzzle', missionData: { puzzle: 'I don\'t have a mouth, but I can write a whole story for you. I don\'t have hands, but I can paint a beautiful picture of a dragon. What am I?', correctAnswer: 'AI', placeholder: 'What am I?' } },
      { id: 'c4-6', title: 'Creative Coding Game', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Let\'s create some art with AI! We want to draw a big, cheerful, happy sun. Finish the command to tell the AI what to draw.', codeBefore: 'AI.draw("', codeAfter: '");', options: ['sad moon', 'happy sun', 'sleepy cloud'], correctAnswerIndex: 1 } },
      { id: 'c4-7', title: 'What is a "Prompt"?', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'A "prompt" is the instruction you give to an AI. A good prompt helps the AI understand exactly what you want it to create.' } },
      { id: 'c4-8', title: 'Prompt Challenge', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'What is a better prompt: "Draw a dog" or "Draw a fluffy golden retriever puppy playing with a red ball"?', keywords: ['fluffy', 'golden retriever', 'second one'], placeholder: 'Which prompt is more detailed?' } },
      { id: 'c4-9', title: 'Writing with AI', type: 'tip', starsAwarded: 10, missionType: 'info', missionData: { text: 'AI can help you write stories by giving you ideas, helping you with tricky words, or even writing a whole paragraph!' } },
      { id: 'c4-10', title: 'Art Exam', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'What does "generative" AI do?', options: ['It solves math problems', 'It cleans your room', 'It creates new things'], correctAnswerIndex: 2 } },
      { id: 'c4-11', title: 'Choose a Style', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Every artist has a style! Let\'s tell our AI artist to create a picture that looks like a fun cartoon. Choose the right style option!', codeBefore: 'AI.create_image(prompt, style="', codeAfter: '");', options: ['cartoon', 'realistic', 'photo'], correctAnswerIndex: 0 } },
    ],
  },
  {
    id: 'c5',
    title: 'How AI Talks',
    description: 'Have you ever wondered how smart speakers or characters in games can talk? Dive in and learn the secrets of how AI understands and speaks human languages.',
    Icon: SpeechIcon,
    color: 'from-emerald-400 to-green-500',
    shadowColor: 'shadow-emerald-300/50',
    difficulty: 'Intermediate',
    lessons: [
        { id: 'c5-1', title: 'Human Language', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'Computers think in code, but we talk in words! Natural Language Processing (NLP) is the magic that helps computers understand our language.' } },
        { id: 'c5-2', title: 'Chatbot Greeting', type: 'challenge', starsAwarded: 15, missionType: 'q_and_a', missionData: { question: 'You are programming a friendly chatbot. What is the first thing it should say to a user?', keywords: ['hello', 'hi', 'welcome', 'help'], placeholder: 'e.g., "Hello! How can I help?"' } },
        { id: 'c5-3', title: 'Sentiment Analysis', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'If a user says "I love this game!", is their sentiment (feeling) positive or negative?', options: ['Positive', 'Negative', 'Neutral'], correctAnswerIndex: 0 } },
        { id: 'c5-4', title: 'Text to Speech', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'Text-to-speech is when an AI reads text out loud, like when your GPS gives you directions. Speech-to-text is the opposite: turning your voice into words!' } },
        { id: 'c5-5', title: 'Translate the Phrase', type: 'challenge', starsAwarded: 15, missionType: 'fill_in_the_blanks', missionData: { prompt: 'Fill in the blank to ask the AI to translate "Hello" to Spanish.', parts: ['Translate "Hello" to ', {id:'b1', correctValue:'Spanish'}], options: ['Spanish', 'French', 'Robotic']}},
        { id: 'c5-6', title: 'Bot Reply', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'A friendly chatbot is here to assist! Let\'s program its opening line. Complete the code so it asks, "How can I help?".', codeBefore: 'bot.reply("', codeAfter: '");', options: ['How can I help?', 'I am busy.', 'Goodbye.'], correctAnswerIndex: 0 } },
    ]
  },
  {
    id: 'c6',
    title: 'AI in Games',
    description: 'Go behind the scenes of your favorite video games! Find out how AI makes game characters smart, challenging, and fun to play against.',
    Icon: GhostIcon,
    color: 'from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-400/50',
    difficulty: 'Intermediate',
    lessons: [
        { id: 'c6-1', title: 'Smart Enemies', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'In games, AI helps non-player characters (NPCs) act smart. Instead of just walking in a line, they can chase you, hide, or even work as a team!' } },
        { id: 'c6-2', title: 'Pathfinding', type: 'challenge', starsAwarded: 15, missionType: 'q_and_a', missionData: { question: 'What is it called when an AI game character finds the best route around obstacles to reach you?', keywords: ['pathfinding', 'path finding'], placeholder: 'It\'s called...' } },
        { id: 'c6-3', title: 'Decision Trees', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'An enemy AI sees the player. It can either attack or run away. What is this choice called?', options: ['A guess', 'A decision', 'A mistake'], correctAnswerIndex: 1 } },
        { id: 'c6-4', title: 'Procedural Generation', type: 'tip', starsAwarded: 15, missionType: 'info', missionData: { text: 'Some games use AI to build new levels every time you play! This is called "procedural generation", and it means you never run out of new worlds to explore.' } },
        { id: 'c6-5', title: 'Game AI Logic', type: 'logic_puzzle', starsAwarded: 15, missionType: 'logic_puzzle', missionData: { puzzle: 'A monster chases you if you are close, but runs away if its health is low. If you are close AND its health is low, what will it do?', correctAnswer: 'Run away', placeholder: 'Attack or Run away?' } },
        { id: 'c6-6', title: 'Enemy Action', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'Watch out! The sneaky monster in our game needs to chase the hero. Let\'s set its action. Complete the code to make the enemy chase the player.', codeBefore: 'enemy.action =', codeAfter: ';', options: ['chase(player)', 'run_away()', 'stand_still()'], correctAnswerIndex: 0 } },
    ]
  },
  {
    id: 'c7',
    title: 'Problem Solving with AI',
    description: 'Become a super problem-solver! Train an AI to think its way through tricky puzzles, find the best path through a maze, and make smart decisions all by itself.',
    Icon: PuzzleIcon,
    color: 'from-amber-400 to-yellow-500',
    shadowColor: 'shadow-amber-300/50',
    difficulty: 'Intermediate',
    lessons: [
        { id: 'c7-1', title: 'AI as a Detective', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'AI is great at solving problems because it can look at many possible solutions at once, much faster than a human can!' } },
        { id: 'c7-2', title: 'Solving a Maze', type: 'challenge', starsAwarded: 15, missionType: 'drag_drop_order', missionData: { prompt: 'To solve a maze, what is a good set of steps for an AI?', items: [{id:'m1', content:'Look at all possible paths'},{id:'m2', content:'Choose the shortest one'},{id:'m3', content:'Reach the end!'},{id:'m4', content:'Start at the beginning'}], correctOrder: ['m4', 'm1', 'm2', 'm3']}},
        { id: 'c7-3', title: 'What is an Algorithm?', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'A set of rules or steps that an AI follows to solve a problem is called:', options: ['A guess', 'An algorithm', 'A feeling'], correctAnswerIndex: 1 } },
        { id: 'c7-4', title: 'The Best Move', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'In games like chess or tic-tac-toe, an AI looks at all possible future moves to decide which one is the very best to play right now.' } },
        { id: 'c7-5', title: 'Maze Escape', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'Success! Our super-smart AI has solved the maze and found the exit! What should it do now? Let\'s give it a command to celebrate its victory.', codeBefore: 'if (at_exit) {', codeAfter: '}', options: ['go_back();', 'celebrate();', 'keep_searching();'], correctAnswerIndex: 1 } },
    ]
  },
  {
    id: 'c8',
    title: 'Understanding Data',
    description: 'Data is the superpower that makes AI smart! Become a data detective and learn how AI uses clues (information) to learn, spot patterns, and predict what might happen next.',
    Icon: ChartIcon,
    color: 'from-teal-400 to-cyan-500',
    shadowColor: 'shadow-teal-300/50',
    difficulty: 'Intermediate',
    lessons: [
        { id: 'c8-1', title: 'Data is Information', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'Data is just a collection of facts, like your name, your age, or the color of your shirt. AI loves to learn from data!' } },
        { id: 'c8-2', title: 'Training an AI', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'You "train" an AI by showing it lots of labeled data. For example, you show it 1000 pictures labeled "cat" and 1000 labeled "dog" to learn what they look like.' } },
        { id: 'c8-3', title: 'Finding Patterns', type: 'challenge', starsAwarded: 15, missionType: 'q_and_a', missionData: { question: 'If you see data that shows ice cream sales go up when the weather is hot, what is the pattern?', keywords: ['hot', 'sun', 'warm', 'summer', 'ice cream'], placeholder: 'When it gets hotter, people...' } },
        { id: 'c8-4', title: 'Making Predictions', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'Once an AI learns patterns from data, it can make a very good guess, or a "prediction", about new things it has never seen before!' } },
        { id: 'c8-5', title: 'Detective Exam', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'Why does an AI need a lot of data?', options: ['It gets hungry', 'To learn and get smarter', 'To fill up its hard drive'], correctAnswerIndex: 1 } },
        { id: 'c8-6', title: 'Sort the Data', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'Data detectives, we have a list of numbers all jumbled up! Let\'s use a sorting command to arrange them from the smallest to the largest. Choose the right word for the command.', codeBefore: 'data.sort("', codeAfter: '");', options: ['random', 'descending', 'ascending'], correctAnswerIndex: 2 } },
    ]
  },
    {
    id: 'c9',
    title: 'Neural Networks',
    description: 'Take a journey into the brain of an AI! Discover how Neural Networks, inspired by our own brains, help machines to learn and connect ideas in a powerful way.',
    Icon: NetworkIcon,
    color: 'from-violet-500 to-fuchsia-600',
    shadowColor: 'shadow-violet-400/50',
    difficulty: 'Advanced',
    lessons: [
        { id: 'c9-1', title: 'The AI Brain', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'A neural network is like the AI\'s brain. It\'s made of many connected "neurons" that work together to process information, similar to how our brain cells work.' } },
        { id: 'c9-2', title: 'What is a Neuron?', type: 'challenge', starsAwarded: 20, missionType: 'q_and_a', missionData: { question: 'In an AI\'s neural network, what is a single little worker that processes a piece of information called?', keywords: ['neuron'], placeholder: 'It is called a...' } },
        { id: 'c9-3', title: 'Learning Connections', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'When a neural network learns, it strengthens or weakens the connections between its neurons. This is how it remembers patterns, like how to tell a cat from a dog.' } },
        { id: 'c9-4', title: 'Layers of Thinking', type: 'exam', starsAwarded: 20, missionType: 'quiz', missionData: { question: 'A deep neural network has many what?', options: ['Colors', 'Layers of neurons', 'Buttons'], correctAnswerIndex: 1 } },
        { id: 'c9-5', title: 'Neuron Fire', type: 'coding_challenge', starsAwarded: 20, missionType: 'coding_game', missionData: { prompt: 'Inside an AI\'s brain, a little worker called a neuron gets a signal. If the signal is strong enough, it needs to \'fire\' and pass the message on! Complete the code for this action.', codeBefore: 'if (input > threshold) {', codeAfter: '}', options: ['neuron.fire();', 'neuron.sleep();', 'neuron.wait();'], correctAnswerIndex: 0 } },
    ]
  },
  {
    id: 'c10',
    title: 'AI Safety',
    description: 'With great power comes great responsibility! Learn why it is so important to build AI that is fair, safe, and helpful for everyone in the world.',
    Icon: ShieldIcon,
    color: 'from-lime-400 to-green-500',
    shadowColor: 'shadow-lime-300/50',
    difficulty: 'Advanced',
    lessons: [
      { id: 'c10-1', title: 'Safety First', type: 'tip', starsAwarded: 20, missionType: 'info', missionData: { text: 'AI is a powerful tool, and we must ensure it is used responsibly and ethically for the benefit of everyone.' } },
      { id: 'c10-2', title: 'Fairness is Key', type: 'challenge', starsAwarded: 20, missionType: 'q_and_a', missionData: { question: 'If an AI that helps doctors only learned from data about grown-ups, why might it be unfair for kids?', keywords: ['kids', 'children', 'different', 'wrong'], placeholder: 'Because kids are...' } },
      { id: 'c10-3', title: 'What is Bias?', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'Bias is a form of unfairness. If an AI that suggests jobs only saw pictures of male firefighters, it might be biased and not suggest that job to women.' } },
      { id: 'c10-4', title: 'Privacy and Security', type: 'tip', starsAwarded: 20, missionType: 'info', missionData: { text: 'AI should be private and secure, protecting your personal information from being misused.' } },
      { id: 'c10-5', title: 'Who is Responsible?', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'Accountability matters. If an AI makes a mistake, there should be a way to fix it and know who is responsible.' } },
      { id: 'c10-6', title: 'Humans in Control', type: 'tip', starsAwarded: 20, missionType: 'info', missionData: { text: 'Human oversight is important. People should always be in control of powerful AI systems.' } },
      { id: 'c10-7', title: 'Safety Final Exam', type: 'exam', starsAwarded: 20, missionType: 'quiz', missionData: { question: 'What is a key principle in AI Safety?', options: ['Making AI faster', 'Ensuring AI is fair and unbiased', 'Creating AI that plays games'], correctAnswerIndex: 1 } },
    ]
  },
  {
    id: 'c11',
    title: 'AI for Good',
    description: 'See how AI can be a superhero for our planet! Explore how AI helps doctors, protects endangered animals, and finds new ways to care for the Earth.',
    Icon: WorldIcon,
    color: 'from-cyan-400 to-sky-500',
    shadowColor: 'shadow-cyan-300/50',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c11-1', title: 'Helping Doctors', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'AI can help doctors find sicknesses earlier by looking at pictures like X-rays. It\'s like having super-vision!' } },
      { id: 'c11-2', title: 'Protecting Animals', type: 'challenge', starsAwarded: 15, missionType: 'q_and_a', missionData: { question: 'How can an AI drone help protect elephants from far away?', keywords: ['count', 'find', 'watch', 'track'], placeholder: 'e.g., It can...' } },
      { id: 'c11-3', title: 'Weather Watcher', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'How does AI help predict the weather?', options: ['It asks the clouds', 'It looks for patterns in weather data', 'It makes the wind blow'], correctAnswerIndex: 1 } },
      { id: 'c11-4', title: 'Making Farming Smarter', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'AI can tell farmers exactly which plants need more water. This saves water and helps grow more food!' } },
      { id: 'c11-5', title: 'AI Superhero Quiz', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'Which is a "superpower" of AI for Good?', options: ['Telling jokes', 'Finding lost pets with drones', 'Eating pizza'], correctAnswerIndex: 1 } },
      { id: 'c11-6', title: 'Language Helper', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'AI can be a super translator! Let\'s ask it to translate the word "hello" into Spanish. Pick the correct target language.', codeBefore: 'AI.translate("hello", target_language="', codeAfter: '");', options: ['French', 'Spanish', 'German'], correctAnswerIndex: 1 } },
    ],
  },
  {
    id: 'c12',
    title: 'Creative AI Studio',
    description: 'Step into the studio where you are the director and AI is your creative partner! Learn to write amazing prompts to generate unique art, stories, and music.',
    Icon: BrushIcon,
    color: 'from-pink-400 to-rose-500',
    shadowColor: 'shadow-pink-300/50',
    difficulty: 'Beginner',
    lessons: [
      { id: 'c12-1', title: 'Drawing with Words', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'You can type a sentence like "a blue cat flying in space" and a creative AI can draw it for you! This is called text-to-image.' } },
      { id: 'c12-2', title: 'AI Music Maker', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'AI can also create music! It can learn different styles and compose a brand new song, from happy pop to calm music.' } },
      { id: 'c12-3', title: 'Your AI Story Buddy', type: 'drawing_challenge', starsAwarded: 10, missionType: 'info', missionData: { text: 'An AI can be a great writing helper! It can give you ideas for characters, settings, and what happens next in your story.' } },
      { id: 'c12-4', title: 'Prompt Power', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'The instruction you give to an AI is called a "prompt". The more detailed your prompt is, the better the AI can understand what you want to create!' } },
      { id: 'c12-5', title: 'What is a "Prompt"?', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'When you talk to a creative AI, your instruction is called a:', options: ['Shout', 'Wish', 'Prompt'], correctAnswerIndex: 2 } },
      { id: 'c12-6', title: 'Compose a Song', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'Let\'s ask our AI composer for a happy tune. Complete the code.', codeBefore: 'AI.compose_music(mood="', codeAfter: '");', options: ['sad', 'happy', 'angry'], correctAnswerIndex: 1 } },
    ],
  },
  {
    id: 'c13',
    title: 'Web Wizards',
    description: 'The internet is a magical place built with code! Discover how websites work and how AI is making them smarter, from helpful chatbots to personalized experiences.',
    Icon: GlobeIcon,
    color: 'from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-400/50',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c13-1', title: 'What is a Website?', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'A website is like a book on the internet, with pages you can click to visit. Every page is made with code!' } },
      { id: 'c13-2', title: 'HTML is the Skeleton', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'HTML (HyperText Markup Language) gives a website its structure, like the bones in your body. It creates titles, paragraphs, and links.' } },
      { id: 'c13-3', title: 'CSS Makes It Pretty', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'CSS (Cascading Style Sheets) is like the paint and clothes for your website. It adds colors, fonts, and layouts to make it look great!' } },
      { id: 'c13-4', title: 'JavaScript Adds Magic', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'JavaScript is the magic that makes websites interactive. It creates animations, games, and lets you click on buttons!' } },
      { id: 'c13-5', title: 'Website Quiz', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'Which code is for the structure of a website?', options: ['CSS', 'HTML', 'JavaScript'], correctAnswerIndex: 1 } },
      { id: 'c13-6', title: 'Change Text Color', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'Let\'s make the main title blue. Finish the styling code.', codeBefore: 'title.style.color = "', codeAfter: '";', options: ['red', 'blue', 'green'], correctAnswerIndex: 1 } },
    ],
  },
  {
    id: 'c14',
    title: 'Data Detectives',
    description: 'Put on your detective hat! Learn how to find clues in data and see how AI uses these patterns to solve mysteries and make amazing predictions.',
    Icon: DatabaseIcon,
    color: 'from-gray-400 to-slate-500',
    shadowColor: 'shadow-gray-300/50',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c14-1', title: 'Data is Information', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'Data is just a collection of facts, like your name, your age, or the color of your shirt. AI loves to learn from data!' } },
      { id: 'c14-2', title: 'Training an AI', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'You "train" an AI by showing it lots of labeled data. For example, you show it 1000 pictures labeled "cat" and 1000 labeled "dog" to learn what they look like.' } },
      { id: 'c14-3', title: 'Finding Patterns', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'AIs are great detectives because they can find patterns in huge amounts of data that people might miss. Like finding what ice cream flavor is most popular in summer.' } },
      { id: 'c14-4', title: 'Making Predictions', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'Once an AI learns patterns from data, it can make a very good guess, or a "prediction", about new things it has never seen before!' } },
      { id: 'c14-5', title: 'Detective Exam', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'Why does an AI need a lot of data?', options: ['It gets hungry', 'To learn and get smarter', 'To fill up its hard drive'], correctAnswerIndex: 1 } },
      { id: 'c14-6', title: 'Make a Prediction', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'Let\'s ask the model to guess what it sees in an image. Complete the code.', codeBefore: 'model.predict(', codeAfter: ');', options: ['text', 'image', 'sound'], correctAnswerIndex: 1 } },
    ],
  },
  {
    id: 'c15',
    title: 'Game Design Guild',
    description: 'Ready to design your own game? Learn the secrets to making fun games and use AI to create smarter characters and endlessly new worlds to explore.',
    Icon: GamepadIcon,
    color: 'from-red-500 to-rose-600',
    shadowColor: 'shadow-red-400/50',
    difficulty: 'Advanced',
    lessons: [
      { id: 'c15-1', title: 'What Makes a Fun Game?', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'A good game needs a goal (like reaching the finish line), rules (how to play), and a challenge (making it not too easy!).' } },
      { id: 'c15-2', title: 'Smarter Enemies', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'Game AI helps enemies act smart. Instead of just walking back and forth, they can follow you, hide, or work as a team!' } },
      { id: 'c15-3', title: 'What is Pathfinding?', type: 'challenge', starsAwarded: 20, missionType: 'q_and_a', missionData: { question: 'What is it called when an AI character finds the best way to get from one spot to another?', keywords: ['pathfinding', 'path finding', 'finding a path'], placeholder: 'It\'s called...' } },
      { id: 'c15-4', title: 'Procedural Generation', type: 'tip', starsAwarded: 20, missionType: 'info', missionData: { text: 'Some games use AI to build levels automatically, so you get a new maze or world to explore every time you play! This is called "procedural generation".' } },
      { id: 'c15-5', title: 'Game AI Quiz', type: 'exam', starsAwarded: 20, missionType: 'quiz', missionData: { question: 'What does game AI help with?', options: ['Making characters smarter', 'Designing cool costumes', 'Choosing the music'], correctAnswerIndex: 0 } },
      { id: 'c15-6', title: 'Game Over Logic', type: 'coding_challenge', starsAwarded: 20, missionType: 'coding_game', missionData: { prompt: 'Oh no, the player has run out of health! In our game, that means it\'s game over. Let\'s write the rule for what happens when health reaches zero.', codeBefore: 'if (player.health <= 0) {', codeAfter: '}', options: ['game_over();', 'level_up();', 'add_health();'], correctAnswerIndex: 0 } },
    ]
  },
  {
    id: 'c16',
    title: 'About AI',
    description: "Where did AI come from and where is it going? This course is your time machine to explore the history of AI and its incredible impact on our world.",
    Icon: BrainIcon,
    color: 'from-indigo-500 to-violet-600',
    shadowColor: 'shadow-indigo-400/50',
    difficulty: 'Beginner',
    lessons: [
      { id: 'c16-1', title: 'What is AI, Really?', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'AI, or Artificial Intelligence, is about creating smart machines that can think, learn, and solve problems, much like humans do.' } },
      { id: 'c16-2', title: 'A Quick Trip in Time', type: 'lesson', starsAwarded: 10, missionType: 'drag_drop_order', missionData: { prompt: 'AI ideas are old! Put these events in order from oldest to newest:', items: [{id: 'i1', content: 'Early ideas of "thinking machines"'}, {id: 'i2', content: 'First AI computer programs'}, {id: 'i3', content: 'AI beats world chess champion'}, {id: 'i4', content: 'AI helps us on our phones'}], correctOrder: ['i1', 'i2', 'i3', 'i4'] } },
      { id: 'c16-3', title: 'Being a Good AI Friend', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'Why is it important for an AI to be fair and kind?', keywords: ['fair', 'kind', 'safe', 'helpful', 'nice'], placeholder: 'Because it should be...' } },
      { id: 'c16-4', title: 'Narrow vs. General AI', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'The AI in a game that only knows how to play that one game is called:', options: ['Super Smart AI', 'Narrow AI', 'General AI'], correctAnswerIndex: 1 } },
      { id: 'c16-5', title: 'How Machines Learn', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'Machine Learning is teaching a computer by showing it lots of examples. For instance, show it 1,000 cat pictures, and it learns to recognize a cat!' } },
      { id: 'c16-6', title: 'The AI Brain', type: 'tip', starsAwarded: 10, missionType: 'info', missionData: { text: 'Neural Networks are like the AI\'s brain, made of connected "neurons." They pass messages to each other to learn complex things.' } },
      { id: 'c16-7', title: 'AI All Around Us', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'Think about a movie you watched online. How did AI help you find it?', keywords: ['recommend', 'suggestion', 'showed me', 'list'], placeholder: 'It might have...' } },
      { id: 'c16-8', title: 'What\'s Next for AI?', type: 'tip', starsAwarded: 10, missionType: 'info', missionData: { text: 'In the future, AI could help us discover new medicines, explore space, and create amazing new art and music!' } },
      { id: 'c16-9', title: 'Jobs with AI', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'People who work with AI are called AI engineers, data scientists, and more. They get to build the future!' } },
      { id: 'c16-10', title: 'AI Expert Challenge', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'What is the main goal of AI ethics?', options: ['To make AI faster', 'To make sure AI is used for good', 'To make AI play games better'], correctAnswerIndex: 1 } },
      { id: 'c16-11', title: 'AI Training Day', type: 'coding_challenge', starsAwarded: 10, missionType: 'coding_game', missionData: { prompt: 'We need to teach our AI to recognize pictures of apples. Let\'s feed it some training data! Complete the code.', codeBefore: 'model.train_on(', codeAfter: ');', options: ['"a single song"', '"one book"', '"many_apple_pictures"'], correctAnswerIndex: 2 } },
    ]
  },
  {
    id: 'c17',
    title: 'AI in Robotics',
    description: 'Give a robot its brain! Learn how AI helps robots to see the world with cameras, navigate around obstacles, and perform complex tasks all on their own.',
    Icon: RobotIcon,
    color: 'from-cyan-500 to-blue-600',
    shadowColor: 'shadow-cyan-400/50',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c17-1', title: 'The Robot Brain', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'AI acts as the brain for robots, helping them understand their surroundings and decide what to do next.' } },
      { id: 'c17-2', title: 'Robot Vision', type: 'challenge', starsAwarded: 15, missionType: 'q_and_a', missionData: { question: 'If a robot needs to pick up a red ball, what does its AI brain need to do first?', keywords: ['see', 'find', 'look', 'identify', 'recognize'], placeholder: 'It needs to...' } },
      { id: 'c17-3', title: 'Finding the Path', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'Pathfinding is how a robot\'s AI plans the best route to get from one point to another without bumping into things.' } },
      { id: 'c17-4', title: 'Robotics Quiz', type: 'exam', starsAwarded: 15, missionType: 'quiz', missionData: { question: 'What do sensors give the robot\'s AI brain?', options: ['Energy', 'Information', 'Wheels'], correctAnswerIndex: 1 } },
      { id: 'c17-5', title: 'Emergency Stop', type: 'coding_challenge', starsAwarded: 15, missionType: 'coding_game', missionData: { prompt: 'A robot is moving towards an obstacle! Let\'s program its AI to stop if it gets too close. Complete the code.', codeBefore: 'if (distance < 10) {', codeAfter: '}', options: ['speed_up()', 'stop()', 'turn_around()'], correctAnswerIndex: 1 } },
    ]
  },
  {
    id: 'c18',
    title: 'AI for Creative Writing',
    description: 'Overcome writer\'s block forever! Partner with an AI to brainstorm cool characters, imagine exciting plots, and write fantastic stories and poems together.',
    Icon: SpeechIcon,
    color: 'from-rose-400 to-red-500',
    shadowColor: 'shadow-rose-300/50',
    difficulty: 'Beginner',
    lessons: [
      { id: 'c18-1', title: 'Your AI Story Buddy', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'An AI can be a great writing helper! It can give you ideas for characters, settings, and what happens next in your story.' } },
      { id: 'c18-2', title: 'Create a Character', type: 'drawing_challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'Tell the AI about a character. What is their name and one special thing about them?', keywords: ['name', 'brave', 'funny', 'smart', 'kind'], placeholder: 'e.g., Captain Star, who can fly' } },
      { id: 'c18-3', title: 'The Perfect Prompt', type: 'lesson', starsAwarded: 10, missionType: 'info', missionData: { text: 'A "prompt" is how you ask the AI for help. A clear prompt like "Write a story about a dragon who loves to bake" works best!' } },
      { id: 'c18-4', title: 'Story Idea Exam', type: 'exam', starsAwarded: 10, missionType: 'quiz', missionData: { question: 'What is a good way to start a story with AI?', options: ['Give it a character and a problem', 'Tell it to do math', 'Ask it the weather'], correctAnswerIndex: 0 } },
      { id: 'c18-5', title: 'Finish the Poem', type: 'challenge', starsAwarded: 10, missionType: 'q_and_a', missionData: { question: 'An AI wrote "The sun is bright and yellow, it makes me feel like a happy..." What word would you add?', keywords: ['fellow', 'jello', 'mellow'], placeholder: 'Finish the rhyme!' } },
    ]
  },
  {
    id: 'c19',
    title: 'Understanding AI Data',
    description: 'Go deeper into the world of data! Learn how experts collect, clean, and use data to train powerful AI models that can understand the world in new ways.',
    Icon: ChartIcon,
    color: 'from-teal-400 to-green-500',
    shadowColor: 'shadow-teal-300/50',
    difficulty: 'Advanced',
    lessons: [
      { id: 'c19-1', title: 'Data is Power', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'AI learns from data. The more good data it has, the smarter and more accurate it becomes. Data can be numbers, words, or pictures.' } },
      { id: 'c19-2', title: 'Training an AI', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'You "train" an AI by showing it lots of labeled data. For example, you show it 1000 pictures labeled "cat" and 1000 labeled "dog".' } },
      { id: 'c19-3', title: 'Data Puzzle', type: 'logic_puzzle', starsAwarded: 20, missionType: 'logic_puzzle', missionData: { puzzle: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?', correctAnswer: 'A map', placeholder: 'What am I?' } },
      { id: 'c19-4', title: 'Watch out for Bias!', type: 'exam', starsAwarded: 20, missionType: 'quiz', missionData: { question: 'If you only train an AI on pictures of red apples, what might happen when it sees a green apple?', options: ['It will know it is an apple', 'It might get confused', 'It will turn the apple red'], correctAnswerIndex: 1 } },
      { id: 'c19-5', title: 'Sort the Data', type: 'challenge', starsAwarded: 20, missionType: 'drag_drop_order', missionData: { prompt: 'An AI needs to sort data from smallest to largest. Put these numbers in the correct order:', items: [{id: 'i1', content: '101'},{id: 'i2', content: '25'},{id: 'i3', content: '7'},{id: 'i4', content: '50'}], correctOrder: ['i3', 'i2', 'i4', 'i1']} },
    ]
  },
  {
    id: 'c20',
    title: 'AI Logic & Diagrams',
    description: 'Learn to think like an AI! Create flowcharts, connect ideas, and design logical roadmaps to solve complex problems visually.',
    Icon: ChartIcon,
    color: 'from-cyan-400 to-teal-500',
    shadowColor: 'shadow-cyan-300/50',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c20-1', title: 'What is a Flowchart?', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'A flowchart is a picture that shows the steps to solve a problem. It uses special shapes for start, end, actions, and decisions!' } },
      { id: 'c20-2', title: 'Build a Simple Diagram', type: 'challenge', starsAwarded: 15, missionType: 'drag_drop_order', missionData: { prompt: 'To make toast, you need to follow steps. Put these actions in the correct order:', items: [{id: 't1', content: 'Put bread in toaster'},{id: 't2', content: 'Push toaster lever'},{id: 't3', content: 'Wait for toast'},{id: 't4', content: 'Enjoy toast!'}], correctOrder: ['t1', 't2', 't3', 't4']} },
      { id: 'c20-3', title: 'The Diamond Shape', type: 'lesson', starsAwarded: 15, missionType: 'info', missionData: { text: 'In a flowchart, a diamond shape is used for decisions. It asks a "Yes" or "No" question, like "Is it raining?".' } },
      { id: 'c20-4', title: 'Design a Robot\'s Path', type: 'challenge', starsAwarded: 15, missionType: 'q_and_a', missionData: { question: 'A robot needs to get a red ball from across the room. What is the first command in its roadmap?', keywords: ['forward', 'move', 'start', 'go'], placeholder: 'e.g., Move forward' } },
      { id: 'c20-5', title: 'Logic Puzzle Exam', type: 'exam', starsAwarded: 15, missionType: 'logic_puzzle', missionData: { puzzle: 'If a blue car turns right, then left, then right again, which way is it turning last?', correctAnswer: 'Right', placeholder: 'e.g., Left or Right' } },
    ]
  },
  {
    id: 'c21',
    title: 'Visual Programming Power',
    description: 'Go beyond basic blocks! Learn to create powerful programs by drawing lines to connect functions and designing visual roadmaps for your code.',
    Icon: PuzzleIcon,
    color: 'from-fuchsia-500 to-pink-600',
    shadowColor: 'shadow-fuchsia-400/50',
    difficulty: 'Advanced',
    lessons: [
      { id: 'c21-1', title: 'Connecting Nodes', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'In visual programming, you connect "nodes" (blocks of code) with lines to show how data flows. It looks like a spider web of logic!' } },
      { id: 'c21-2', title: 'Draw a Line to a Function', type: 'exam', starsAwarded: 20, missionType: 'quiz', missionData: { question: 'If you have a "Player Position" node and a "Move Enemy" node, what does drawing a line between them do?', options: ['It makes the enemy move towards the player', 'It deletes the player', 'It makes the game easier'], correctAnswerIndex: 0 } },
      { id: 'c21-3', title: 'Event-Driven Logic', type: 'lesson', starsAwarded: 20, missionType: 'info', missionData: { text: 'You can start a chain of actions with an event node, like "On Button Click." Connecting other nodes to this makes them run when the button is clicked.' } },
      { id: 'c21-4', title: 'Roadmap Logic', type: 'challenge', starsAwarded: 20, missionType: 'q_and_a', missionData: { question: 'To make a light turn on, you connect a "Switch" node to a "Light" node. What information does the line carry?', keywords: ['on', 'off', 'true', 'false', 'boolean'], placeholder: 'e.g., On or off' } },
      { id: 'c21-5', title: 'Visual Code Challenge', type: 'exam', starsAwarded: 20, missionType: 'coding_game', missionData: { prompt: 'We need to link the player\'s "Health" data to the "Health Bar" on the screen so it updates. What should we connect to the health bar?', codeBefore: 'HealthBar.update_with(', codeAfter: ');', options: ['"score_data"', '"player_health_data"', '"enemy_position_data"'], correctAnswerIndex: 1 } },
    ]
  },
  {
    id: 'c22',
    title: 'Logic Builders: Code & Control',
    description: 'Learn to think like a programmer! Create step-by-step instructions (algorithms) to guide characters, solve puzzles, and make things move.',
    Icon: PuzzleIcon,
    color: 'from-lime-400 to-green-500',
    shadowColor: 'shadow-lime-300/50',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c22-1', title: 'Move the Square', type: 'coding_challenge', starsAwarded: 25, missionType: 'coding_game', missionData: { prompt: 'Let\'s make the blue square move one step to the right. Choose the correct function!', codeBefore: 'square.', codeAfter: '();', options: ['moveRight', 'moveUp', 'stayStill'], correctAnswerIndex: 0 } },
      { id: 'c22-2', title: 'Snake\'s Lunch', type: 'challenge', starsAwarded: 25, missionType: 'drag_drop_order', missionData: { prompt: 'The snake is hungry! Put the commands in order to make it reach the apple.', items: [{id: 's1', content: 'Move Forward'}, {id: 's2', content: 'Turn Right'}, {id: 's3', content: 'Move Forward'}, {id: 's4', content: 'Eat Apple'}], correctOrder: ['s1', 's2', 's3', 's4']} },
      { id: 'c22-3', title: 'If This, Then That', type: 'coding_challenge', starsAwarded: 25, missionType: 'coding_game', missionData: { prompt: 'Let\'s teach our character to jump over puddles. If it sees a puddle, it should jump!', codeBefore: 'if (sees_puddle) {', codeAfter: '}', options: ['jump()', 'walk()', 'stop()'], correctAnswerIndex: 0 } },
      { id: 'c22-4', title: 'Loop the Loop', type: 'coding_challenge', starsAwarded: 25, missionType: 'coding_game', missionData: { prompt: 'This robot loves to spin! Use a loop to make it spin around exactly 3 times.', codeBefore: 'repeat(3) {', codeAfter: '}', options: ['spin()', 'jump()', 'sleep()'], correctAnswerIndex: 0 } },
      { id: 'c22-5', title: 'Robot\'s Morning Routine', type: 'challenge', starsAwarded: 25, missionType: 'drag_drop_order', missionData: { prompt: 'A robot needs clear instructions. Put its morning routine in the correct order.', items: [{id: 'r1', content: 'Wake Up'}, {id: 'r2', content: 'Charge Battery'}, {id: 'r3', content: 'System Check'}, {id: 'r4', content: 'Start Daily Tasks'}], correctOrder: ['r1', 'r2', 'r3', 'r4']} },
      { id: 'c22-6', title: 'Debugging Puzzle', type: 'logic_puzzle', starsAwarded: 25, missionType: 'logic_puzzle', missionData: { puzzle: 'A robot is told: "Turn Left, Move, Turn Left, Move". If it starts facing North, what direction is it facing at the end?', correctAnswer: 'South', placeholder: 'e.g., North, East...' } },
      { id: 'c22-7', title: 'Variable Vault', type: 'coding_challenge', starsAwarded: 25, missionType: 'coding_game', missionData: { prompt: 'We use a variable called `points` to store a score. To add 5 points to the current score, what should we do?', codeBefore: 'points = points +', codeAfter: ';', options: ['5', '10', '"five"'], correctAnswerIndex: 0 } },
      { id: 'c22-8', title: 'Final Logic Exam', type: 'exam', starsAwarded: 25, missionType: 'quiz', missionData: { question: 'What is a set of step-by-step instructions for a computer called?', options: ['A recipe', 'A guess', 'An algorithm'], correctAnswerIndex: 2 } },
    ]
  },
  {
    id: 'c23',
    title: 'Robo-Navigator: Pathfinding Puzzles',
    description: 'Become a master navigator! Design paths for friendly robots, ants, and bees to help them reach their goals. Learn the smart ways AI finds the best route.',
    Icon: NetworkIcon,
    color: 'from-cyan-400 to-sky-500',
    shadowColor: 'shadow-cyan-300/50',
    difficulty: 'Intermediate',
    lessons: [
      { id: 'c23-1', title: 'The Ant\'s Trail', type: 'challenge', starsAwarded: 25, missionType: 'drag_drop_order', missionData: { prompt: 'An ant needs to follow a trail to its food. Put the directions in the correct order.', items: [{id: 'a1', content: 'Go around the big leaf'}, {id: 'a2', content: 'Cross the tiny twig'}, {id: 'a3', content: 'Climb the small rock'}, {id: 'a4', content: 'Find the food!'}], correctOrder: ['a1', 'a2', 'a3', 'a4']} },
      { id: 'c23-2', title: 'Bee\'s Honey Hunt', type: 'challenge', starsAwarded: 25, missionType: 'drag_drop_order', missionData: { prompt: 'Help the bee fly from the hive to the flower patch. Order the steps for its journey!', items: [{id: 'b1', content: 'Fly out of the hive'}, {id: 'b2', content: 'Fly past the tall tree'}, {id: 'b3', content: 'Fly over the pond'}, {id: 'b4', content: 'Land on the flowers'}], correctOrder: ['b1', 'b2', 'b3', 'b4']} },
      { id: 'c23-3', title: 'What is Pathfinding?', type: 'lesson', starsAwarded: 25, missionType: 'info', missionData: { text: 'Pathfinding is like solving a maze! It\'s how AI and game characters find the best and shortest route from a start point to an end point, avoiding any obstacles.' } },
      { id: 'c23-4', title: 'Shortest Route Challenge', type: 'exam', starsAwarded: 30, missionType: 'quiz', missionData: { question: 'If there are two paths to a castle, one with 3 steps and one with 5 steps, which one would a pathfinding AI choose?', options: ['The 5-step path', 'The 3-step path', 'It would get confused'], correctAnswerIndex: 1 } },
      { id: 'c23-5', title: 'Rabbit\'s Carrot Maze', type: 'challenge', starsAwarded: 30, missionType: 'drag_drop_order', missionData: { prompt: 'Guide the rabbit through the maze to the giant carrot! Place the directions in the right sequence.', items: [{id: 'rb1', content: 'Turn Right at the fork'}, {id: 'rb2', content: 'Go Straight past the bush'}, {id: 'rb3', content: 'Turn Left at the stump'}, {id: 'rb4', content: 'Get the carrot!'}], correctOrder: ['rb2', 'rb1', 'rb3', 'rb4']} },
      { id: 'c23-6', title: 'Bus Route Planner', type: 'challenge', starsAwarded: 30, missionType: 'drag_drop_order', missionData: { prompt: 'You\'re a bus driver! Plan your route to pick everyone up in order.', items: [{id: 'bs1', content: 'Start at the Bus Depot'}, {id: 'bs2', content: 'Stop at the Library'}, {id: 'bs3', content: 'Stop at the Park'}, {id: 'bs4', content: 'Stop at the School'}], correctOrder: ['bs1', 'bs2', 'bs3', 'bs4']} },
      { id: 'c23-7', title: 'Avoiding Obstacles', type: 'coding_challenge', starsAwarded: 30, missionType: 'coding_game', missionData: { prompt: 'Our robot car needs to avoid walls. If the sensor sees a wall ahead, what should it do?', codeBefore: 'if (sensor.seesWall()) {', codeAfter: '}', options: ['turn()', 'speedUp()', 'stop()'], correctAnswerIndex: 0 } },
      { id: 'c23-8', title: 'Grid World Puzzle', type: 'logic_puzzle', starsAwarded: 35, missionType: 'logic_puzzle', missionData: { puzzle: 'A robot starts at square 1. It moves 2 squares right, then 1 square up. What square is it on now?', correctAnswer: '3 up 1', placeholder: 'e.g. 2 right 2 up' } },
      { id: 'c23-9', title: 'Navigator\'s Final Test', type: 'exam', starsAwarded: 35, missionType: 'quiz', missionData: { question: 'What is the main goal of pathfinding?', options: ['To take the longest route', 'To find the most efficient path', 'To visit every spot on the map'], correctAnswerIndex: 1 } },
    ]
  },
];

export const COURSES: Course[] = rawCourses.map(course => ({
  ...course,
  slug: slugify(course.title),
}));