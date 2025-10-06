# clickr

A versatile mobile counter application that allows you to create and manage multiple custom counters with an intuitive user interface. Perfect for various counting needs in both personal and professional settings.

## Features

- Create unlimited custom counters
- Easy-to-use tap interface optimized for mobile devices
- Customizable counter names
- Persistent storage of all counters
- Offline functionality
- Native mobile app experience
- Set goals for counters
- Automate counters

## Use Cases

clickr is perfect for various scenarios, such as:

- **Sports & Fitness**
  - Counting laps while running
  - Tracking sets and reps during workouts
  - Recording scores in games

- **Business & Service**
  - Keeping track of customers in venues
  - Managing inventory counts
  - Counting foot traffic at events

- **Personal Use**
  - Bird watching counts
  - Habit tracking
  - Daily task completion
  - Attendance counting
  - Tracking drinks at a bar

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Angular CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ClickerApp.git
```

2. Navigate to the project directory
```bash
cd ClickerApp
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
ng serve
```

5. Open your browser and visit `http://localhost:4200`

### Building Mobile Apps

To build for iOS:
```bash
ng build --prod
npx cap add ios
npx cap sync
npx cap open ios
```

To build for Android:
```bash
ng build --prod
npx cap add android
npx cap sync
npx cap open android
```

## Code Style and Formatting

The project uses ESLint and Prettier for code style enforcement and formatting. The configuration follows Angular's style guide and best practices.

### Available Commands

- `npm run lint` - Run ESLint to check for code style issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Run Prettier to format all files
- `npm run format:check` - Check if files are properly formatted

### Pre-commit Hooks

The project uses Husky and lint-staged to automatically run code style checks and formatting on staged files before each commit. This ensures consistent code style across the project.

## Technologies Used

- Angular
- Angular Material UI
- Capacitor
- TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by the need for a simple yet versatile counting solution


## Changelog:

### 1.0.2 -> 1.1.0

#### New Features

* **Automation**: Create automations for counters
  * Configure to run at specific intervals: daily, weekly, monthly and yearly
  * Configure counter to increment, reset or set to specific value

### 1.0.0 -> 1.0.2

#### Improvements

* Suggestions on home screen now link to pre-filled counter creation

#### Bug fixes

* Fixed header spacing with several iPhones with notch or dynamic island
* Fixed toolbar labelling on detail view

