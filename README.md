# Seesaw Physics Simulation

This project is an interactive seesaw simulation where real world physics rules with precise trigonometic calculations were implemented to simulate seasaw motions realistically. It was built using pure JavaScript, HTML, and CSS. Utilization of multi-threading logic is an important feauture in the project, that enhances the realistic demonstraitions.

**Live Demo:** **https://plokoon68.github.io/seasaw-simulation-mehmet-ors/**

---

## 🚀 Project Summary

This is a simulation where users can drop randomly weighted circle objects onto a seesaw by clicking on the canvas block. With each new object falling on the seasaw plank, the seesaw tilts and seeks balance based on realistic physics principles like Net Torque, Angular Acceleration, and Moment of Inertia. The project aims to demonstrate my skills implementing real-world physics rules in javascript, DOM manipulation, event handling, utilizing javascripts Web Workers for multi-thread like working, real-time animation, and ability to structurize the page elements in a responsive way using html-css.

## ✨ Features

- **Realistic Physics Engine:** A dynamic and smooth tilting animation based on calculations of Torque and Moment of Inertia.
- **Interactive Interface:** Users can drop balls with random weights (1-10 kg) anywhere on the seesaw plank.
- **Real-time Data Indicators:** Set of indicators displaying instantaneous data such as angle, angular velocity, angular acceleration, and the total weight/torque on both left and right side of the seasaw.
- **Logs Panel:** A log list that records the weight and position of each dropped ball.
- **State Management:**
  - **Pause/Continue:** The ability to pause the simulation at any moment and resume it from where it left off.
  - **Reset:** A button to reset the simulation to its initial state.
  - **Local Storage:** Persistent memory that allows the simulation to continue from it was left even after the page is refreshed or closed.
  - **Visual Distance Ruler:** A dynamic ruler indicating the distance from the pivot point.
  - **Dynamic Sound Effects:** Audio effects that generates sound when a weight falls on the plank, its intensity being proportionate to the weight (larger weight generates louder sound when it lands).
