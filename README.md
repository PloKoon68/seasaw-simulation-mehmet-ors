# Seesaw Physics Simulation

This project is an interactive seesaw simulation developed for the Software Developer position at [Insider](https://useinsider.com/). It was built from the ground up using only pure JavaScript, HTML, and CSS.

**Live Demo:** **https://[YOUR_USERNAME].github.io/[YOUR_REPO_NAME]/**

---

## 🚀 Project Summary

This simulation allows users to drop randomly weighted objects onto a seesaw by clicking on it. With each new object, the seesaw tilts and seeks balance based on realistic physics principles like Torque and Moment of Inertia. The project aims to demonstrate skills in DOM manipulation, event handling, asynchronous operations (Web Workers), and real-time animation.

## ✨ Features

- **Realistic Physics Engine:** A dynamic and smooth tilting animation based on calculations of Torque and Moment of Inertia.
- **Interactive Interface:** Users can drop balls with random weights (1-10 kg) anywhere on the seesaw plank.
- **Real-time Data Dashboard:** A panel displaying instantaneous data such as angle, angular velocity, angular acceleration, and the total weight/torque on each side.
- **State Management:**
  - **Pause/Continue:** The ability to pause the simulation at any moment and resume it from where it left off.
  - **Reset:** A button to instantly reset the simulation to its initial state.
  - **Local Storage:** Persistent memory that allows the simulation to continue from its last state even after the page is refreshed or closed.
- **Bonus Features:**
  - **Visual Distance Ruler:** A dynamic ruler indicating the distance from the pivot point.
  - **Dynamic Sound Effects:** Impact sounds that vary in pitch and intensity based on the weight of the falling ball.
  - **Event Log Panel:** A log list that records the weight and position of each dropped ball.

## 🛠️ Tech Stack & Architecture

The project was developed without any external libraries or frameworks, using only **Pure (Vanilla) JavaScript (ES6+), HTML5, and CSS3**.

- **Rendering:** The **HTML5 `<canvas>` API** was used for all drawing and animation tasks.
- **Asynchronous Operations:** **Web Workers** were leveraged to offload complex physics calculations from the main UI thread, ensuring a smooth and non-blocking user experience.

---

## 🏗️ Architectural and Design Decisions (Thought Process)

The primary goal was to build a scalable and maintainable application structure. The following design decisions were made to achieve this:

### 1. Modular File Structure

Following the Separation of Concerns principle, the codebase was split into multiple files. This structure enhances readability and allows each module to focus on its specific responsibility.

-   **`main.js`**: The main entry point of the application. It initializes event listeners and acts as an orchestrator between other modules.
-   **`drawing.js`**: Responsible for all `<canvas>` drawing operations (e.g., `pdrawBall`, `pDrawSeesaw`).
-   **`physics.js`**: Contains pure geometry and physics calculation functions (e.g., `calculateBalltargetY`, `horizontalDistanceToPivot`).
-   **`state.js`**: Manages the simulation's state, including functions for saving, loading, and resetting (`saveStateToLocalStorage`, `resetSeesaw`).
-   **`actions.js`**: Handles user actions and the main game loop logic (`pauseSimulation`, `createNewBall`).
-   **`ui_updates.js`**: A dedicated module for all functions that update HTML elements in the UI.
-   **`threads/`**: A directory containing the Web Workers for asynchronous tasks.
    -   **`rotationThread.js`**: The main brain of the simulation, calculating the rotational physics.
    -   **`fallThread.js`**: Manages the falling dynamics of each ball independently.

### 2. Physics Engine: The Role of Web Workers

To prevent the user interface from freezing during heavy calculations, the physics engine was completely isolated from the main thread.

-   The **`rotationThread.js`** is responsible for calculating the Net Torque and Moment of Inertia every `loopPeriod` (20ms) based on the current state of all balls. From these values, it derives the angular acceleration, updates the angular velocity, and sends the new angle back to `main.js`.
-   For physical accuracy, the torque calculation uses the **Lever Arm principle**, which accounts for the seesaw's current angle (`cos(θ)`). This results in a more realistic oscillation compared to a simpler `d * w` formula.

### 3. Rendering: `<canvas>` vs. DOM

The `<canvas>` API was chosen over DOM manipulation (`div` elements) to ensure fluid and high-performance animations. Canvas provides significantly better performance, especially in scenarios with hundreds of objects, and offers complete, pixel-level control over the rendering process.

## ⚠️ Trade-offs and Limitations

-   **Web Worker Architecture:** While using a separate `fallThread` for each ball and a single `rotationThread` is a robust architectural choice for showcasing skills, a simpler simulation could have managed all animations in the main thread using `requestAnimationFrame`. This design, however, guarantees that the UI remains responsive no matter how complex the simulation becomes.
-   **Physical Realism:** The simulation successfully models fundamental rotational dynamics. More advanced physics concepts such as friction, air resistance, or inter-object collisions were considered outside the scope of this project.
-   **Mobile Responsiveness:** The project was developed primarily for desktop browsers. While `click` events function on mobile devices, the UI has not been fully optimized for smaller screens.

## 🤖 AI Usage

During the development of this project, AI tools (such as ChatGPT/Gemini) were used in the following assistive roles:

-   **Debugging:** Acted as a consultant for verifying complex trigonometric formulas (like the Lever Arm calculation) and identifying the root cause of `NaN` errors.
-   **Algorithm Exploration:** Used to explore different architectural approaches for designing stateful Web Workers that can be updated dynamically.
-   **Refactoring and Code Cleanup:** Provided suggestions for improving function names to be more semantic and for structuring the code into logical, modular blocks.

**AI was not used to generate or write the core logic or framework of the project.** All fundamental coding, architectural decisions, and the problem-solving process were conducted by me.
